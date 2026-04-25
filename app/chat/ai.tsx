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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const QUICK_PROMPTS = [
  "Plan a Cairo trip",
  "Tell me about Giza",
  "How to find a guide?",
  "Luxor itinerary",
];

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 border-b border-gray-200 dark:border-gray-800">
        <View className="flex-row items-center gap-2">
          <Pressable onPress={() => router.back()} className="p-2 -ml-2">
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#0F172A" />
          </Pressable>
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border-2 border-primary">
              <MaterialIcons name="auto-awesome" size={20} color="#359EFF" />
            </View>
            <View>
              <Text className="text-base font-bold leading-tight text-slate-900 dark:text-white">Trip Assistant</Text>
              <Text className="text-xs text-primary">AI Powered</Text>
            </View>
          </View>
        </View>
        <Pressable className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="history" size={22} color="#64748b" />
        </Pressable>
      </View>

      {/* Main content — empty state */}
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flex: 1, alignItems: "center", justifyContent: "center", padding: 24 }}
      >
        <View className="mb-10 relative items-center justify-center">
          {/* Circle illustration */}
          <View className="w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full items-center justify-center relative">
            <MaterialIcons name="flight" size={120} color="rgba(53,158,255,0.3)" />
            <View className="absolute top-4 left-1/2 -translate-x-1/2">
              <MaterialIcons name="architecture" size={48} color="rgba(53,158,255,0.4)" />
            </View>
            {/* Floating cards */}
            <View
              className="absolute -bottom-2 -left-6 bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-xl border border-primary/20"
              style={{ transform: [{ rotate: "-12deg" }] }}
            >
              <MaterialIcons name="luggage" size={48} color="#359EFF" />
            </View>
            <View
              className="absolute bottom-3 -right-8 bg-white dark:bg-gray-800 p-4 rounded-full shadow-xl border border-primary/20"
              style={{ transform: [{ rotate: "15deg" }] }}
            >
              <MaterialIcons name="photo-camera" size={40} color="rgba(53,158,255,0.8)" />
            </View>
          </View>
        </View>

        <Text className="text-2xl font-bold mb-3 tracking-tight text-slate-900 dark:text-white text-center">
          Hello! How can I help you today?
        </Text>
        <Text className="text-gray-500 dark:text-gray-400 text-sm leading-relaxed max-w-xs text-center">
          Ask me for trip plans, historical facts about monuments, or local recommendations.
        </Text>
      </ScrollView>

      {/* Footer */}
      <View
        className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-2 px-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Quick prompts */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 12 }}>
          {QUICK_PROMPTS.map((prompt) => (
            <Pressable
              key={prompt}
              onPress={() => setMessage(prompt)}
              className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95"
            >
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">{prompt}</Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Input box */}
        <View className="flex-row items-end gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
          <Pressable className="p-2 text-gray-400 rounded-full">
            <MaterialIcons name="add-a-photo" size={24} color="#9ca3af" />
          </Pressable>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Ask anything about your trip..."
            placeholderTextColor="#9ca3af"
            multiline
            className="flex-1 py-2.5 bg-transparent text-sm text-gray-900 dark:text-gray-100"
            style={{ maxHeight: 96 }}
          />
          <Pressable className="p-2 bg-primary rounded-full shadow-sm w-10 h-10 items-center justify-center">
            <MaterialIcons name="arrow-upward" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
