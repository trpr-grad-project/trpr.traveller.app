import type { Notification } from "@/types";
import { getDatabase } from "../database";
import type { INotificationRepository } from "./notificationRepository";

export function createNotificationRepository(): INotificationRepository {
  return {
    insert: async (notification) => {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT OR IGNORE INTO notifications (id, title, message, sequenceNumber)
         VALUES (?, ?, ?, ?)`,
        [
          notification.id,
          notification.title,
          notification.message,
          notification.sequenceNumber,
        ],
      );
    },

    insertMany: async (notifications) => {
      const db = await getDatabase();
      for (const notification of notifications) {
        await db.runAsync(
          `INSERT OR IGNORE INTO notifications (id, title, message, sequenceNumber)
           VALUES (?, ?, ?, ?)`,
          [
            notification.id,
            notification.title,
            notification.message,
            notification.sequenceNumber,
          ],
        );
      }
    },

    getAll: async () => {
      const db = await getDatabase();
      return db.getAllAsync<Notification>(
        `SELECT * FROM notifications ORDER BY sequenceNumber DESC`,
      );
    },

    getLatestSequenceNumber: async () => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ seq: number }>(
        `SELECT COALESCE(MAX(sequenceNumber), 0) as seq FROM notifications`,
      );
      return row?.seq ?? 0;
    },

    getLatestNotificationId: async () => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ id: string }>(
        `SELECT id FROM notifications ORDER BY sequenceNumber DESC LIMIT 1`,
      );
      return row?.id ?? null;
    },

    exists: async (id) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count FROM notifications WHERE id = ?`,
        [id],
      );
      return (row?.count ?? 0) > 0;
    },

    clear: async () => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM notifications");
    },
  };
}
