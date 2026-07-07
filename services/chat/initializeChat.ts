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
    useP2pChatStore.getState().setIsConnecting(true);
    useP2pChatStore.getState().setConnectionState("connecting");

    try {
      await chatConnection.initialize(userId);
      _initialized = true;
      useP2pChatStore.getState().setConnectionState("connected");
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
    return;
  }

  if (chatConnection.isConnected()) {
    return;
  }

  useP2pChatStore.getState().setConnectionState("connecting");
  useP2pChatStore.getState().setIsConnecting(true);

  try {
    await chatConnection.initialize(userId);
    useP2pChatStore.getState().setConnectionState("connected");
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
  _initializing = null;
  await chatConnection.disconnect();
  resetChatInitialization();
  useP2pChatStore.getState().setConnectionState("disconnected");
}
