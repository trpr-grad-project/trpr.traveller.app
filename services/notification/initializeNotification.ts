import { notificationConnection } from "@/services/signalr/notificationConnection";
import { useNotificationStore } from "@/store/notificationStore";
import { getUserId } from "@/utils/storage";
import { notificationSync } from "@/services/notification/notificationSync";

let _initialized = false;
let _initializing: Promise<void> | null = null;

export function isNotificationInitialized(): boolean {
  return _initialized;
}

export function resetNotificationInitialization(): void {
  _initialized = false;
}

export async function initializeNotifications(): Promise<void> {
  if (_initialized) {
    return;
  }

  if (_initializing) {
    return _initializing;
  }

  const userId = getUserId();
  if (!userId) {
    return;
  }

  _initializing = (async () => {
    useNotificationStore.getState().setIsConnecting(true);
    useNotificationStore.getState().setConnectionState("connecting");

    try {
      await notificationConnection.initialize(userId);
      _initialized = true;
      useNotificationStore.getState().setConnectionState("connected");
      await notificationSync.syncAllNotifications();
    } catch (error) {
      useNotificationStore.getState().setConnectionState("disconnected");
      console.error("Notification initialization failed", error);
      throw error;
    } finally {
      useNotificationStore.getState().setIsConnecting(false);
      _initializing = null;
    }
  })();

  return _initializing;
}

export async function reconnectNotifications(): Promise<void> {
  const userId = getUserId();
  if (!userId || !_initialized) {
    return;
  }

  if (notificationConnection.isConnected()) {
    return;
  }

  useNotificationStore.getState().setConnectionState("connecting");
  useNotificationStore.getState().setIsConnecting(true);

  try {
    await notificationConnection.initialize(userId);
    useNotificationStore.getState().setConnectionState("connected");
  } catch (error) {
    useNotificationStore.getState().setConnectionState("disconnected");
    console.error("Notification foreground reconnect failed", error);
  } finally {
    useNotificationStore.getState().setIsConnecting(false);
  }
}

export async function disconnectNotifications(): Promise<void> {
  _initializing = null;
  await notificationConnection.disconnect();
  resetNotificationInitialization();
  useNotificationStore.getState().setConnectionState("disconnected");
}
