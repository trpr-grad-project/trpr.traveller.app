import type { PendingMessage } from "@/types";

export interface IPendingMessageRepository {
  insertPendingMessage(params: {
    id: string;
    conversationId: string;
    content: string;
    senderUserId: string | null;
  }): Promise<void>;
  getPendingMessages(conversationId: string): Promise<PendingMessage[]>;
  getAllPendingMessages(): Promise<PendingMessage[]>;
  deletePendingMessage(id: string): Promise<void>;
  incrementRetryCount(id: string, error: string): Promise<void>;
}
