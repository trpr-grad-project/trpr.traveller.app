import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Conversation, Message, AiChatResponse } from "@/types";

// Per-user storage key
let _currentUserId: string | null = null;

function storageKey(): string {
  return `chat-storage-${_currentUserId || "anonymous"}`;
}

// Debounced auto-persist
let _persistTimer: ReturnType<typeof setTimeout> | null = null;

function schedulePersist(state: ChatState) {
  if (_persistTimer) clearTimeout(_persistTimer);
  _persistTimer = setTimeout(() => {
    AsyncStorage.setItem(
      storageKey(),
      JSON.stringify({
        conversations: state.conversations,
        sortedConversationIds: state.sortedConversationIds,
        activeConversationId: state.activeConversationId,
      }),
    );
  }, 300);
}

// Serialised user-switch queue
let _pendingSetChatUserId: Promise<void> | null = null;

export async function setChatUserId(userId: string | null) {
  const prev = _pendingSetChatUserId;
  _pendingSetChatUserId = (async () => {
    if (prev) await prev;
    if (_currentUserId === userId) return;

    const prevUserId = _currentUserId;
    _currentUserId = userId;

    // 1. Persist current state to old key before switching
    if (prevUserId !== null) {
      const state = useChatStore.getState();
      await AsyncStorage.setItem(
        `chat-storage-${prevUserId}`,
        JSON.stringify({
          conversations: state.conversations,
          sortedConversationIds: state.sortedConversationIds,
          activeConversationId: state.activeConversationId,
        }),
      );
    }

    // 2. Reset in-memory state synchronously
    useChatStore.setState({
      conversations: {},
      sortedConversationIds: [],
      activeConversationId: null,
    });

    // 3. Load new user's data
    const stored = await AsyncStorage.getItem(storageKey());
    if (stored) {
      const parsed = JSON.parse(stored);
      useChatStore.setState({
        conversations: parsed.conversations ?? {},
        sortedConversationIds: parsed.sortedConversationIds ?? [],
        activeConversationId: parsed.activeConversationId ?? null,
      });
    }
  })();
  await _pendingSetChatUserId;
}

// Helpers
let _idCounter = 0;

function generateId(): string {
  _idCounter += 1;
  return `${Date.now()}-${_idCounter}-${Math.random().toString(36).substring(2, 9)}`;
}

function resortConversationIds(
  conversations: Record<string, Conversation>,
): string[] {
  return Object.values(conversations)
    .sort(
      (a, b) =>
        new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
    )
    .map((c) => c.id);
}

// Types
interface ChatState {
  conversations: Record<string, Conversation>;
  sortedConversationIds: string[];
  activeConversationId: string | null;
}

interface ChatActions {
  createNewChat: () => void;
  openConversation: (id: string) => void;
  deleteConversation: (id: string) => void;

  addOptimisticMessage: (
    content: string,
  ) => { tempId: string; conversationId: string };
  confirmResponse: (
    tempId: string,
    tempConversationId: string,
    prompt: string,
    response: AiChatResponse,
  ) => void;
  failMessage: (tempId: string, conversationId: string) => void;
}

// Store
export const useChatStore = create<ChatState & ChatActions>()(
  (set, get) => ({
    conversations: {},
    sortedConversationIds: [],
    activeConversationId: null,

    createNewChat: () => {
      set({ activeConversationId: null });
    },

    openConversation: (id: string) => {
      set({ activeConversationId: id });
    },

    deleteConversation: (id: string) => {
      const { conversations, activeConversationId } = get();
      const { [id]: _, ...remaining } = conversations;
      set({
        conversations: remaining,
        sortedConversationIds: resortConversationIds(remaining),
        activeConversationId:
          activeConversationId === id ? null : activeConversationId,
      });
    },

    addOptimisticMessage: (content: string) => {
      const tempId = generateId();
      const now = new Date().toISOString();
      const { activeConversationId, conversations } = get();
      const targetId = activeConversationId ?? generateId();

      const message: Message = {
        id: tempId,
        conversationId: targetId,
        role: "user",
        content,
        createdAt: now,
        pending: true,
      };

      const existing = conversations[targetId];
      const updated: Conversation = existing
        ? {
            ...existing,
            messages: [...existing.messages, message],
            updatedAt: now,
          }
        : {
            id: targetId,
            title: content,
            messages: [message],
            createdAt: now,
            updatedAt: now,
          };

      set({
        conversations: { ...conversations, [targetId]: updated },
        sortedConversationIds: resortConversationIds({
          ...conversations,
          [targetId]: updated,
        }),
        activeConversationId: activeConversationId ?? targetId,
      });

      return { tempId, conversationId: targetId };
    },

    confirmResponse: (
      tempId: string,
      tempConversationId: string,
      prompt: string,
      response: AiChatResponse,
    ) => {
      const { conversations } = get();
      const realId = response.conversationId;
      const now = new Date().toISOString();

      const isNewConversation = tempConversationId !== realId;

      if (isNewConversation) {
        const tempConv = conversations[tempConversationId];
        if (!tempConv) return;

        const updatedMessages = tempConv.messages.map((m) =>
          m.id === tempId
            ? { ...m, conversationId: realId, pending: false }
            : m,
        );

        const assistantMessage: Message = {
          id: response.id,
          conversationId: realId,
          role: "assistant",
          content: response.content,
          createdAt: now,
        };

        const newConv: Conversation = {
          ...tempConv,
          id: realId,
          title: prompt,
          messages: [...updatedMessages, assistantMessage],
          updatedAt: now,
        };

        const { [tempConversationId]: _, ...rest } = conversations;

        set({
          conversations: { ...rest, [realId]: newConv },
          sortedConversationIds: resortConversationIds({
            ...rest,
            [realId]: newConv,
          }),
          activeConversationId: realId,
        });
      } else {
        const conv = conversations[tempConversationId];
        if (!conv) return;

        const updatedMessages = conv.messages.map((m) =>
          m.id === tempId ? { ...m, pending: false } : m,
        );

        const assistantMessage: Message = {
          id: response.id,
          conversationId: realId,
          role: "assistant",
          content: response.content,
          createdAt: now,
        };

        const updated: Conversation = {
          ...conv,
          messages: [...updatedMessages, assistantMessage],
          updatedAt: now,
        };

        set({
          conversations: { ...conversations, [realId]: updated },
          sortedConversationIds: resortConversationIds({
            ...conversations,
            [realId]: updated,
          }),
        });
      }
    },

    failMessage: (tempId: string, conversationId: string) => {
      const { conversations } = get();
      const conv = conversations[conversationId];
      if (!conv) return;

      const updatedMessages = conv.messages.map((m) =>
        m.id === tempId ? { ...m, pending: false, failed: true } : m,
      );

      const updated: Conversation = {
        ...conv,
        messages: updatedMessages,
      };

      set({
        conversations: { ...conversations, [conversationId]: updated },
      });
    },
  }),
);

// Auto-persist on every state change
useChatStore.subscribe((state) => {
  schedulePersist(state);
});
