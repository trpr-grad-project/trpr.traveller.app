import { useCallback, useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotificationRepository } from "@/database/repositories/notificationRepositoryImpl";
import { notificationSync } from "@/services/notification/notificationSync";
import { getLastSeenSequenceNumber } from "@/utils/storage";
import type { Notification } from "@/types";

export type NotificationWithIsNew = Notification & { isNew: boolean };

export function useNotifications() {
  const queryClient = useQueryClient();
  const [isRefreshing, setIsRefreshing] = useState(false);
  const cursorRef = useRef<string | null>(null);
  const hasNextPageRef = useRef(true);
  const [hasNextPage, setHasNextPage] = useState(true);

  const query = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const notifications = await createNotificationRepository().getAll();
      const lastSeen = getLastSeenSequenceNumber();
      return notifications.map(
        (n) => ({ ...n, isNew: n.sequenceNumber > lastSeen }) as NotificationWithIsNew,
      );
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = notificationSync.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    });
    return unsubscribe;
  }, [queryClient]);

  const refresh = useCallback(async () => {
    setIsRefreshing(true);
    try {
      cursorRef.current = null;
      hasNextPageRef.current = true;
      setHasNextPage(true);
      const result = await notificationSync.syncNotifications();
      cursorRef.current = result.nextCursor;
      hasNextPageRef.current = result.hasNextPage;
      setHasNextPage(result.hasNextPage);
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
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
      const result = await notificationSync.syncNotifications({
        lastNotificationId: cursorRef.current ?? undefined,
      });
      cursorRef.current = result.nextCursor;
      hasNextPageRef.current = result.hasNextPage;
      setHasNextPage(result.hasNextPage);
      await queryClient.invalidateQueries({ queryKey: ["notifications"] });
    } finally {
      setIsRefreshing(false);
    }
  }, [queryClient]);

  return {
    notifications: (query.data ?? []) as NotificationWithIsNew[],
    isLoading: query.isLoading,
    isRefreshing,
    refresh,
    hasNextPage,
    loadMore,
  };
}
