import { conversationsApi } from "@/services/api/conversations";
import { messagesApi } from "@/services/api/messages";
import { createConversationRepository } from "@/database/repositories/conversationRepositoryImpl";
import { createMessageRepository } from "@/database/repositories/messageRepositoryImpl";
import { createPendingMessageRepository } from "@/database/repositories/pendingMessageRepositoryImpl";
import { PerKeyMutex } from "@/services/chat/chatMutex";
import { getUserId } from "@/utils/storage";
import type {
  ConversationPreview,
  CreateConversationRequest,
  MessageItem,
} from "@/types";

export type SyncEventType = "conversations" | "messages";
export type SyncListener = (
  event: SyncEventType,
  conversationId?: string,
) => void;

/**
 * Synchronization engine for P2P chat.
 *
 * Architecture principles:
 * - REST is the source of truth. Synchronization fetches data from REST and writes to SQLite.
 * - SQLite is the single source of truth for the UI. Hooks read exclusively from SQLite.
 * - SignalR is a transport-only notification layer. It never drives state directly — it calls
 *   into the same sync methods used by REST, which write to SQLite.
 * - Sequence numbers are the authoritative ordering mechanism. Timestamps are never used for
 *   ordering or gap detection. This is critical because timestamps can skew between clients.
 * - Duplicate SignalR events are expected (sender receives their own message echo). The system
 *   handles this via INSERT OR IGNORE (primary key dedup) and sequence comparison (skip if
 *   incoming <= local).
 * - Gap recovery uses AfterSequence to fetch all missed messages from REST in one call.
 *   Multiple messages may arrive in the gap response — never assume exactly one missing message.
 */
