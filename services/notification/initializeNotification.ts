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
    console.log("Notification initialization already initialized");
    return;
  }

  if (_initializing) {
    console.log("Notification initialization already in progress");
    return _initializing;
  }

  console.log("Notification initialization started");

  const userId = getUserId();
  if (!userId) {
    console.log("Notification initialization skipped: no user");
    return;
  }

  _initializing = (async () => {
    useNotificationStore.getState().setIsConnecting(true);
    useNotificationStore.getState().setConnectionState("connecting");

    try {
      await notificationConnection.initialize(userId);
      _initialized = true;
      useNotificationStore.getState().setConnectionState("connected");
      console.log("Notification initialization complete");

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
    console.log("Notification reconnect skipped: no user or not initialized");
    return;
  }

  if (notificationConnection.isConnected()) {
    console.log("Notification reconnect skipped: already connected");
    return;
  }

  console.log("Notification foreground reconnect attempt");

  useNotificationStore.getState().setConnectionState("connecting");
  useNotificationStore.getState().setIsConnecting(true);

  try {
    await notificationConnection.initialize(userId);
    useNotificationStore.getState().setConnectionState("connected");
    console.log("Notification foreground reconnect complete");
  } catch (error) {
    useNotificationStore.getState().setConnectionState("disconnected");
    console.error("Notification foreground reconnect failed", error);
  } finally {
    useNotificationStore.getState().setIsConnecting(false);
  }
}

export async function disconnectNotifications(): Promise<void> {
  console.log("Notification logout cleanup");
  _initializing = null;
  await notificationConnection.disconnect();
  resetNotificationInitialization();
  useNotificationStore.getState().setConnectionState("disconnected");
}
