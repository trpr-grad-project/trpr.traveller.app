import type { ConversationPreview } from "@/types";
import { getDatabase } from "../database";
import type { IConversationRepository } from "./conversationRepository";

function toRow(conversation: ConversationPreview) {
  return {
    id: conversation.id,
    title: conversation.title,
    imageUrl: conversation.imageUrl,
    lastMessageId: conversation.lastMessage?.id ?? null,
    lastMessageText: conversation.lastMessage?.text ?? null,
    lastMessageSenderId: conversation.lastMessage?.senderId ?? null,
    lastMessageSequence: conversation.lastMessage?.sequenceNumber ?? null,
    lastMessageSentAt: conversation.lastMessage?.sentAt ?? null,
    lastReadSequence: conversation.lastReadSequence,
    unreadCount: conversation.unreadCount,
    updatedAt: new Date().toISOString(),
  };
}

function fromRow(row: {
  id: string;
  title: string | null;
  imageUrl: string | null;
  lastMessageId: string | null;
  lastMessageText: string | null;
  lastMessageSenderId: string | null;
  lastMessageSequence: string | null;
  lastMessageSentAt: string | null;
  lastReadSequence: string;
  unreadCount: string;
  updatedAt: string;
}): ConversationPreview {
  const lastSeq = parseInt(row.lastMessageSequence ?? "0", 10);
  const readSeq = parseInt(row.lastReadSequence ?? "0", 10);
  const unread = Math.max(0, lastSeq - readSeq);

  return {
    id: row.id,
    title: row.title,
    imageUrl: row.imageUrl,
    lastMessage: row.lastMessageId
      ? {
          id: row.lastMessageId,
          sequenceNumber: row.lastMessageSequence ?? "0",
          text: row.lastMessageText ?? "",
          senderId: row.lastMessageSenderId,
          sentAt: row.lastMessageSentAt ?? "",
        }
      : null,
    lastReadSequence: row.lastReadSequence,
    unreadCount: String(unread),
  };
}

export function createConversationRepository(): IConversationRepository {
  return {
    insertOrUpdateConversation: async (conversation) => {
      const db = await getDatabase();
      const row = toRow(conversation);
      await db.runAsync(
        `INSERT OR REPLACE INTO conversations
          (id, title, imageUrl, lastMessageId, lastMessageText, lastMessageSenderId,
           lastMessageSequence, lastMessageSentAt, lastReadSequence, unreadCount, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          row.id,
          row.title,
          row.imageUrl,
          row.lastMessageId,
          row.lastMessageText,
          row.lastMessageSenderId,
          row.lastMessageSequence,
          row.lastMessageSentAt,
          row.lastReadSequence,
          row.unreadCount,
          row.updatedAt,
        ],
      );
    },

    insertOrUpdateMany: async (conversations) => {
      const db = await getDatabase();
      for (const conversation of conversations) {
        const row = toRow(conversation);
        await db.runAsync(
          `INSERT OR REPLACE INTO conversations
            (id, title, imageUrl, lastMessageId, lastMessageText, lastMessageSenderId,
             lastMessageSequence, lastMessageSentAt, lastReadSequence, unreadCount, updatedAt)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            row.id,
            row.title,
            row.imageUrl,
            row.lastMessageId,
            row.lastMessageText,
            row.lastMessageSenderId,
            row.lastMessageSequence,
            row.lastMessageSentAt,
            row.lastReadSequence,
            row.unreadCount,
            row.updatedAt,
          ],
        );
      }
    },

    findConversation: async (id) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{
        id: string;
        title: string | null;
        imageUrl: string | null;
        lastMessageId: string | null;
        lastMessageText: string | null;
        lastMessageSenderId: string | null;
        lastMessageSequence: string | null;
        lastMessageSentAt: string | null;
        lastReadSequence: string;
        unreadCount: string;
        updatedAt: string;
      }>(
        `SELECT * FROM conversations WHERE id = ?`,
        [id],
      );
      return row ? fromRow(row) : null;
    },

    findAllConversations: async () => {
      const db = await getDatabase();
      const rows = await db.getAllAsync<{
        id: string;
        title: string | null;
        imageUrl: string | null;
        lastMessageId: string | null;
        lastMessageText: string | null;
        lastMessageSenderId: string | null;
        lastMessageSequence: string | null;
        lastMessageSentAt: string | null;
        lastReadSequence: string;
        unreadCount: string;
        updatedAt: string;
      }>(`SELECT * FROM conversations ORDER BY CASE WHEN lastMessageSentAt IS NULL OR lastMessageSentAt = '' THEN 0 ELSE 1 END DESC, lastMessageSentAt DESC`);
      return rows.map(fromRow);
    },

    updateConversation: async (id, updates) => {
      const db = await getDatabase();
      const sets: string[] = [];
      const params: unknown[] = [];

      if (updates.title !== undefined) {
        sets.push("title = ?");
        params.push(updates.title);
      }
      if (updates.imageUrl !== undefined) {
        sets.push("imageUrl = ?");
        params.push(updates.imageUrl);
      }
      if (updates.lastMessage !== undefined) {
        sets.push("lastMessageId = ?");
        params.push(updates.lastMessage?.id ?? null);
        sets.push("lastMessageText = ?");
        params.push(updates.lastMessage?.text ?? null);
        sets.push("lastMessageSenderId = ?");
        params.push(updates.lastMessage?.senderId ?? null);
        sets.push("lastMessageSequence = ?");
        params.push(updates.lastMessage?.sequenceNumber ?? null);
        sets.push("lastMessageSentAt = ?");
        params.push(updates.lastMessage?.sentAt ?? null);
      }
      if (updates.lastReadSequence !== undefined) {
        sets.push("lastReadSequence = ?");
        params.push(updates.lastReadSequence);
      }
      if (updates.unreadCount !== undefined) {
        sets.push("unreadCount = ?");
        params.push(updates.unreadCount);
      }

      if (sets.length === 0) return;

      sets.push("updatedAt = ?");
      params.push(new Date().toISOString());
      params.push(id);

      await db.runAsync(
        `UPDATE conversations SET ${sets.join(", ")} WHERE id = ?`,
        params,
      );
    },

    deleteConversation: async (id) => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM conversations WHERE id = ?", [id]);
    },

    clearConversations: async () => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM conversations");
    },

    getLastSequence: async () => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ seq: string }>(
        `SELECT MAX(CAST(lastMessageSequence AS INTEGER)) as seq FROM conversations`,
      );
      return row?.seq ?? null;
    },

    updateUnreadCount: async (id, count) => {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE conversations SET unreadCount = ?, updatedAt = ? WHERE id = ?`,
        [count, new Date().toISOString(), id],
      );
    },

    updateLastReadSequence: async (id, sequence) => {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE conversations SET lastReadSequence = ?, updatedAt = ? WHERE id = ?`,
        [sequence, new Date().toISOString(), id],
      );
    },

    updateLastMessage: async (id, message) => {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE conversations
           SET lastMessageId = ?, lastMessageText = ?, lastMessageSenderId = ?,
               lastMessageSequence = ?, lastMessageSentAt = ?, updatedAt = ?
         WHERE id = ?`,
        [
          message?.id ?? null,
          message?.text ?? null,
          message?.senderId ?? null,
          message?.sequenceNumber ?? null,
          message?.sentAt ?? null,
          new Date().toISOString(),
          id,
        ],
      );
    },
  };
}
