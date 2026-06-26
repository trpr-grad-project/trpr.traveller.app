import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";

export default function PlanCreatedScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="relative h-[40vh]">
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute top-0 left-0 right-0 px-4" style={{ paddingTop: insets.top + 16 }}>
            <BackButton iconSize={18} iconName="close" className="w-10 h-10 bg-white/20" onPress={() => router.dismissAll()} />
          </View>
          <View className="absolute bottom-6 left-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur">
            <Text className="text-[10px] font-bold text-white tracking-wider uppercase">Just Created</Text>
          </View>
        </View>

        <View className="-mt-6 rounded-t-3xl bg-background-light dark:bg-background-dark pt-6 px-4">
          <Text className="text-2xl font-bold text-[#0c141d] dark:text-white mb-2">Luxor Ancient Wonders</Text>

          <View className="flex-row items-center gap-4 mb-4">
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="group" size={16} color="#94a3b8" />
              <Text className="text-xs font-medium text-slate-500">1 of 5</Text>
            </View>
            <View className="flex-row items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary/10">
              <MaterialIcons name="public" size={12} color="#359EFF" />
              <Text className="text-[10px] font-bold text-primary">Public</Text>
            </View>
          </View>

          <View className="flex-row gap-2 mb-6">
            {["EN", "AR"].map((lang) => (
              <View key={lang} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">{lang}</Text>
              </View>
            ))}
          </View>

          <PrimaryButton title="Open Group Chat" onPress={() => {}} className="mb-8" />

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <View className="flex-row flex-wrap gap-4">
              <View className="flex-1 min-w-[120px]">
                <Text className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Location</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="location-on" size={14} color="#359EFF" />
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Luxor, Egypt</Text>
                </View>
              </View>
              <View className="flex-1 min-w-[120px]">
                <Text className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-1">Theme</Text>
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="category" size={14} color="#359EFF" />
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Historical</Text>
                </View>
              </View>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">Description</Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              A journey through the ancient wonders of Luxor, exploring temples and tombs with fellow travelers.
            </Text>
          </View>

          <View className="items-center px-6 py-10 bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl border-2 border-dashed border-slate-200 dark:border-slate-700 mb-6">
            <View className="w-20 h-20 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center mb-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.04, shadowRadius: 20 }}>
              <MaterialIcons name="person-add" size={36} color="#94a3b8" />
            </View>
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">No one has joined yet</Text>
            <Text className="text-sm text-slate-500 text-center mb-6">
              Share the invite link with friends or fellow travelers to start building your group.
            </Text>
            <Pressable className="bg-slate-800 dark:bg-slate-600 rounded-lg px-6 py-2">
              <Text className="text-white font-bold text-sm">Share Invite Link</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
