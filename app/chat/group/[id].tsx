import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  RefreshControl,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { clsx } from "clsx";
import Toast from "react-native-toast-message";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { queryClient } from "@/app/query-provider";
import { createConversationRepository } from "@/database/repositories/conversationRepositoryImpl";
import { createMessageRepository } from "@/database/repositories/messageRepositoryImpl";
import { useMessages } from "@/hooks/useMessages";
import { chatSync } from "@/services/chat/chatSync";
import { getUserId } from "@/utils/storage";
import { userCache } from "@/utils/userCache";

function formatRelativeTime(iso: string | null | undefined): string {
  if (!iso) return "";
  const now = Date.now();
  const date = new Date(iso);
  const diffMs = now - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "Now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
}

const AVATAR_COLORS = ["#359EFF", "#FF6B6B", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#F44336", "#3F51B5"];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function GroupChatScreen() {
  const insets = useSafeAreaInsets();
  const { id, title } = useLocalSearchParams<{ id: string; title?: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const currentUserId = getUserId();
  const { messages, isLoading, isLoadingOlder, isRefreshing, refresh, loadOlder, hasMore } = useMessages(id);

  // Mark conversation as read when messages are loaded
  useEffect(() => {
    if (!id || messages.length === 0) return;
    const msgRepo = createMessageRepository();
    const convRepo = createConversationRepository();
    msgRepo.getHighestSequence(id).then((seq) => {
      if (seq) {
        convRepo.updateLastReadSequence(id, seq);
        convRepo.updateUnreadCount(id, "0");
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    }).catch(console.error);
  }, [id, messages.length]);

  const handleSend = useCallback(() => {
    const trimmed = input.trim();
    if (!trimmed || !id) return;
    const text = trimmed;
    setInput("");
    chatSync.sendMessage(id, text).catch(() => {
      setInput(text);
      Toast.show({
        type: "error",
        text1: "Failed to send",
        text2: "Please try again",
      });
    });
  }, [input, id]);

  const handleEndReached = useCallback(() => {
    if (hasMore && !isLoadingOlder) loadOlder().catch(console.error);
  }, [hasMore, isLoadingOlder, loadOlder]);

  const renderMessage = ({ item: msg }: { item: (typeof messages)[number] }) => {
    const senderId = msg.senderUserId ?? "unknown";
    const isMe = senderId === currentUserId;
    const isPending = "isPending" in msg && msg.isPending === true;
    const displayName = isMe
      ? "You"
      : userCache.getDisplayName(senderId) ?? `User #${senderId.slice(-4)}`;

    if (isMe) {
      return (
        <View
          key={msg.id}
          className={clsx(
            "flex-row items-end justify-end gap-3 mb-4",
            isPending && "opacity-60",
          )}
        >
          <View className="max-w-[85%] flex-col items-end gap-1">
            <View className="px-4 py-3 bg-primary rounded-xl rounded-br-none shadow-sm">
              <Text
                className="text-white text-[15px] font-normal leading-5"
                allowFontScaling={false}
                includeFontPadding={false}
              >
                {msg.content}
              </Text>
            </View>
            <Text className="text-[11px] text-gray-400 font-medium">
              {isPending ? "Sending..." : formatRelativeTime(msg.sentAtUtc)}
            </Text>
          </View>
        </View>
      );
    }

    return (
      <View key={msg.id} className="flex-row items-end gap-3 mb-4">
        <View
          className="w-9 h-9 rounded-full items-center justify-center flex-shrink-0"
          style={{ backgroundColor: avatarColor(senderId) }}
        >
          <Text className="text-white text-xs font-bold">{displayName.charAt(0).toUpperCase()}</Text>
        </View>
        <View className="flex-1 flex-col gap-1 items-start">
          <Text className="text-primary text-[12px] font-bold">{displayName}</Text>
          <View className="max-w-[85%] px-4 py-3 bg-white dark:bg-gray-800 rounded-xl rounded-bl-none shadow-sm">
            <Text
              className="text-main-light dark:text-white text-[15px] font-normal leading-5"
              allowFontScaling={false}
              includeFontPadding={false}
            >
              {msg.content}
            </Text>
          </View>
          <Text className="text-[11px] text-gray-400 font-medium">{formatRelativeTime(msg.sentAtUtc)}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background-light dark:bg-background-dark"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? insets.top : 0}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-1" style={{ paddingTop: insets.top }}>
        {/* Header */}
        <View className="bg-white/80 dark:bg-background-dark/80 border-b border-gray-100 dark:border-gray-800">
          <View className="flex-row items-center p-4 pb-2 justify-between">
            <BackButton iconSize={18} iconName="arrow-back-ios-new" />
            <Text className="text-main-light dark:text-white text-lg font-bold flex-1 text-center">
              {title ?? "Group Chat"}
            </Text>
            <View className="w-10 h-10" />
          </View>
        </View>

        {/* Messages or loading */}
        {isLoading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#359EFF" />
          </View>
        ) : (
          <FlatList
            ref={flatListRef}
            data={messages}
            keyExtractor={(item) => item.id}
            renderItem={renderMessage}
            inverted
            contentContainerStyle={{ padding: 16, paddingBottom: 8 }}
            onEndReached={handleEndReached}
            onEndReachedThreshold={0.3}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor="#359EFF" />
            }
            ListFooterComponent={
              isLoadingOlder ? (
                <View className="py-4 items-center">
                  <ActivityIndicator size="small" color="#359EFF" />
                </View>
              ) : null
            }
            ListEmptyComponent={
              <View className="flex-1 items-center justify-center py-20 px-6">
                <MaterialIcons name="chat-bubble-outline" size={64} color="#94a3b8" />
                <Text className="text-lg font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
                  No messages yet
                </Text>
                <Text className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center">
                  Start the conversation
                </Text>
              </View>
            }
          />
        )}

        {/* Input */}
        <View
          className="p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
              <MaterialIcons name="add" size={22} color={isDark ? "#E2E8F0" : "#0F172A"} />
            </View>
            <View className="flex-1 relative flex-row items-center">
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder="Type a message..."
                placeholderTextColor="#9ca3af"
                className="flex-1 h-11 bg-gray-100 dark:bg-gray-800 rounded-full px-5 text-[15px] text-main-light dark:text-white"
              />
              <View className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center">
                <MaterialIcons name="mood" size={22} color="#359EFF" />
              </View>
            </View>
            <Pressable
              onPress={handleSend}
              disabled={!input.trim() || !id}
              className={clsx(
                "w-11 h-11 rounded-full items-center justify-center shadow-lg",
                input.trim() ? "bg-primary" : "bg-gray-300 dark:bg-gray-600",
              )}
            >
              <MaterialIcons name="send" size={20} color="white" />
            </Pressable>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
