import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, TextInput, View, Modal } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const RECENT_CHATS = [
  { id: "1", title: "Luxor Temple Tour", active: true },
  { id: "2", title: "Giza Pyramid Visit", active: false },
  { id: "3", title: "Alexandria History Trip", active: false },
];

export default function AIHistoryPanel() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [visible, setVisible] = useState(true);

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
              onPress={() => { router.back(); router.push("/chat/ai"); }}
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

          <Text className="text-xs font-semibold text-slate-500 uppercase tracking-wider px-4 mb-3">Recent Chats</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {RECENT_CHATS.map((chat) => (
              <Pressable
                key={chat.id}
                className={`flex-row items-center gap-3 px-4 py-3.5 mx-2 rounded-xl ${chat.active ? "bg-primary/10" : ""}`}
              >
                <MaterialIcons name="chat" size={20} color={chat.active ? "#359EFF" : "#94a3b8"} />
                <Text className={`text-sm font-medium ${chat.active ? "text-[#0c141d] dark:text-white font-bold" : "text-slate-600 dark:text-slate-300"}`}>
                  {chat.title}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
