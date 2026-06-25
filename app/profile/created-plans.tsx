import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const PLANS = [
  {
    id: "1",
    image: "https://images.unsplash.com/photo-1539768942893-daf02e6f2d85?w=400&q=80",
    name: "Grand Egypt Explorer",
    method: "AI-generated",
    days: 7,
    isPublic: true,
  },
  {
    id: "2",
    image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=400&q=80",
    name: "Luxor & Aswan Highlights",
    method: "Form-based",
    days: 4,
    isPublic: false,
  },
  {
    id: "3",
    image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
    name: "Red Sea Relaxation",
    method: "AI-generated",
    days: 5,
    isPublic: true,
  },
];

export default function CreatedPlansScreen() {
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
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Created Plans</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {PLANS.map((plan) => (
          <Pressable
            key={plan.id}
            className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 overflow-hidden shadow-sm active:opacity-90"
          >
            <View className="flex-row">
              <Image source={{ uri: plan.image }} className="w-28 h-full rounded-l-2xl" resizeMode="cover" />
              <View className="flex-1 p-4 justify-center">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-1">{plan.name}</Text>
                <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-2">
                  {plan.method} &mdash; {plan.days} Days
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons
                    name={plan.isPublic ? "public" : "lock"}
                    size={14}
                    color={plan.isPublic ? "#359EFF" : "#4c9a9a"}
                  />
                  <Text className={`text-xs font-semibold ${plan.isPublic ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.isPublic ? "Public" : "Private"}
                  </Text>
                </View>
              </View>
              <View className="items-center justify-center pr-4">
                <MaterialIcons name="chevron-right" size={20} color="#4c9a9a" />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
