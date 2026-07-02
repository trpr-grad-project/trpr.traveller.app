import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createConversationRepository } from "@/database/repositories/conversationRepositoryImpl";
import { chatSync } from "@/services/chat/chatSync";

export function useConversations() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cursorRef = useRef<string | null>(null);
  const hasNextPageRef = useRef(true);
  const [hasNextPage, setHasNextPage] = useState(true);

  const query = useQuery({
    queryKey: ["conversations"],
    queryFn: () => createConversationRepository().findAllConversations(),
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = chatSync.subscribe((event) => {
      if (event === "conversations") {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    });
    return unsubscribe;
  }, [queryClient]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      cursorRef.current = null;
      hasNextPageRef.current = true;
      setHasNextPage(true);
      const result = await chatSync.syncConversations({ limit: 20 });
      cursorRef.current = result.nextCursor;
      hasNextPageRef.current = result.hasNextPage;
      setHasNextPage(result.hasNextPage);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  useEffect(() => {
    refresh().catch(console.error);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadMore = useCallback(async () => {
    if (!hasNextPageRef.current) return;
    setIsRefreshing(true);
    try {
      const result = await chatSync.syncConversations({
        limit: 20,
        cursor: cursorRef.current ?? undefined,
      });
      cursorRef.current = result.nextCursor;
      hasNextPageRef.current = result.hasNextPage;
      setHasNextPage(result.hasNextPage);
      await queryClient.invalidateQueries({ queryKey: ["conversations"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return {
    conversations: query.data ?? [],
    isLoading: query.isLoading,
    isRefreshing,
    refresh,
    hasNextPage,
    loadMore,
  };
}
