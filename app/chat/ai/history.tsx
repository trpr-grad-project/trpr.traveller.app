import React, { useState, useMemo } from "react";
import { Pressable, ScrollView, Text, TextInput, View, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useAiChat } from "@/hooks/useAiChat";

function formatRelativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export default function AIHistoryPanel() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [visible] = useState(true);

  const {
    conversations,
    openConversation,
    createNewChat,
    deleteConversation,
    activeConversation,
  } = useAiChat();

  const filtered = useMemo(() => {
    if (!search.trim()) return conversations;
    const q = search.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(q));
  }, [conversations, search]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View className="flex-1 flex-row">
        <Pressable className="flex-1 bg-black/40" onPress={() => router.back()} />
        <View className="w-3/4 bg-white dark:bg-slate-800 pt-4" style={{ paddingTop: insets.top + 16 }}>
          <View className="px-4 mb-6">
            <View className="flex-row items-center gap-3 mb-6">
              <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center border-2 border-primary">
                <MaterialIcons name="auto-awesome" size={20} color="#359EFF" />
              </View>
              <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Trip Assistant</Text>
            </View>

            <Pressable
              onPress={() => {
                createNewChat();
                router.back();
              }}
              className="w-full h-12 bg-primary rounded-xl items-center justify-center shadow-sm mb-4"
            >
              <View className="flex-row items-center gap-2">
                <MaterialIcons name="add" size={20} color="white" />
                <Text className="text-white font-bold text-sm">New Chat</Text>
              </View>
            </Pressable>

            <View className="flex-row items-center bg-slate-100 dark:bg-slate-700 rounded-xl px-4 h-10 gap-2">
              <MaterialIcons name="search" size={20} color="#94a3b8" />
              <TextInput
                value={search}
                onChangeText={setSearch}
                placeholder="Search chats..."
                placeholderTextColor="#94a3b8"
                className="flex-1 text-sm text-[#0c141d] dark:text-white"
              />
            </View>
          </View>

          <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">
            {search.trim() ? "Search Results" : "Recent Chats"}
          </Text>

          <ScrollView showsVerticalScrollIndicator={false}>
            {filtered.length === 0 ? (
              <Text className="text-sm text-slate-400 text-center mt-8 px-4">
                {search.trim() ? "No matching chats found" : "No conversations yet"}
              </Text>
            ) : (
              filtered.map((chat) => {
                const isActive = chat.id === activeConversation?.id;
                return (
                  <View key={chat.id} className="flex-row items-center mx-2 mb-1">
                    <Pressable
                      onPress={() => {
                        openConversation(chat.id);
                        router.back();
                      }}
                      className={[
                        "flex-row items-center gap-3 px-4 py-3.5 flex-1 rounded-xl",
                        isActive ? "bg-primary/10" : "",
                      ].join(" ")}
                    >
                      <MaterialIcons
                        name="chat"
                        size={20}
                        color={isActive ? "#359EFF" : "#94a3b8"}
                      />
                      <View className="flex-1">
                        <Text
                          className={[
                            "text-sm font-medium",
                            isActive
                              ? "text-[#0c141d] dark:text-white font-bold"
                              : "text-slate-600 dark:text-slate-300",
                          ].join(" ")}
                          numberOfLines={1}
                        >
                          {chat.title}
                        </Text>
                        <Text className="text-[10px] text-slate-400 mt-0.5">
                          {formatRelativeTime(chat.updatedAt)}
                        </Text>
                      </View>
                    </Pressable>
                    <Pressable
                      onPress={() => deleteConversation(chat.id)}
                      className="p-2 mr-1"
                      hitSlop={8}
                    >
                      <MaterialIcons name="delete-outline" size={18} color="#ef4444" />
                    </Pressable>
                  </View>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
