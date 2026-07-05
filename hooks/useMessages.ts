import { useCallback, useEffect, useRef, useState } from "react";
import { createMessageRepository } from "@/database/repositories/messageRepositoryImpl";
import { createPendingMessageRepository } from "@/database/repositories/pendingMessageRepositoryImpl";
import { chatSync } from "@/services/chat/chatSync";
import type { MessageItem } from "@/types";

const ITEMS_PER_PAGE = 50;

export function useMessages(conversationId: string) {
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [isLoadingOlder, setIsLoadingOlder] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const cursorRef = useRef<string | null>(null);
  const conversationIdRef = useRef(conversationId);

  conversationIdRef.current = conversationId;

  const reload = useCallback(async () => {
    if (!conversationId) return;
    const [regular, pending] = await Promise.all([
      createMessageRepository().findRecentMessagesByConversation(
        conversationId,
        ITEMS_PER_PAGE,
      ),
      createPendingMessageRepository().getPendingMessages(conversationId),
    ]);

    const combined: MessageItem[] = [
      ...pending.map(
        (p): MessageItem => ({
          id: p.id,
          sequenceNumber: "0",
          content: p.content,
          senderUserId: p.senderUserId,
          sentAtUtc: p.createdAt,
          conversationId: p.conversationId,
          isPending: true,
        }),
      ),
      ...regular,
    ];

    setMessages(combined);
    cursorRef.current =
      regular.length > 0 ? regular[regular.length - 1].sequenceNumber : null;
    setHasMore(regular.length >= ITEMS_PER_PAGE);
  }, [conversationId]);

  const loadInitial = useCallback(async () => {
    if (!conversationId) return;
    setIsLoading(true);
    try {
      await chatSync.syncConversationMessages(conversationId);
      await reload();
    } finally {
      setIsLoading(false);
    }
  }, [conversationId, reload]);

  const loadOlder = useCallback(async () => {
    const cursor = cursorRef.current;
    if (!conversationId || !cursor || isLoadingOlder) return;

    setIsLoadingOlder(true);
    try {
      const older =
        await createMessageRepository().findMessagesBeforeSequence(
          conversationId,
          cursor,
          ITEMS_PER_PAGE,
        );

      if (older.length > 0) {
        setMessages((prev) => [...prev, ...older]);
        cursorRef.current = older[older.length - 1].sequenceNumber;
      }

      if (older.length < ITEMS_PER_PAGE) {
        setHasMore(false);
      }
    } finally {
      setIsLoadingOlder(false);
    }
  }, [conversationId, isLoadingOlder]);

  useEffect(() => {
    const unsubscribe = chatSync.subscribe((event, id) => {
      if (
        (event === "messages" || event === "message") &&
        id === conversationIdRef.current
      ) {
        reload();
      }
    });
    return unsubscribe;
  }, [reload]);

  useEffect(() => {
    loadInitial();
  }, [loadInitial]);

  const refresh = useCallback(async () => {
    if (!conversationId) return;
    setIsRefreshing(true);
    try {
      await chatSync.syncConversationMessages(conversationId);
      await reload();
    } finally {
      setIsRefreshing(false);
    }
  }, [conversationId, reload]);

  return {
    messages,
    isLoading,
    isLoadingOlder,
    isRefreshing,
    refresh,
    loadOlder,
    hasMore,
  };
}

