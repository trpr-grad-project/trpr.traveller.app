import React from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";

export default function ConfirmGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-slate-900 dark:text-white ml-2">Confirm Guide Request</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
        {/* Guide profile card */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 items-center gap-4">
          <View className="relative">
            <View className="w-24 h-24 rounded-2xl overflow-hidden border-2 border-primary/20">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSwDWki_QrSSWazjAkJ6UTImreG6lQmAbHdePKEPQYhrpwqiF52SpDqDxVP7ZOI4yxcNlyx1crJJtPRDsh6mV1px22SU483rv9xP94uTUejL0o6O9UGTWw32DrrqyhL3Snqgc-SHRcordg81i0EFWhLjK3TnJeXkg7Et37lgj0z1XFeXAEEx8vKV2lkphtgGDXKdc83bYiI2Y7HsGuLNPihBLtg7hg1SdWkio07_oH_q-hFpRo05qUKqd9J4pPz-87VzVsJa2Osn1a" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-700 rounded-full p-0.5">
              <MaterialIcons name="check-circle" size={20} color="#22c55e" />
            </View>
          </View>
          <View className="items-center">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Kenji Sato</Text>
            <Text className="text-sm text-primary font-bold uppercase tracking-wide">Local Culture Guide</Text>
          </View>
          <View className="flex-row gap-6">
            {[
              { value: "5.0", label: "Rating", icon: "star" as const },
              { value: "300", label: "Trips", icon: "flag" as const },
              { value: "210", label: "Reviews", icon: "reviews" as const },
            ].map((stat) => (
              <View key={stat.label} className="items-center gap-1">
                <MaterialIcons name={stat.icon} size={16} color="#359EFF" />
                <Text className="font-bold text-slate-900 dark:text-white">{stat.value}</Text>
                <Text className="text-xs text-slate-500 dark:text-gray-400">{stat.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Trip details */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 gap-4">
          <Text className="font-bold text-slate-900 dark:text-white">Trip Details</Text>
          {[
            { icon: "location-on" as const, label: "Destination", value: "Kyoto, Japan" },
            { icon: "calendar-today" as const, label: "Dates", value: "Oct 12 - Oct 18, 2023" },
            { icon: "group" as const, label: "Participants", value: "2 travellers" },
            { icon: "category" as const, label: "Focus", value: "Temples & Zen Gardens" },
          ].map((item) => (
            <View key={item.label} className="flex-row items-center gap-4">
              <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center">
                <MaterialIcons name={item.icon} size={18} color="#359EFF" />
              </View>
              <View>
                <Text className="text-xs text-slate-500 dark:text-gray-400">{item.label}</Text>
                <Text className="text-sm font-semibold text-slate-900 dark:text-white">{item.value}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Pricing */}
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-700 gap-3">
          <Text className="font-bold text-slate-900 dark:text-white">Pricing</Text>
          {[
            { label: "Guide fee (6 days × $80)", value: "$480" },
            { label: "Service fee (5%)", value: "$24" },
          ].map((row) => (
            <View key={row.label} className="flex-row justify-between">
              <Text className="text-sm text-slate-500 dark:text-gray-400">{row.label}</Text>
              <Text className="text-sm font-semibold text-slate-900 dark:text-white">{row.value}</Text>
            </View>
          ))}
          <View className="border-t border-slate-100 dark:border-slate-700 pt-3 flex-row justify-between">
            <Text className="font-bold text-slate-900 dark:text-white">Total</Text>
            <Text className="font-bold text-primary text-lg">$504</Text>
          </View>
        </View>
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 p-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 gap-3"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton title="Confirm & Send Request" onPress={() => router.push("/trips/planSuccess")} />
        <Pressable
          onPress={() => router.push("/chat/1")}
          className="w-full h-11 items-center justify-center flex-row gap-2"
        >
          <MaterialIcons name="chat" size={18} color="#359EFF" />
          <Text className="text-primary font-semibold">Message Guide First</Text>
        </Pressable>
      </View>
    </View>
  );
}
