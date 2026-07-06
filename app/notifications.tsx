import React, { useCallback, useRef } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router, useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useNotifications } from "@/hooks/useNotifications";
import { setLastSeenSequenceNumber } from "@/utils/storage";
import { createNotificationRepository } from "@/database/repositories/notificationRepositoryImpl";
import type { NotificationWithIsNew } from "@/hooks/useNotifications";

function NotificationItem({ item }: { item: NotificationWithIsNew }) {
  return (
    <Pressable className="flex-row items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50">
      <View className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
        <MaterialIcons name="notifications" size={24} color="#359EFF" />
      </View>
      <View className="flex-1 min-w-0">
        <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
          {item.title}
        </Text>
        <Text
          className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed"
          numberOfLines={2}
        >
          {item.message}
        </Text>
      </View>
      {item.isNew && (
        <View className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
      )}
    </Pressable>
  );
}

function EmptyState() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 items-center justify-center px-8">
      <MaterialIcons
        name="notifications-none"
        size={64}
        color={isDark ? "#334155" : "#cbd5e1"}
      />
      <Text className="text-lg font-bold text-[#0c141d] dark:text-white mt-4">
        No notifications yet
      </Text>
      <Text className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
        When you receive notifications, they will appear here.
      </Text>
    </View>
  );
}

function ListFooter({
  isLoading,
  hasNextPage,
}: {
  isLoading: boolean;
  hasNextPage: boolean;
}) {
  if (isLoading && hasNextPage) {
    return (
      <View className="py-4">
        <ActivityIndicator size="small" color="#359EFF" />
      </View>
    );
  }
  return null;
}

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const queryClient = useQueryClient();
  const {
    notifications,
    isLoading,
    isRefreshing,
    refresh,
    hasNextPage,
    loadMore,
  } = useNotifications();
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      createNotificationRepository()
        .getLatestSequenceNumber()
        .then(async (highest) => {
          await setLastSeenSequenceNumber(highest);
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
          queryClient.invalidateQueries({
            queryKey: ["notifications", "unreadCount"],
          });
        })
        .catch(console.error);
    }, [queryClient]),
  );

  const handleLoadMore = useCallback(() => {
    if (hasNextPage) {
      loadMore();
    }
  }, [hasNextPage, loadMore]);

  const renderItem = useCallback(
    ({ item }: { item: NotificationWithIsNew }) => (
      <NotificationItem item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: NotificationWithIsNew) => item.id,
    [],
  );

  if (isLoading) {
    return (
      <View
        className="flex-1 bg-white dark:bg-background-dark items-center justify-center"
        style={{ paddingTop: insets.top }}
      >
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <MaterialIcons
              name="arrow-back-ios-new"
              size={20}
              color={isDark ? "#ffffff" : "#0c141d"}
            />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">
            Notifications
          </Text>
        </View>
      </View>

      <FlatList
        ref={flatListRef}
        data={notifications}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        ListEmptyComponent={EmptyState}
        ListFooterComponent={
          <ListFooter isLoading={isRefreshing} hasNextPage={hasNextPage} />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.5}
        refreshing={isRefreshing}
        onRefresh={refresh}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
