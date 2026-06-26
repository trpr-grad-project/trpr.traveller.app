import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { clsx } from "clsx";
import { useAiChat } from "@/hooks/useAiChat";
import { Message } from "@/types";

const QUICK_PROMPTS = [
  "Plan a Cairo trip",
  "Tell me about Giza",
  "How to find a guide?",
  "Luxor itinerary",
];

function ChatBubble({ message }: { message: Message }) {
  const isUser = message.role === "user";

  return (
    <View
      className={clsx(
        "mb-3 max-w-[80%]",
        isUser ? "self-end" : "self-start",
      )}
    >
      <View
        className={clsx(
          "rounded-2xl px-4 py-3",
          isUser
            ? "bg-primary rounded-br-md"
            : "bg-white dark:bg-gray-800 rounded-bl-md border border-gray-200 dark:border-gray-700",
        )}
      >
        <Text
          className={clsx(
            "text-sm leading-relaxed",
            isUser ? "text-white" : "text-gray-800 dark:text-gray-100",
          )}
        >
          {message.content}
        </Text>
      </View>
      {message.pending && (
        <View className="flex-row items-center gap-1 mt-1 self-end">
          <ActivityIndicator size={10} color="#359EFF" />
          <Text className="text-[10px] text-gray-400">sending</Text>
        </View>
      )}
      {message.failed && (
        <Text className="text-[10px] text-red-500 mt-1 self-end">
          Failed to send
        </Text>
      )}
    </View>
  );
}

export default function AIChatScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const {
    sendMessage,
    activeConversation,
    messages,
    isLoading,
    error,
  } = useAiChat();

  const hasMessages = messages.length > 0;

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || isLoading) return;
    setInput("");
    sendMessage(trimmed);
  }, [input, isLoading, sendMessage]);

  const handleQuickPrompt = useCallback((prompt: string) => {
    setInput(prompt);
  }, []);

  return (
      <KeyboardAvoidingView
        className="flex-1 bg-background-light dark:bg-background-dark"
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
      >
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="flex-row items-center justify-between p-4 bg-background-light/90 dark:bg-background-dark/90 border-b border-gray-200 dark:border-gray-800">
          <View className="flex-row items-center gap-2">
            <BackButton iconSize={18} iconName="arrow-back-ios-new" />
            <View className="flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border-2 border-primary">
                <MaterialIcons name="auto-awesome" size={20} color="#359EFF" />
              </View>
              <View>
                <Text className="text-base font-bold leading-tight text-slate-900 dark:text-white">
                  {activeConversation ? activeConversation.title : "Trip Assistant"}
                </Text>
                <Text className="text-xs text-primary">AI Powered</Text>
              </View>
            </View>
          </View>
          <Pressable onPress={() => router.push("/chat/ai/history")} className="w-10 h-10 rounded-full items-center justify-center">
            <MaterialIcons name="history" size={22} color="#64748b" />
          </Pressable>
        </View>

        {/* Error banner */}
        {error && (
          <View className="mx-4 mt-2 px-3 py-2 bg-red-50 dark:bg-red-900/30 rounded-lg border border-red-200 dark:border-red-800">
            <Text className="text-xs text-red-600 dark:text-red-400">{error}</Text>
          </View>
        )}

        {/* Messages or empty state */}
        {hasMessages ? (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(m) => m.id}
            renderItem={({ item }) => <ChatBubble message={item} />}
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            onContentSizeChange={() =>
              flatListRef.current?.scrollToEnd({ animated: true })
            }
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View className="flex-1 items-center justify-center px-6">
            <View className="mb-10 relative items-center justify-center">
              <View className="w-64 h-64 bg-primary/5 dark:bg-primary/10 rounded-full items-center justify-center relative">
                <MaterialIcons name="flight" size={120} color="rgba(53,158,255,0.3)" />
                <View className="absolute top-4 left-1/2 -translate-x-1/2">
                  <MaterialIcons name="architecture" size={48} color="rgba(53,158,255,0.4)" />
                </View>
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
          </View>
        )}

        {/* Footer */}
        <View
          className="bg-background-light dark:bg-background-dark border-t border-gray-200 dark:border-gray-800 pt-2 px-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          {/* Quick prompts */}
          {!hasMessages && (
            <ScrollableQuickPrompts prompts={QUICK_PROMPTS} onSelect={handleQuickPrompt} />
          )}

          {/* Input box */}
          <View className="flex-row items-end gap-2 bg-white dark:bg-gray-800 p-2 rounded-2xl shadow-sm border border-gray-200 dark:border-gray-700">
            <Pressable className="p-2 text-gray-400 rounded-full">
              <MaterialIcons name="add-a-photo" size={24} color="#9ca3af" />
            </Pressable>
            <TextInput
              value={input}
              onChangeText={setInput}
              placeholder="Ask anything about your trip..."
              placeholderTextColor="#9ca3af"
              multiline
              className="flex-1 py-2.5 bg-transparent text-sm text-gray-900 dark:text-gray-100"
              style={{ maxHeight: 96 }}
            />
            <Pressable
              onPress={handleSend}
              disabled={isLoading || !input.trim()}
              className={clsx(
                "p-2 rounded-full shadow-sm w-10 h-10 items-center justify-center",
                isLoading || !input.trim()
                  ? "bg-gray-300 dark:bg-gray-600"
                  : "bg-primary",
              )}
            >
              {isLoading ? (
                <ActivityIndicator size={18} color="white" />
              ) : (
                <MaterialIcons name="arrow-upward" size={20} color="white" />
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

function ScrollableQuickPrompts({
  prompts,
  onSelect,
}: {
  prompts: string[];
  onSelect: (prompt: string) => void;
}) {
  return (
    <FlatList
      horizontal
      data={prompts}
      keyExtractor={(item) => item}
      renderItem={({ item }) => (
        <Pressable
          onPress={() => onSelect(item)}
          className="px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm active:scale-95"
        >
          <Text className="text-sm font-medium text-gray-700 dark:text-gray-200 whitespace-nowrap">
            {item}
          </Text>
        </Pressable>
      )}
      contentContainerStyle={{ gap: 8, marginBottom: 12 }}
      showsHorizontalScrollIndicator={false}
    />
  );
}
