import type { Notification } from "@/types";

export interface INotificationRepository {
  insert(notification: Notification): Promise<void>;
  insertMany(notifications: Notification[]): Promise<void>;
  getAll(): Promise<Notification[]>;
  getLatestSequenceNumber(): Promise<number>;
  getLatestNotificationId(): Promise<string | null>;
  exists(id: string): Promise<boolean>;
  clear(): Promise<void>;
}
