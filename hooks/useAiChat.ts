import { useCallback, useMemo, useState } from "react";
import { Conversation, Message } from "@/types";
import { chatService } from "@/services/chat";
import { getErrorMessage } from "@/utils/errorHandler";
import { useChatStore } from "@/store/chatStore";

export function useAiChat() {
  const store = useChatStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const activeConversation: Conversation | null = store.activeConversationId
    ? store.conversations[store.activeConversationId] ?? null
    : null;

  const messages: Message[] = activeConversation?.messages ?? [];

  const conversations: Conversation[] = useMemo(
    () =>
      store.sortedConversationIds
        .map((id) => store.conversations[id])
        .filter(Boolean),
    [store.sortedConversationIds, store.conversations],
  );

  const sendMessage = useCallback(
    async (content: string) => {
      const trimmed = content.trim();
      if (!trimmed || isLoading) return;

      setError(null);

      // Read BEFORE addOptimisticMessage mutates the store
      const wasNewChat = !store.activeConversationId;

      const { tempId, conversationId } = store.addOptimisticMessage(trimmed);

      setIsLoading(true);

      try {
        const response = await chatService.sendMessage({
          conversationId: wasNewChat ? null : conversationId,
          prompt: trimmed,
        });

        store.confirmResponse(
          tempId,
          conversationId,
          trimmed,
          response,
        );
      } catch (err) {
        const errorMsg = getErrorMessage(err);
        setError(errorMsg);
        store.failMessage(tempId, conversationId);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, store],
  );

  const createNewChat = useCallback(() => {
    setError(null);
    store.createNewChat();
  }, [store]);

  const openConversation = useCallback(
    (id: string) => {
      setError(null);
      store.openConversation(id);
    },
    [store],
  );

  const deleteConversation = useCallback(
    (id: string) => {
      store.deleteConversation(id);
    },
    [store],
  );

  return {
    sendMessage,
    createNewChat,
    openConversation,
    deleteConversation,
    activeConversation,
    messages,
    conversations,
    isLoading,
    error,
  };
}
