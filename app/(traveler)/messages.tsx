import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
  Image,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const FILTERS = ["All", "Groups", "Unread"];

const CONVERSATIONS = [
  {
    id: "1",
    name: "Ahmed Ali",
    preview: "See you at the museum!",
    time: "2m ago",
    unread: 2,
    online: true,
    isGroup: false,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDYcj8ixgYCVK3soWwJ8b53C23S1yKG3746k-7DVcGwdOvg2MfwLa6cgRGbegCCphcvhsBisK3c1KsLEqO4xn0S4mKzZJMoQaDkPatX0vnfcLZ1LIfoVz2iFJa9hkRLic-YVeO_cPr3oTgCnBAgKyqkR7CvLw5eG6E2jcbe1w0PWUYDEhkqY1k9FNtA6xwoC0UnNgaBcoUqGSN62-Dn_0AYTJ3cMYnWmDT4jy3vURoxk8VGw0s6qe27t5HoGzA2MQ7OjoEMj3Pqe5f8",
  },
  {
    id: "2",
    name: "Giza Expedition 2024",
    preview: "Sara: Welcome to Giza!",
    time: "15m ago",
    unread: 0,
    online: false,
    isGroup: true,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuANbCgpwPicHIrfgc1gnuiIe-brA8duxxjEhDP5A7Cb9okvMi0QcuQRAUjd76HgZz6oaeBpcYG1NU9fG1Ozr_hDNytoaTIri7lLbihEtOqQeUXpQuldGxN13CuTivNHHUkkyi1XFdjMREW5dZWdPeTdGV0gxsoqI0Gcptotw8vhPm1Ti99Oqwgl-UWfaK4snVilQG19fTL7tRFKH9TDaajaNHkVoABHfA_WJp9tbp1q503u5a_o0KaMvYcQ_m0jdy_mUnYOVSPXYdVA",
  },
  {
    id: "3",
    name: "Noura Mohamed",
    preview: "Check out these plans.",
    time: "1h ago",
    unread: 0,
    online: false,
    isGroup: false,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDduPDd7LsaTqIf6BIrgZCx-1QxV7IMPZCPBXVMswBz0UwyrzNISKhVvhGjcVd7ITdf2hBy2HScR0-DB6eNfaUysc0Zg5igpNwK7-C46fCEl3CHUJM3vAbpUV2IxbU6CgH4mqmTVAOu1MQ8FHq0SYEDxgjGCHZRikQ9Byg5r24mF6SxBMBhioX7JCuHTVxlfE5XGJ1T7o6ef-3wW7tIfmqOn8o6k7A4-BaCxPEWnXKzYD5MWzQ1EdnXD9uV9mixbqj_HIGFf3Ocj",
  },
  {
    id: "4",
    name: "Marco Polo (Guide)",
    preview: "Your itinerary is ready for review.",
    time: "3h ago",
    unread: 0,
    online: false,
    isGroup: false,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAd5f6mgHmh0Xl93isx8yEQrwQxjyrqm0DYHzHa8-qy7q4SxBXqCTu_LkjRQNF7COL0R8axokaPo6LImSqtYLpSjjJrD5ZkYjOa8LP4t-owJKxSTVhM_n8IC7tjj_9_ZA1z8TAyWo4QGrHSHfnUIxJk5hye2PYIxgDFtYulAhD7jkqgc94VfXWykZ1jjhJcgHaugSk1Z37MiuXSc9tJk_w6IRmUz87Xb6ME9-nhCWROe8jRfa0Bq4uKMuFl99g7TIO6N536tLhlWSs9",
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-white dark:bg-[#1a242d]" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="border-b border-[#f0f2f5] dark:border-gray-800 pt-4">
        <View className="flex-row items-center px-4 pb-2 justify-between">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-start justify-center">
            <MaterialIcons name="arrow-back-ios" size={24} color="#4F4F4F" />
          </Pressable>
          <Text className="text-[#111518] dark:text-white text-xl font-bold flex-1 text-center">Messages</Text>
          <Pressable className="w-10 h-10 rounded-full items-center justify-center">
            <MaterialIcons name="edit-note" size={24} color="#359EFF" />
          </Pressable>
        </View>

        {/* Search */}
        <View className="mx-4 mb-2 flex-row items-center bg-[#f0f2f5] dark:bg-[#2a353f] rounded-xl px-4 h-10 gap-2">
          <MaterialIcons name="search" size={20} color="#5f768c" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search chats"
            placeholderTextColor="#5f768c"
            className="flex-1 text-sm text-[#111518] dark:text-white"
          />
        </View>

        {/* Filter tabs */}
        <View className="px-4 py-3">
          <View className="flex-row bg-[#f0f2f5] dark:bg-[#2a353f] rounded-xl p-1 h-9">
            {FILTERS.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`flex-1 items-center justify-center rounded-lg ${
                  filter === f ? "bg-white dark:bg-[#38434e] shadow-sm" : ""
                }`}
              >
                <Text
                  className={`text-xs font-semibold ${
                    filter === f
                      ? "text-[#111518] dark:text-white"
                      : "text-[#5f768c] dark:text-gray-400"
                  }`}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Conversation list */}
      <ScrollView showsVerticalScrollIndicator={false}>
        {CONVERSATIONS.map((conv) => (
          <Pressable
            key={conv.id}
            onPress={() => router.push(conv.isGroup ? `/chat/group/${conv.id}` : `/chat/${conv.id}`)}
            className="flex-row items-center px-4 min-h-[80px] py-3 justify-between border-b border-gray-50 dark:border-gray-800"
          >
            <View className="flex-row items-center gap-4">
              <View className="relative">
                <View
                  className={`h-14 w-14 overflow-hidden bg-slate-200 ${
                    conv.isGroup ? "rounded-xl" : "rounded-full"
                  }`}
                >
                  <Image source={{ uri: conv.avatar }} className="w-full h-full" resizeMode="cover" />
                </View>
                {conv.online && (
                  <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#1a242d]" />
                )}
              </View>
              <View>
                <Text className="text-[#111518] dark:text-white text-base font-bold leading-tight">
                  {conv.name}
                </Text>
                <Text
                  className={`text-sm leading-normal mt-0.5 ${
                    conv.unread > 0
                      ? "text-primary font-semibold"
                      : "text-[#5f768c] dark:text-gray-400"
                  }`}
                >
                  {conv.preview}
                </Text>
              </View>
            </View>
            <View className="items-end gap-1.5">
              <Text
                className={`text-xs font-bold ${
                  conv.unread > 0 ? "text-primary" : "text-[#5f768c] dark:text-gray-500"
                }`}
              >
                {conv.time}
              </Text>
              {conv.unread > 0 && (
                <View className="w-5 h-5 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white text-[10px] font-bold">{conv.unread}</Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
