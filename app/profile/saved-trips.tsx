import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const TRIPS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1539768942893-daf02e6f2d85?w=800&q=80",
    title: "Explore the Pyramids of Giza",
    tag: "Adventure",
    type: "Group Trip",
    duration: "3 Days",
    members: "8-12 people",
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
    title: "Nile Valley Historical Tour",
    tag: "Historical",
    type: "By Guide",
    duration: "5 Days",
    members: "Private",
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
    title: "Red Sea Beach Retreat",
    tag: "Relax",
    type: "By Company",
    duration: "4 Days",
    members: "Up to 6 people",
  },
];

const TAG_COLORS: Record<string, { bg: string; text: string }> = {
  Adventure: { bg: "bg-amber-100 dark:bg-amber-900/40", text: "text-amber-700 dark:text-amber-300" },
  Historical: { bg: "bg-indigo-100 dark:bg-indigo-900/40", text: "text-indigo-700 dark:text-indigo-300" },
  Relax: { bg: "bg-emerald-100 dark:bg-emerald-900/40", text: "text-emerald-700 dark:text-emerald-300" },
};

const TYPE_COLORS: Record<string, { bg: string; text: string }> = {
  "By Company": { bg: "bg-blue-100 dark:bg-blue-900/40", text: "text-blue-700 dark:text-blue-300" },
  "By Guide": { bg: "bg-purple-100 dark:bg-purple-900/40", text: "text-purple-700 dark:text-purple-300" },
  "Group Trip": { bg: "bg-green-100 dark:bg-green-900/40", text: "text-green-700 dark:text-green-300" },
};

export default function SavedTripsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <Pressable onPress={() => router.back()} className="w-10 h-10 items-center justify-center -ml-2">
            <MaterialIcons name="arrow-back-ios-new" size={20} color={isDark ? "#ffffff" : "#0c141d"} />
          </Pressable>
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Saved Trips</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {TRIPS.map((trip) => {
          const tagColor = TAG_COLORS[trip.tag] || TAG_COLORS.Adventure;
          const typeColor = TYPE_COLORS[trip.type] || TYPE_COLORS["By Company"];
          return (
            <Pressable
              key={trip.id}
              className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-100 dark:border-slate-800 mb-5 overflow-hidden shadow-sm active:opacity-90"
            >
              <View className="relative">
                <Image source={{ uri: trip.image }} className="w-full h-48" resizeMode="cover" />
                <View className="absolute top-3 left-3 flex-row gap-2">
                  <View className={`px-3 py-1 rounded-full ${tagColor.bg}`}>
                    <Text className={`text-[11px] font-bold ${tagColor.text}`}>{trip.tag}</Text>
                  </View>
                  <View className={`px-3 py-1 rounded-full ${typeColor.bg}`}>
                    <Text className={`text-[11px] font-bold ${typeColor.text}`}>{trip.type}</Text>
                  </View>
                </View>
                <View className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-dark/90 items-center justify-center">
                  <MaterialIcons name="bookmark" size={18} color="#359EFF" />
                </View>
              </View>
              <View className="p-4">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-2">{trip.title}</Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center gap-3">
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="schedule" size={14} color="#4c9a9a" />
                      <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">{trip.duration}</Text>
                    </View>
                    <View className="flex-row items-center gap-1">
                      <MaterialIcons name="people" size={14} color="#4c9a9a" />
                      <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">{trip.members}</Text>
                    </View>
                  </View>
                  <MaterialIcons name="chevron-right" size={20} color="#4c9a9a" />
                </View>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
