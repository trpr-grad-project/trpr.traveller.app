import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Switch, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

export default function GuideChatSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [muteNotifs, setMuteNotifs] = useState(false);
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
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXRoVjBVWbDU44_1uomE99h_eCRFBzvkWREFuBLAzPWn3geroTnaF2T42Mh4XoUXUNkFYI5uLgKPQcEfpRHzbFQI9cTnE7URgs7g57Xlc6eERlVukkxKQ9ebxRMcdXAdjhBcSIhP42_fY3BZ2ENO2hrLKt3L9ffYvPV6v_nYy6xUMsEjEYmZVO0VQO198CiZ7Uv9m5KNF3w6KzugouRsodXT0gRGyLuHqhW_WolGBhGIMcYviRov_HXZvvgj7BxbiOPk6oOrhcKJK" }}
            className="w-24 h-24 rounded-full"
            resizeMode="cover"
          />
          <View className="items-center">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Noura Mohamed</Text>
            <Text className="text-sm text-primary font-semibold">Ancient Egyptian Monuments Specialist</Text>
            <Pressable
              onPress={() => router.push(`/trips/guide/${id}`)}
              className="mt-3 px-4 py-2 rounded-lg border border-primary/30"
            >
              <Text className="text-xs font-bold text-primary">View Profile</Text>
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
            { label: "Photos & Videos", count: "12 items" },
            { label: "Plans", count: "3 shared plans" },
            { label: "Links", count: "5 links" },
            { label: "Files", count: "2 documents" },
          ].map((item, i) => (
            <View key={item.label}>
              <Pressable className="px-5 py-4 flex-row items-center justify-between">
                <Text className="text-sm font-medium text-[#0c141d] dark:text-white">{item.label}</Text>
                <View className="flex-row items-center gap-2">
                  <Text className="text-xs text-slate-400">{item.count}</Text>
                  <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
                </View>
              </Pressable>
              {i < 3 && <View className="h-px bg-slate-100 dark:bg-slate-700 mx-5" />}
            </View>
          ))}
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden">
          {[
            { label: "Hide Chat", color: "#64748b" as const },
            { label: "Block", color: "#ef4444" as const },
            { label: "Report User", color: "#ef4444" as const },
          ].map((item, i) => (
            <View key={item.label}>
              <Pressable className="px-5 py-4 flex-row items-center justify-between">
                <Text className="text-sm font-medium" style={{ color: item.color }}>{item.label}</Text>
                <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
              </Pressable>
              {i < 2 && <View className="h-px bg-slate-100 dark:bg-slate-700 mx-5" />}
            </View>
          ))}
        </View>

        <Pressable className="flex-row items-center justify-center gap-2 py-4 rounded-xl border border-red-200 dark:border-red-900 bg-white dark:bg-slate-800">
          <MaterialIcons name="delete" size={20} color="#ef4444" />
          <Text className="text-sm font-bold text-red-500">Delete Conversation</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
