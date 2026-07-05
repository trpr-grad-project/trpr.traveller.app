import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createNotificationRepository } from "@/database/repositories/notificationRepositoryImpl";
import { notificationSync } from "@/services/notification/notificationSync";
import { getLastSeenSequenceNumber } from "@/utils/storage";

export function useUnreadCount() {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ["notifications", "unreadCount"],
    queryFn: async () => {
      const highest = await createNotificationRepository().getLatestSequenceNumber();
      const lastSeen = getLastSeenSequenceNumber();
      return {
        unreadCount: highest > lastSeen ? highest - lastSeen : 0,
        hasUnread: highest > lastSeen,
      };
    },
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = notificationSync.subscribe(() => {
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    });
    return unsubscribe;
  }, [queryClient]);

  return {
    unreadCount: query.data?.unreadCount ?? 0,
    hasUnread: query.data?.hasUnread ?? false,
  };
}
