import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const SUGGESTIONS = [
  "Tell me about the Pyramids",
  "Are you free tomorrow?",
  "What is the best time to visit?",
];

export default function DirectMessageScreen() {
  const insets = useSafeAreaInsets();
  const { id, name: rawName, email: rawEmail } = useLocalSearchParams<{
    id: string;
    name?: string;
    email?: string;
  }>();
  const name = rawName ? decodeURIComponent(rawName) : "Noura Mohamed";
  const email = rawEmail ? decodeURIComponent(rawEmail) : "";
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [message, setMessage] = useState("");

  const initials = name
    .split(" ")
    .map((n) => n.charAt(0))
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Nav */}
      <View className="bg-white/80 dark:bg-background-dark/80 border-b border-slate-200 dark:border-slate-800">
        <View className="flex-row items-center px-4 py-3 gap-3">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />

          {/* Avatar */}
          <View className="w-10 h-10 rounded-full overflow-hidden bg-primary/10 border border-slate-200 dark:border-slate-700 items-center justify-center">
            <Text className="text-sm font-bold text-primary">{initials}</Text>
          </View>

          <View className="flex-1 min-w-0">
            <Text className="text-base font-bold text-slate-900 dark:text-slate-100 leading-tight truncate">
              {name}
            </Text>
          </View>
          <Pressable onPress={() => router.push(`/chat/${id}/settings`)} className="p-2 rounded-full">
            <MaterialIcons name="more-vert" size={24} color="#64748b" />
          </Pressable>
        </View>
      </View>

      {/* Chat area */}
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Profile intro */}
        <View className="px-6 mb-8 mt-auto pt-16 items-center">
          <View className="w-24 h-24 rounded-full border-4 border-white dark:border-slate-800 mb-4 shadow-xl overflow-hidden bg-primary/10 items-center justify-center">
            <Text className="text-3xl font-bold text-primary">{initials}</Text>
          </View>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">{name}</Text>
          {email ? <Text className="text-sm text-slate-500 dark:text-slate-400 mb-6">{email}</Text> : null}
          <Pressable className="px-6 py-2 rounded-full border border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-800/50">
            <Text className="text-sm font-semibold text-primary">View Profile</Text>
          </Pressable>
        </View>

        {/* Suggestion chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 8, paddingBottom: 16 }}>
          {SUGGESTIONS.map((s) => (
            <Pressable
              key={s}
              onPress={() => setMessage(s)}
              className="px-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full shadow-sm"
            >
              <Text className="text-sm font-medium text-slate-700 dark:text-slate-200 whitespace-nowrap">{s}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </ScrollView>

      {/* Message input */}
      <View
        className="bg-white/95 dark:bg-background-dark/95 border-t border-slate-200 dark:border-slate-800 px-4 pt-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
            <MaterialIcons name="add" size={24} color="#64748b" />
          </Pressable>
          <View className="flex-1 flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-full px-5 pr-12">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder={`Message ${name.split(" ")[0]}...`}
              placeholderTextColor="#94a3b8"
              className="flex-1 py-2.5 text-[15px] text-slate-900 dark:text-slate-100"
            />
            <Pressable className="absolute right-3.5">
              <MaterialIcons name="mood" size={24} color="#359EFF" />
            </Pressable>
          </View>
          <Pressable className="w-10 h-10 rounded-full bg-primary items-center justify-center shadow-lg">
            <MaterialIcons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
