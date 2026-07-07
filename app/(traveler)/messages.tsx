import React, { useMemo, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, RefreshControl, StatusBar, Text, TextInput, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useCallback } from "react";
import { useConversations } from "@/hooks/useConversations";

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

function getInitials(name: string | null): string {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

const AVATAR_COLORS = ["#359EFF", "#FF6B6B", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#F44336", "#3F51B5"];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");

  const { conversations, isLoading, isRefreshing, refresh, hasNextPage, loadMore } = useConversations();

  useFocusEffect(
    useCallback(() => {
      refresh().catch(console.error);
    }, [refresh]),
  );

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => (c.title ?? "").toLowerCase().includes(q));
  }, [conversations, search]);

  const renderItem = ({ item: conv }: { item: (typeof conversations)[number] }) => {
    const unread = parseInt(conv.unreadCount, 10);
    return (
      <Pressable
        key={conv.id}
        onPress={() =>
          router.push(
            `/chat/group/${conv.id}?title=${encodeURIComponent(conv.title ?? "Group Chat")}`,
          )
        }
        className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800"
      >
        <View className="relative">
          {conv.imageUrl ? (
            <View className="w-14 h-14 rounded-xl overflow-hidden bg-slate-200">
              <Image source={{ uri: conv.imageUrl }} className="w-full h-full" resizeMode="cover" />
            </View>
          ) : (
            <View
              className="w-14 h-14 rounded-xl items-center justify-center"
              style={{ backgroundColor: avatarColor(conv.id) }}
            >
              <Text className="text-white text-lg font-bold tracking-wide">{getInitials(conv.title)}</Text>
            </View>
          )}
        </View>
        <View className="flex-1 ml-4">
          <View className="flex-row justify-between items-baseline mb-0.5">
            <Text
              className="font-bold text-[#0c141d] dark:text-white flex-1 mr-2 tracking-wide"
              numberOfLines={1}
            >
              {conv.title ?? "Group Chat"}
            </Text>
            <Text className={`text-xs font-semibold ${unread > 0 ? "text-primary" : "text-slate-400"}`}>
              {formatRelativeTime(conv.lastMessage?.sentAt ?? conv.updatedAt)}
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <Text
              className="text-sm text-slate-500 dark:text-slate-400 flex-1 mr-2 leading-5 tracking-wide"
              numberOfLines={1}
            >
              {conv.lastMessage?.text ?? "No messages yet"}
            </Text>
            {unread > 0 && (
              <View className="bg-primary rounded-full min-w-[20px] h-5 px-1.5 items-center justify-center flex-shrink-0">
                <Text className="text-white text-[11px] font-bold">{unread > 99 ? "99+" : unread}</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-[#0f1923]" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="border-b border-slate-100 dark:border-slate-800 pt-4">
        <View className="items-center px-4 pb-2">
          <Text className="text-[#0c141d] dark:text-white text-lg font-bold">Messages</Text>
        </View>

        <View className="mx-4 mb-2 flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-10 gap-2">
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search chats or guides"
            placeholderTextColor="#94a3b8"
            className="flex-1 text-sm text-[#0c141d] dark:text-white"
          />
        </View>

      </View>

      <Pressable
        onPress={() => router.push("/chat/monument")}
        className="mx-4 mb-3 flex-row items-center gap-3 bg-primary/5 dark:bg-primary/10 px-4 py-3 rounded-2xl border border-primary/10 active:opacity-70"
      >
        <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
          <MaterialIcons name="photo-camera" size={22} color="#359EFF" />
        </View>
        <View className="flex-1">
          <Text className="text-sm font-bold text-[#0c141d] dark:text-white tracking-wide">Recognize a monument</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">Snap a photo to identify any monument</Text>
        </View>
        <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
      </Pressable>

      {isLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#359EFF" />
        </View>
      ) : (
        <FlatList
          data={filtered}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          className="flex-1 mb-24"
          refreshControl={
            <RefreshControl refreshing={isRefreshing} onRefresh={refresh} tintColor="#359EFF" />
          }
          onEndReached={hasNextPage ? loadMore : undefined}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            hasNextPage ? (
              <View className="py-4 items-center">
                <ActivityIndicator size="small" color="#359EFF" />
              </View>
            ) : null
          }
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center py-20 px-6">
              <MaterialIcons name="chat-bubble-outline" size={64} color="#94a3b8" />
              <Text className="text-lg font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
                No conversations yet
              </Text>
              <Text className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center tracking-wide">
                Find people to start chatting
              </Text>
            </View>
          }
        />
      )}

      <Pressable
        onPress={() => router.push("/chat/ai")}
        className="z-[60] flex-row items-center gap-2 bg-[#359EFF] px-5 py-3.5 rounded-t-[28px] rounded-bl-[28px] rounded-br-none shadow-lg"
        style={{
          position: "absolute",
          bottom: insets.bottom + 20,
          right: 15,
          shadowColor: "#359EFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <MaterialIcons name="auto-awesome" size={20} color="white" />
        <Text className="text-white text-sm font-semibold tracking-wide">Trip Assistant</Text>
      </Pressable>
    </View>
  );
}
