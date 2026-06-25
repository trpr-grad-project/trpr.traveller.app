import React from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const NOTIFICATIONS = [
  { id: "1", type: "itinerary", icon: "location-on" as const, iconBg: "bg-blue-100 dark:bg-blue-900/30", iconColor: "#359EFF", title: "Itinerary Updated", body: "Your Luxor Temple Tour itinerary has been updated. Check out the new schedule.", time: "10m ago", isRead: false },
  { id: "2", type: "bid", icon: "gavel" as const, iconBg: "bg-amber-100 dark:bg-amber-900/30", iconColor: "#d97706", title: "New Bid Received", body: "Kenji Sato has placed a bid on your 'Giza Pyramids' trip request.", time: "1h ago", isRead: false },
  { id: "3", type: "upcoming", icon: "schedule" as const, iconBg: "bg-green-100 dark:bg-green-900/30", iconColor: "#22c55e", title: "Upcoming Trip", body: "Your 'Nile Sunset Felucca' trip starts tomorrow at 4 PM.", time: "2h ago", isRead: false },
  { id: "4", type: "message", icon: "chat-bubble" as const, iconBg: "bg-purple-100 dark:bg-purple-900/30", iconColor: "#a855f7", title: "New Message", body: "Noura Mohamed sent you a message: 'See you at the museum!'", time: "Yesterday", isRead: true },
  { id: "5", type: "review", icon: "star" as const, iconBg: "bg-yellow-100 dark:bg-yellow-900/30", iconColor: "#eab308", title: "New Review", body: "You received a 5-star review for your 'Luxor Temple Discovery' guide session.", time: "Yesterday", isRead: true },
  { id: "6", type: "alert", icon: "campaign" as const, iconBg: "bg-red-100 dark:bg-red-900/30", iconColor: "#ef4444", title: "Service Alert", body: "Due to weather conditions, some Nile cruises may be rescheduled.", time: "2d ago", isRead: true },
];

const ICON_MAP: Record<string, { icon: typeof NOTIFICATIONS[number]["icon"]; bg: string; color: string }> = {
  itinerary: { icon: "location-on", bg: "bg-blue-100 dark:bg-blue-900/30", color: "#359EFF" },
  bid: { icon: "gavel", bg: "bg-amber-100 dark:bg-amber-900/30", color: "#d97706" },
  upcoming: { icon: "schedule", bg: "bg-green-100 dark:bg-green-900/30", color: "#22c55e" },
  message: { icon: "chat-bubble", bg: "bg-purple-100 dark:bg-purple-900/30", color: "#a855f7" },
  review: { icon: "star", bg: "bg-yellow-100 dark:bg-yellow-900/30", color: "#eab308" },
  alert: { icon: "campaign", bg: "bg-red-100 dark:bg-red-900/30", color: "#ef4444" },
};

export default function NotificationsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <MaterialIcons name="arrow-back-ios-new" size={20} color={isDark ? "#ffffff" : "#0c141d"} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Notifications</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {NOTIFICATIONS.map((notif) => {
          const colors = ICON_MAP[notif.type] || ICON_MAP.alert;
          return (
            <Pressable
              key={notif.id}
              className="flex-row items-center gap-4 px-6 py-4 border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50"
            >
              <View className={`w-12 h-12 rounded-2xl ${colors.bg} items-center justify-center`}>
                <MaterialIcons name={colors.icon} size={24} color={colors.color} />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row items-center justify-between mb-0.5">
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{notif.title}</Text>
                  <Text className={`text-[11px] font-semibold ${notif.isRead ? "text-slate-400" : "text-primary"}`}>
                    {notif.time}
                  </Text>
                </View>
                <Text className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed" numberOfLines={2}>
                  {notif.body}
                </Text>
              </View>
              {!notif.isRead && (
                <View className="w-2.5 h-2.5 rounded-full bg-primary flex-shrink-0 mt-0.5" />
              )}
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
