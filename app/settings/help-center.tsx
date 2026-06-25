import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const TOPICS = [
  {
    icon: "rocket-launch" as const,
    title: "Getting Started",
    subtitle: "New to the platform? Start here.",
  },
  {
    icon: "security" as const,
    title: "Account & Security",
    subtitle: "Login, passwords, privacy settings.",
  },
  {
    icon: "explore" as const,
    title: "Booking & Trips",
    subtitle: "How bookings, cancellations & refunds work.",
  },
  {
    icon: "account-balance-wallet" as const,
    title: "Payments",
    subtitle: "Billing, invoices, and payout inquiries.",
  },
];

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Help Center</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {/* Search */}
        <View className="flex-row items-center bg-white dark:bg-neutral-dark rounded-xl border border-neutral-light dark:border-neutral-dark px-4 h-12 mb-6 gap-2">
          <MaterialIcons name="search" size={20} color="#4c9a9a" />
          <TextInput
            placeholder="Search help articles..."
            placeholderTextColor="#9ca3af"
            className="flex-1 text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
          />
        </View>

        {/* Topic Cards */}
        <View className="gap-3 mb-8">
          {TOPICS.map((topic) => (
            <Pressable
              key={topic.title}
              className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-4 shadow-sm"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-11 h-11 rounded-full bg-primary/10 items-center justify-center">
                  <MaterialIcons name={topic.icon} size={22} color="#359EFF" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-bold text-[#0d1b1b] dark:text-white">{topic.title}</Text>
                  <Text className="text-xs font-medium text-[#4c9a9a] mt-0.5">{topic.subtitle}</Text>
                </View>
                <Text className="text-xs font-bold text-primary">View all</Text>
              </View>
            </Pressable>
          ))}
        </View>

        {/* Contact Us */}
        <Text className="text-xs font-semibold text-[#4c9a9a] uppercase tracking-widest mb-3 ml-1">Contact Us</Text>
        <View className="flex-row gap-3">
          <Pressable className="flex-1 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
              <MaterialIcons name="chat" size={24} color="#359EFF" />
            </View>
            <Text className="text-sm font-bold text-[#0d1b1b] dark:text-white">Live Chat</Text>
            <Text className="text-[10px] font-medium text-[#4c9a9a] mt-1">Instant reply</Text>
          </Pressable>
          <Pressable className="flex-1 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 items-center shadow-sm">
            <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center mb-2">
              <MaterialIcons name="email" size={24} color="#359EFF" />
            </View>
            <Text className="text-sm font-bold text-[#0d1b1b] dark:text-white">Email Support</Text>
            <Text className="text-[10px] font-medium text-[#4c9a9a] mt-1">24h response</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
