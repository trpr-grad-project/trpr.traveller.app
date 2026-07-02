import type { PendingMessage } from "@/types";
import { getDatabase } from "../database";
import type { IPendingMessageRepository } from "./pendingMessageRepository";

export function createPendingMessageRepository(): IPendingMessageRepository {
  return {
    insertPendingMessage: async ({ id, conversationId, content, senderUserId }) => {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT INTO pending_messages (id, conversationId, content, senderUserId, createdAt, retryCount, lastError)
         VALUES (?, ?, ?, ?, datetime('now'), 0, NULL)`,
        [id, conversationId, content, senderUserId],
      );
    },

    getPendingMessages: async (conversationId) => {
      const db = await getDatabase();
      return db.getAllAsync<PendingMessage>(
        `SELECT * FROM pending_messages WHERE conversationId = ? ORDER BY createdAt ASC`,
        [conversationId],
      );
    },

    getAllPendingMessages: async () => {
      const db = await getDatabase();
      return db.getAllAsync<PendingMessage>(
        `SELECT * FROM pending_messages ORDER BY createdAt ASC`,
      );
    },

    deletePendingMessage: async (id) => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM pending_messages WHERE id = ?", [id]);
    },

    incrementRetryCount: async (id, error) => {
      const db = await getDatabase();
      await db.runAsync(
        `UPDATE pending_messages SET retryCount = retryCount + 1, lastError = ? WHERE id = ?`,
        [error, id],
      );
    },
  };
}
