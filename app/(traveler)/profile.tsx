import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

const PERSONA_TAGS = [
  { emoji: "🏰", label: "History Buff" },
  { emoji: "🍜", label: "Foodie" },
  { emoji: "📸", label: "Photography" },
  { emoji: "🧘", label: "Wellness" },
];

const SETTING_ROWS = [
  { icon: "edit" as const, label: "Edit Profile", onPress: "/settings/editProfile" },
  { icon: "local-offer" as const, label: "Interests & Tags", onPress: "/settings/interests" },
  { icon: "language" as const, label: "App Language", onPress: null },
  { icon: "palette" as const, label: "Theme", onPress: "/settings/theme" },
  { icon: "notifications" as const, label: "Notifications", onPress: null },
  { icon: "security" as const, label: "Privacy & Security", onPress: null },
  { icon: "help" as const, label: "Help & Support", onPress: null },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* App bar */}
      <View className="flex-row items-center justify-between px-4 py-3">
        <Pressable className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={20} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white">Profile</Text>
        <Pressable className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="settings" size={22} color="#0d1b1b" />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Profile header */}
        <View className="items-center px-6 pt-4 pb-6">
          <View className="relative mb-4">
            <View className="w-32 h-32 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1Ny8NfxYlL2K2CAa03QmHEEhygawzlgk7zIY9l3hPUOYdk48MDEjEC4F3cT6xP9z_SwqoscM9EMw-QuvceAiSJ4UQZhf0XrzZMYG6QPZu8S0wiUosX9XOSKXmKv6VQPTkaopqyz-GGGi26uS6DjMK1Tz03RJwwMsyn51jsSBWaNg3SBel8agXN9jh4O1iy0RfJNeR2TiiD5dbZ6xBTkqUu28DcRZ-TbWsRZ7RLAK9fcPCjAkRUTeuVjTZc130tXWb7cuEnrfEFHK" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Pressable className="absolute bottom-1 right-1 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-md">
              <MaterialIcons name="photo-camera" size={18} color="white" />
            </Pressable>
          </View>
          <Text className="text-2xl font-bold text-[#0d1b1b] dark:text-white mb-1">Alex Traveller</Text>
          <View className="flex-row items-center gap-1 mb-2">
            <MaterialIcons name="location-on" size={16} color="#4c9a9a" />
            <Text className="text-sm font-medium text-[#4c9a9a]">San Francisco, CA</Text>
          </View>
          <Text className="text-center text-[#0d1b1b]/80 dark:text-white/80 text-sm max-w-[280px] leading-relaxed">
            Exploring the world, one city at a time. Always looking for the best coffee spots. ☕️✈️
          </Text>
        </View>

        {/* Stats row */}
        <View className="flex-row flex-wrap gap-3 px-4 mb-6">
          {[
            { value: "12", label: "Trips" },
            { value: "4.8 ⭐", label: "Rating" },
            { value: "5", label: "Years" },
          ].map((stat) => (
            <View
              key={stat.label}
              className="flex-1 items-center justify-center bg-white dark:bg-neutral-dark p-3 rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm"
            >
              <Text className="text-2xl font-bold text-[#0d1b1b] dark:text-white">{stat.value}</Text>
              <Text className="text-xs font-medium text-[#4c9a9a] dark:text-[#a0cfcf] uppercase tracking-wide">{stat.label}</Text>
            </View>
          ))}
        </View>

        {/* Action buttons */}
        <View className="flex-row gap-3 px-4 mb-8">
          <Pressable
            onPress={() => router.push("/settings/editProfile")}
            className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl bg-primary"
          >
            <MaterialIcons name="edit" size={18} color="white" />
            <Text className="text-white font-bold text-sm">Edit Profile</Text>
          </Pressable>
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark">
            <MaterialIcons name="share" size={18} color="#0d1b1b" />
            <Text className="text-[#0d1b1b] dark:text-white font-bold text-sm">Share</Text>
          </Pressable>
        </View>

        {/* Travel Persona */}
        <View className="mx-4 mb-4 bg-white dark:bg-neutral-dark rounded-2xl p-5 shadow-sm border border-neutral-light dark:border-neutral-dark">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-[#0d1b1b] dark:text-white uppercase tracking-wider opacity-70">Travel Persona</Text>
            <Pressable onPress={() => router.push("/settings/interests")}>
              <Text className="text-xs font-bold text-primary">Edit</Text>
            </Pressable>
          </View>
          <View className="flex-row flex-wrap gap-2">
            {PERSONA_TAGS.map((tag) => (
              <View
                key={tag.label}
                className="px-3 py-1.5 rounded-lg bg-background-light dark:bg-background-dark border border-neutral-light dark:border-neutral-dark"
              >
                <Text className="text-xs font-semibold text-[#0d1b1b] dark:text-white">
                  {tag.emoji} {tag.label}
                </Text>
              </View>
            ))}
            <Pressable className="px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/20 flex-row items-center gap-1">
              <MaterialIcons name="add" size={14} color="#359EFF" />
              <Text className="text-xs font-semibold text-primary">Add Tag</Text>
            </Pressable>
          </View>
        </View>

        {/* Settings rows */}
        <View className="mx-4 mb-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm overflow-hidden">
          {SETTING_ROWS.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={() => item.onPress && router.push(item.onPress as any)}
              className={`flex-row items-center px-5 py-4 gap-4 ${
                index !== SETTING_ROWS.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              <View className="w-10 h-10 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                <MaterialIcons name={item.icon} size={20} color="#359EFF" />
              </View>
              <Text className="flex-1 text-sm font-semibold text-[#0d1b1b] dark:text-white">{item.label}</Text>
              <MaterialIcons name="chevron-right" size={20} color="#4c9a9a" />
            </Pressable>
          ))}
        </View>

        {/* Logout */}
        <Pressable
          onPress={signOut}
          className="mx-4 flex-row items-center justify-center gap-2 py-4 rounded-xl border border-red-200 dark:border-red-900"
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold">Log Out</Text>
        </Pressable>

        {/* Privacy footer */}
        <View className="flex-row items-center justify-center gap-2 mt-6 opacity-60">
          <MaterialIcons name="verified-user" size={14} color="#4c9a9a" />
          <Text className="text-xs text-[#4c9a9a]">Your personal data is securely encrypted.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
