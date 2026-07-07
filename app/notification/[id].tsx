import React, { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router, useLocalSearchParams } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { createNotificationRepository } from "@/database/repositories/notificationRepositoryImpl";
import { getLastSeenSequenceNumber, setLastSeenSequenceNumber } from "@/utils/storage";
import type { Notification } from "@/types";

export default function NotificationDetailScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const queryClient = useQueryClient();

  const [notification, setNotification] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const markAsRead = useCallback(async (seq: number) => {
    const current = getLastSeenSequenceNumber();
    if (seq > current) {
      await setLastSeenSequenceNumber(seq);
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
    }
  }, [queryClient]);

  const fetchNotification = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    createNotificationRepository()
      .getById(id)
      .then((n) => {
        if (!n) setError(true);
        else {
          setNotification(n);
          markAsRead(n.sequenceNumber).catch(console.error);
        }
      })
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id, markAsRead]);

  useEffect(() => {
    fetchNotification();
  }, [fetchNotification]);

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (error || !notification) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Notification not found.
        </Text>
        <Pressable
          onPress={() => router.back()}
          className="mt-6 bg-primary rounded-xl py-3 px-8"
        >
          {({ pressed }) => (
            <Text className="text-white font-bold text-sm tracking-wide" style={{ opacity: pressed ? 0.7 : 1 }}>
              Go Back
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <Pressable
            onPress={() => router.back()}
            className="w-10 h-10 items-center justify-center -ml-2"
          >
            <MaterialIcons name="arrow-back-ios-new" size={20} color={isDark ? "#ffffff" : "#0c141d"} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">
            Notification
          </Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, paddingBottom: 40 }}>
        <View className="bg-blue-50 dark:bg-blue-900/20 w-14 h-14 rounded-2xl items-center justify-center mb-4">
          <MaterialIcons name="notifications" size={28} color="#359EFF" />
        </View>

        <Text className="text-xl font-bold text-[#0c141d] dark:text-white mb-2 leading-tight">
          {notification.title}
        </Text>

        <View className="w-12 h-1 bg-primary rounded-full mb-4" />

        <Text className="text-base text-slate-600 dark:text-slate-400 leading-relaxed">
          {notification.message}
        </Text>
      </ScrollView>
    </View>
  );
}
