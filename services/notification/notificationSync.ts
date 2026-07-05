import { notificationsApi } from "@/services/api/notifications";
import { createNotificationRepository } from "@/database/repositories/notificationRepositoryImpl";
import { PerKeyMutex } from "@/services/chat/chatMutex";
import type { Notification } from "@/types";

export type SyncEventType = "notifications";
export type SyncListener = (event: SyncEventType) => void;

const PAGE_SIZE = 50;

export class NotificationSync {
  private listeners = new Set<SyncListener>();
  private mutex = new PerKeyMutex();

  subscribe(listener: SyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(event: SyncEventType): void {
    for (const fn of this.listeners) {
      try {
        fn(event);
      } catch {
        /* noop */
      }
    }
  }

  async syncAllNotifications(): Promise<void> {
    await this.mutex.acquire("notifications", async () => {
      console.log("Notification full sync started");

      let cursor: string | undefined;
      let hasNextPage = true;

      while (hasNextPage) {
        const response = await notificationsApi.getNotifications({
          pageSize: PAGE_SIZE,
          lastNotificationId: cursor,
        });

        const repo = createNotificationRepository();
        await repo.insertMany(response.items);

        cursor = response.nextCursor ?? undefined;
        hasNextPage = response.hasNextPage;

        console.log("Notification sync page", response.items.length);
      }

      console.log("Notification full sync completed");
      this.notify("notifications");
    });
  }

  async syncNotifications(options?: {
    lastNotificationId?: string;
  }): Promise<{ nextCursor: string | null; hasNextPage: boolean }> {
    let nextCursor: string | null = null;
    let hasNextPage = false;

    await this.mutex.acquire("notifications", async () => {
      console.log("Notification sync started");

      const response = await notificationsApi.getNotifications({
        pageSize: PAGE_SIZE,
        lastNotificationId: options?.lastNotificationId,
      });
      nextCursor = response.nextCursor;
      hasNextPage = response.hasNextPage;

      const repo = createNotificationRepository();
      await repo.insertMany(response.items);

      console.log("Notification sync completed", response.items.length);
      this.notify("notifications");
    });

    return { nextCursor: nextCursor!, hasNextPage: hasNextPage! };
  }

  async handleReceiveNotification(payload: unknown): Promise<void> {
    const notification = payload as Notification;

    if (
      !notification ||
      typeof notification.id !== "string" ||
      typeof notification.sequenceNumber !== "number"
    ) {
      console.log("Invalid notification payload ignored", payload);
      return;
    }

    const repo = createNotificationRepository();
    const localHighest = await repo.getLatestSequenceNumber();
    const incomingSeq = notification.sequenceNumber;

    if (incomingSeq === localHighest + 1) {
      console.log("Inserting continuous notification", notification.id);
      await repo.insert(notification);
      this.notify("notifications");
      return;
    }

    if (incomingSeq <= localHighest) {
      console.log("Duplicate notification ignored", notification.id);
      return;
    }

    console.log("Notification gap detected", {
      local: localHighest,
      incoming: incomingSeq,
    });

    let cursor: string | undefined;
    let recovered = false;

    while (!recovered) {
      const response = await notificationsApi.getNotifications({
        pageSize: PAGE_SIZE,
        lastNotificationId: cursor,
      });

      await repo.insertMany(response.items);

      if (response.items.length > 0) {
        const newHighest = await repo.getLatestSequenceNumber();
        if (newHighest >= incomingSeq) {
          recovered = true;
        }
      }

      if (!response.hasNextPage) {
        recovered = true;
      }

      cursor = response.nextCursor ?? undefined;
    }

    console.log("Notification gap recovery completed");
    this.notify("notifications");
  }
}

export const notificationSync = new NotificationSync();
