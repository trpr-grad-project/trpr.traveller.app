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
import { router } from "expo-router";

const BLOCKED_USERS = [
  { initials: "JD", name: "John Doe", blockedAgo: "3 months ago" },
  { initials: "SM", name: "Sarah Miller", blockedAgo: "1 month ago" },
  { initials: "RK", name: "Raj Kumar", blockedAgo: "2 weeks ago" },
  { initials: "AL", name: "Anna Lopez", blockedAgo: "6 months ago" },
  { initials: "TW", name: "Tom Wilson", blockedAgo: "5 days ago" },
];

export default function BlockedUsersScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Blocked Users</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm">
          {BLOCKED_USERS.map((user, i, arr) => (
            <View
              key={user.name}
              className={`flex-row items-center px-4 py-4 gap-3 ${
                i !== arr.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              {/* Avatar */}
              <View className="w-11 h-11 rounded-full bg-primary/15 items-center justify-center">
                <Text className="text-sm font-bold text-primary">{user.initials}</Text>
              </View>
              {/* Info */}
              <View className="flex-1">
                <Text className="text-sm font-semibold text-[#0d1b1b] dark:text-white">{user.name}</Text>
                <Text className="text-xs font-medium text-[#4c9a9a] mt-0.5">Blocked {user.blockedAgo}</Text>
              </View>
              {/* Unblock */}
              <Pressable className="px-4 py-2 rounded-lg border border-primary/30 bg-primary/5">
                <Text className="text-xs font-bold text-primary">Unblock</Text>
              </Pressable>
            </View>
          ))}
        </View>

        <View className="flex-row items-start gap-2 mt-6 opacity-60">
          <MaterialIcons name="info-outline" size={16} color="#4c9a9a" style={{ marginTop: 1 }} />
          <Text className="text-xs text-[#4c9a9a] leading-relaxed flex-1">
            Blocked users cannot view your profile, send you messages, or request trips with you. They will not be notified that you blocked them.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