export class ChatSync {
  private listeners = new Set<SyncListener>();
  private mutex = new PerKeyMutex();

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: SyncEventType, conversationId?: string): void {
    for (const fn of this.listeners) {
      try {
        fn(event, conversationId);
      } catch {
        /* noop */
      }
    }
  }

  async createConversation(
    request: CreateConversationRequest,
  ): Promise<ConversationPreview> {
    const conversation = await conversationsApi.createConversation(request);
    const convRepo = createConversationRepository();
    await convRepo.insertOrUpdateConversation(conversation);

    this.notify("conversations");

    return conversation;
  }

  async sendMessage(
    conversationId: string,
    messageContent: string,
  ): Promise<MessageItem | null> {
    try {
      const message = await messagesApi.sendMessage(conversationId, {
        messageContent,
      });

      message.content = message.content || messageContent;

      const msgRepo = createMessageRepository();
      await msgRepo.insertMessage(message);

      const convRepo = createConversationRepository();
      await convRepo.updateLastMessage(conversationId, {
        id: message.id,
        sequenceNumber: message.sequenceNumber,
        text: message.content,
        senderId: message.senderUserId,
        sentAt: message.sentAtUtc,
      });

      this.notify("messages", conversationId);
      this.notify("conversations");

      return message;
    } catch (error) {
      const pendingRepo = createPendingMessageRepository();
      await pendingRepo.insertPendingMessage({
        id: `pending_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
        conversationId,
        content: messageContent,
        senderUserId: getUserId(),
      });
      this.notify("messages", conversationId);
      return null;
    }
  }

  async processPendingMessages(): Promise<void> {
    const pendingRepo = createPendingMessageRepository();
    const pendingItems = await pendingRepo.getAllPendingMessages();

    for (const pending of pendingItems) {
      try {
        const message = await messagesApi.sendMessage(pending.conversationId, {
          messageContent: pending.content,
        });
        const msgRepo = createMessageRepository();
        await msgRepo.insertMessage(message);
        const convRepo = createConversationRepository();
        await convRepo.updateLastMessage(pending.conversationId, {
          id: message.id,
          sequenceNumber: message.sequenceNumber,
          text: message.content,
          senderId: message.senderUserId,
          sentAt: message.sentAtUtc,
        });
        await pendingRepo.deletePendingMessage(pending.id);
        this.notify("messages", pending.conversationId);
        this.notify("conversations");
      } catch (error) {
        await pendingRepo.incrementRetryCount(
          pending.id,
          error instanceof Error ? error.message : String(error),
        );
        console.error("Failed to send pending message", pending.id, error);
      }
    }
  }

  async syncConversations(options?: {
    limit?: number;
    cursor?: string;
  }): Promise<{ nextCursor: string | null; hasNextPage: boolean }> {
    let nextCursor: string | null = null;
    let hasNextPage = false;

    await this.mutex.acquire("conversations", async () => {
      const response = await conversationsApi.getConversations(options);
      nextCursor = response.nextCursor;
      hasNextPage = response.hasNextPage;

      const convRepo = createConversationRepository();

      for (const serverConv of response.items) {
        const localConv = await convRepo.findConversation(serverConv.id);

        if (!localConv) {
          await convRepo.insertOrUpdateConversation(serverConv);
          continue;
        }

        const serverSeq =
          serverConv.lastMessage?.sequenceNumber ?? "0";
        const localSeq =
          localConv.lastMessage?.sequenceNumber ?? "0";

        if (serverSeq !== localSeq) {
          await convRepo.insertOrUpdateConversation(serverConv);
        } else if (
          serverConv.title !== localConv.title ||
          serverConv.imageUrl !== localConv.imageUrl
        ) {
          await convRepo.updateConversation(serverConv.id, {
            title: serverConv.title,
            imageUrl: serverConv.imageUrl,
          });
        }

        // Preserve local read state (don't let server overwrite a higher local lastReadSequence)
        const localRead = parseInt(localConv.lastReadSequence ?? "0", 10);
        const serverRead = parseInt(serverConv.lastReadSequence ?? "0", 10);
        if (localRead > serverRead) {
          await convRepo.updateLastReadSequence(serverConv.id, String(localRead));
          await convRepo.updateUnreadCount(serverConv.id, "0");
        } else if (parseInt(localConv.unreadCount ?? "0", 10) > parseInt(serverConv.unreadCount ?? "0", 10)) {
          await convRepo.updateUnreadCount(serverConv.id, localConv.unreadCount);
        }
      }

      this.notify("conversations");
    });

    return { nextCursor: nextCursor!, hasNextPage: hasNextPage! };
  }

  async syncConversationMessages(
    conversationId: string,
    options?: { limit?: number; afterSequence?: string },
  ): Promise<{ nextCursor: string | null; hasNextPage: boolean }> {
    let nextCursor: string | null = null;
    let hasNextPage = false;

    await this.mutex.acquire(conversationId, async () => {
      const response = await messagesApi.getMessages({
        conversationId,
        ...options,
      });
      nextCursor = response.nextCursor;
      hasNextPage = response.hasNextPage;

      const msgRepo = createMessageRepository();

      for (const message of response.items) {
        await msgRepo.insertMessage(message);
      }

      if (response.items.length > 0) {
        const convRepo = createConversationRepository();
        const existing = await convRepo.findConversation(conversationId);
        if (!existing) {
          try {
            const metadata = await conversationsApi.getConversation(conversationId);
            await convRepo.insertOrUpdateConversation(metadata);
          } catch (error) {
            console.error("Failed to fetch conversation metadata", error);
          }
        }
        const lastMsg = response.items[response.items.length - 1];
        await convRepo.updateLastMessage(conversationId, {
          id: lastMsg.id,
          sequenceNumber: lastMsg.sequenceNumber,
          text: lastMsg.content,
          senderId: lastMsg.senderUserId,
          sentAt: lastMsg.sentAtUtc,
        });
      }

      this.notify("messages", conversationId);
      this.notify("conversations");
    });

    return { nextCursor: nextCursor!, hasNextPage: hasNextPage! };
  }

  /** @internal called from chatEvents, mutex is inside syncConversationMessages */
  async handleReceiveMessage(message: unknown): Promise<void> {
    const msg = message as {
      id: string;
      sequenceNumber: string | number;
      content: string;
      senderUserId: string | null;
      sentAtUtc: string;
      conversationId: string;
    };

    const conversationId = msg.conversationId;
    const convRepo = createConversationRepository();
    const msgRepo = createMessageRepository();

    const localConv = await convRepo.findConversation(conversationId);

    if (!localConv) {
      await this.syncConversationMessages(conversationId);
      return;
    }

    const localSeq = parseInt(
      localConv.lastMessage?.sequenceNumber ?? "0",
      10,
    );
    const incomingSeq = parseInt(String(msg.sequenceNumber ?? "0"), 10);

    if (incomingSeq === localSeq + 1) {
      await msgRepo.insertMessage({
        id: msg.id,
        sequenceNumber: String(msg.sequenceNumber),
        content: msg.content,
        senderUserId: msg.senderUserId,
        sentAtUtc: msg.sentAtUtc,
        conversationId,
      });
      await convRepo.updateLastMessage(conversationId, {
        id: msg.id,
        sequenceNumber: String(msg.sequenceNumber),
        text: msg.content,
        senderId: msg.senderUserId,
        sentAt: msg.sentAtUtc,
      });

      this.notify("messages", conversationId);
      this.notify("conversations");
      return;
    }

    if (incomingSeq <= localSeq) {
      return;
    }

    await this.syncConversationMessages(conversationId, {
      afterSequence: String(localSeq),
    });
  }
}

export const chatSync = new ChatSync();
