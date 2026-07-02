import { chatConnection } from "@/services/signalr/chatConnection";
import { useP2pChatStore } from "@/store/chatStore";
import { getUserId } from "@/utils/storage";
import { userCache } from "@/utils/userCache";
import { chatSync } from "@/services/chat/chatSync";
import { usersService } from "@/services/users";

let _initialized = false;
let _initializing: Promise<void> | null = null;

export function isChatInitialized(): boolean {
  return _initialized;
}

export function resetChatInitialization(): void {
  _initialized = false;
}

export async function initializeChat(): Promise<void> {
  if (_initialized) {
    console.log("chat initialization already initialized");
    return;
  }

  if (_initializing) {
    console.log("chat initialization already in progress");
    return _initializing;
  }

  console.log("chat initialization started");

  const userId = getUserId();
  if (!userId) {
    console.log("chat initialization skipped: no user");
    return;
  }

  _initializing = (async () => {
    useP2pChatStore.getState().setIsConnecting(true);
    useP2pChatStore.getState().setConnectionState("connecting");

    try {
      await chatConnection.initialize(userId);
      _initialized = true;
      useP2pChatStore.getState().setConnectionState("connected");
      console.log("chat initialization complete");

      // Cache user names (best-effort, may fail if caller is not Admin)
      usersService.getAll().then((users) => {
        userCache.populateFromUsersList(users);
      }).catch(() => {});

      // Flush any messages queued while offline
      chatSync.processPendingMessages().catch(console.error);
    } catch (error) {
      useP2pChatStore.getState().setConnectionState("disconnected");
      console.error("chat initialization failed", error);
      throw error;
    } finally {
      useP2pChatStore.getState().setIsConnecting(false);
      _initializing = null;
    }
  })();

  return _initializing;
}

export async function reconnectChat(): Promise<void> {
  const userId = getUserId();
  if (!userId || !_initialized) {
    console.log("chat reconnect skipped: no user or not initialized");
    return;
  }

  if (chatConnection.isConnected()) {
    console.log("chat reconnect skipped: already connected");
    return;
  }

  console.log("chat foreground reconnect attempt");

  useP2pChatStore.getState().setConnectionState("connecting");
  useP2pChatStore.getState().setIsConnecting(true);

  try {
    await chatConnection.initialize(userId);
    useP2pChatStore.getState().setConnectionState("connected");
    console.log("chat foreground reconnect complete");

    usersService.getAll().then((users) => {
      userCache.populateFromUsersList(users);
    }).catch(() => {});
  } catch (error) {
    useP2pChatStore.getState().setConnectionState("disconnected");
    console.error("chat foreground reconnect failed", error);
  } finally {
    useP2pChatStore.getState().setIsConnecting(false);
  }
}

export async function disconnectChat(): Promise<void> {
  console.log("chat logout cleanup");
  _initializing = null;
  await chatConnection.disconnect();
  resetChatInitialization();
  useP2pChatStore.getState().setConnectionState("disconnected");
}
