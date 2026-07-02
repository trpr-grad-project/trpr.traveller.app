import type { MessageItem } from "@/types";
import { getDatabase } from "../database";
import type { IMessageRepository } from "./messageRepository";

export function createMessageRepository(): IMessageRepository {
  return {
    insertMessage: async (message) => {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT OR IGNORE INTO messages
          (id, conversationId, sequenceNumber, content, senderUserId, sentAtUtc)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [
          message.id,
          message.conversationId,
          message.sequenceNumber,
          message.content,
          message.senderUserId,
          message.sentAtUtc,
        ],
      );
    },

    insertManyMessages: async (messages) => {
      const db = await getDatabase();
      for (const message of messages) {
        await db.runAsync(
          `INSERT OR IGNORE INTO messages
            (id, conversationId, sequenceNumber, content, senderUserId, sentAtUtc)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            message.id,
            message.conversationId,
            message.sequenceNumber,
            message.content,
            message.senderUserId,
            message.sentAtUtc,
          ],
        );
      }
    },

    messageExists: async (id) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM messages WHERE id = ?`,
        [id],
      );
      return (row?.count ?? 0) > 0;
    },

    findMessagesByConversation: async (conversationId) => {
      const db = await getDatabase();
      const rows = await db.getAllAsync<MessageItem>(
        `SELECT * FROM messages WHERE conversationId = ? ORDER BY CAST(sequenceNumber AS INTEGER) ASC`,
        [conversationId],
      );
      return rows;
    },

    findRecentMessagesByConversation: async (conversationId, limit) => {
      const db = await getDatabase();
      const rows = await db.getAllAsync<MessageItem>(
        `SELECT * FROM messages WHERE conversationId = ?
         ORDER BY CAST(sequenceNumber AS INTEGER) DESC LIMIT ?`,
        [conversationId, limit],
      );
      return rows;
    },

    findMessagesBeforeSequence: async (conversationId, beforeSequence, limit) => {
      const db = await getDatabase();
      const rows = await db.getAllAsync<MessageItem>(
        `SELECT * FROM messages
         WHERE conversationId = ? AND CAST(sequenceNumber AS INTEGER) < ?
         ORDER BY CAST(sequenceNumber AS INTEGER) DESC LIMIT ?`,
        [conversationId, beforeSequence, limit],
      );
      return rows;
    },

    findMessage: async (id) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<MessageItem>(
        `SELECT * FROM messages WHERE id = ?`,
        [id],
      );
      return row ?? null;
    },

    deleteConversationMessages: async (conversationId) => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM messages WHERE conversationId = ?", [
        conversationId,
      ]);
    },

    clearMessages: async () => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM messages");
    },

    getLastSequence: async (conversationId) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ seq: string }>(
        `SELECT sequenceNumber as seq FROM messages
         WHERE conversationId = ?
         ORDER BY CAST(sequenceNumber AS INTEGER) DESC
         LIMIT 1`,
        [conversationId],
      );
      return row?.seq ?? null;
    },

    getHighestSequence: async (conversationId) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ seq: string }>(
        `SELECT MAX(CAST(sequenceNumber AS INTEGER)) as seq FROM messages
         WHERE conversationId = ?`,
        [conversationId],
      );
      return row?.seq !== null ? String(row.seq) : null;
    },

    getMessageCount: async (conversationId) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM messages WHERE conversationId = ?`,
        [conversationId],
      );
      return row?.count ?? 0;
    },
  };
}
