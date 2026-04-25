import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const NOTIFICATIONS = [
  {
    id: "1",
    type: "trip_request",
    icon: "person-add" as const,
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "#359EFF",
    title: "New Trip Request",
    body: "Alex Traveller has requested you as their guide for 'Giza Pyramids Adventure'.",
    time: "2 min ago",
    isRead: false,
    actions: true,
  },
  {
    id: "2",
    type: "message",
    icon: "chat-bubble" as const,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "#22c55e",
    title: "New Message",
    body: "Ahmed Ali sent you a message: 'See you at the museum!'",
    time: "25 min ago",
    isRead: false,
    actions: false,
  },
  {
    id: "3",
    type: "review",
    icon: "star" as const,
    iconBg: "bg-yellow-100 dark:bg-yellow-900/30",
    iconColor: "#eab308",
    title: "New Review",
    body: "You received a 5-star review for your 'Luxor Temple Discovery' guide session.",
    time: "Yesterday",
    isRead: true,
    actions: false,
  },
  {
    id: "4",
    type: "payment",
    icon: "payment" as const,
    iconBg: "bg-emerald-100 dark:bg-emerald-900/30",
    iconColor: "#10b981",
    title: "Payment Received",
    body: "Payment of $120 received for 'Cairo City Walk' completed trip.",
    time: "2 days ago",
    isRead: true,
    actions: false,
  },
];

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-neutral-dark">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color={isDark ? "#E2E8F0" : "#0d1b1b"} />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white">Notifications</Text>
        <Pressable className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="done-all" size={22} color="#359EFF" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 12 }}>
        {NOTIFICATIONS.map((notif) => (
          <View
            key={notif.id}
            className={`flex-row gap-4 p-4 rounded-2xl bg-white dark:bg-neutral-dark border ${
              !notif.isRead
                ? "border-primary/20 dark:border-primary/30"
                : "border-neutral-light dark:border-neutral-dark"
            } shadow-sm`}
          >
            {/* Icon */}
            <View className={`w-12 h-12 rounded-full ${notif.iconBg} items-center justify-center flex-shrink-0`}>
              <MaterialIcons name={notif.icon} size={24} color={notif.iconColor} />
            </View>

            {/* Content */}
            <View className="flex-1">
              <View className="flex-row items-start justify-between mb-1">
                <Text className="font-bold text-[#0d1b1b] dark:text-white text-sm flex-1 mr-2">
                  {notif.title}
                </Text>
                <Text className="text-xs text-[#4c9a9a] flex-shrink-0">{notif.time}</Text>
              </View>
              <Text className="text-xs text-gray-custom dark:text-gray-400 leading-relaxed">{notif.body}</Text>

              {notif.actions && (
                <View className="flex-row gap-2 mt-3">
                  <Pressable className="flex-1 flex-row items-center justify-center gap-1 bg-primary py-2 rounded-lg">
                    <MaterialIcons name="check" size={14} color="white" />
                    <Text className="text-white text-xs font-bold">Accept</Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center justify-center gap-1 bg-neutral-light dark:bg-neutral-dark py-2 rounded-lg border border-neutral-light dark:border-slate-600">
                    <MaterialIcons name="close" size={14} color="#64748b" />
                    <Text className="text-slate-600 dark:text-slate-300 text-xs font-bold">Decline</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Unread dot */}
            {!notif.isRead && (
              <View className="absolute top-4 right-4 w-2.5 h-2.5 rounded-full bg-primary" />
            )}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
