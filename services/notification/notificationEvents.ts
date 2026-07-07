import { notificationSync } from "./notificationSync";

export function handleReceiveNotification(payload: unknown): void {
  notificationSync.handleReceiveNotification(payload).catch((error) => {
    console.error("Failed to handle receive notification", error);
  });
}

export function handleReconnected(): void {
  notificationSync.syncNotifications().catch((error) => {
    console.error("SignalR notification reconnect sync failed", error);
  });
}
