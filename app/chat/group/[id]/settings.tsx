import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Switch, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function GroupChatSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [muteNotifs, setMuteNotifs] = useState(true);
  const [pinChat, setPinChat] = useState(false);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-background-light/90 dark:bg-background-dark/90 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}>
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 items-center gap-4">
          <View className="w-20 h-20 rounded-2xl overflow-hidden">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBRrXE--YB_mmudPLrM_t4jzT02PWTfh9Ztqs8LRcqtODG6vCGkpSbONPzZb2He6QkbXqYojzzfX0qEhz0rqp23zP9ge0yoStSW0jvBYsvYPs9-IYWzAKKcyn_dQm49mRlu-tsWKgaoPYgKuNyTg7dHr7oUxt_sDMkmgmVdqtGYoMMmWKXCH_-DgyvDSakTjzcIn6zKfSH9dKrASVvXiJ8d7YL2e7UKJC3JIzuEmyHGiQsIbP0dciJA9qT-y0xMWSioXmnjdLAKxkQk" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="items-center">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Giza Expedition 2024</Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary mt-1">View Group Info</Text>
            </Pressable>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Members (5)</Text>
            <Pressable>
              <Text className="text-xs font-semibold text-primary">View All</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="flex-row" style={{ gap: -8 }}>
              {[1, 2, 3].map((i) => (
                <View key={i} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white dark:border-background-dark">
                  <Image
                    source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD08lVoan8JB_tWKncwWGbr5BwasPlqL-zEmYJxYLHHdvtNWv2IHqa40dZj4E0X9TPaKTjGhLD_3QKz_EdYkZ8D7C1dbjKAsa77fNynWQ-0OoFL4Btki3iQlR03JUZxwE0BmtCj7i24qAA1NjmxENSrH3uuTaLJ58pErS-0HTCMC4w5rrb7fZerWyRXHr6lwsw1aqsq2t94QHfTt8ds2KINiMOjkIoOOZpe5HvaA6qhhOGp6RF42rRY1fKcQ45JSjRGHpo0Xa9xIy1U" }}
                    className="w-full h-full"
                    resizeMode="cover"
                  />
                </View>
              ))}
              <View className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-700 border-2 border-white dark:border-background-dark items-center justify-center">
                <Text className="text-xs font-bold text-slate-500">+2</Text>
              </View>
            </View>
            <Pressable className="w-10 h-10 rounded-full bg-primary/10 border-2 border-white dark:border-background-dark items-center justify-center">
              <MaterialIcons name="person-add" size={18} color="#359EFF" />
            </Pressable>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden">
          <View className="px-5 py-4 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-[#0c141d] dark:text-white">Mute Notifications</Text>
            <Switch value={muteNotifs} onValueChange={setMuteNotifs} trackColor={{ false: "#e2e8f0", true: "#93c5fd" }} thumbColor={muteNotifs ? "#359EFF" : "#f1f5f9"} />
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-700 mx-5" />
          <View className="px-5 py-4 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-[#0c141d] dark:text-white">Pin Chat</Text>
            <Switch value={pinChat} onValueChange={setPinChat} trackColor={{ false: "#e2e8f0", true: "#93c5fd" }} thumbColor={pinChat ? "#359EFF" : "#f1f5f9"} />
          </View>
          <View className="h-px bg-slate-100 dark:bg-slate-700 mx-5" />
          <Pressable className="px-5 py-4 flex-row items-center justify-between">
            <Text className="text-sm font-medium text-[#0c141d] dark:text-white">Search in Conversation</Text>
            <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
          </Pressable>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden">
          {[
            { label: "Photos & Videos", count: "24" },
            { label: "Shared Links", count: "12" },
            { label: "Files", count: "5" },
            { label: "Shared Plans", count: "3" },
          ].map((item, i) => (
            <View key={item.label}>
              <Pressable className="px-5 py-4 flex-row items-center justify-between">
                <View className="flex-row items-center gap-3">
                  <Text className="text-sm font-medium text-[#0c141d] dark:text-white">{item.label}</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-slate-400">{item.count}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </Pressable>
              {i < 3 && <View className="h-px bg-slate-100 dark:bg-slate-700 mx-5" />}
            </View>
          ))}
        </View>

        <Pressable className="flex-row items-center justify-center gap-2 py-4 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800">
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text className="text-sm font-bold text-red-500">Leave Group</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
