import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";

export default function PlanByUserScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative" style={{ aspectRatio: 4 / 3 }}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuATlIyLdX0EzgB-ANyT3YzRHbzi5AAHhodUiHybWfcMYHJ2weJk1LNoLScSpGgq7lMHI5Ctz7c0HsPxU5pLIe547mXqVc-F1NeSkkMYbXTxlR4bOuKCWJvKjzh6KI7ZNjBImDiDLe1ogwzDCzCscW4JQ854MCbG34O7JJmC6ai9nV5aG-OakGRh2s9AyumPSC8ZcIJoCXJz23wBGq-8psvPormuFzaqwMNHbCy5JjCjZQqlYv0rVFWd0-qKymgT4KJJL_Kp5E7zQmMs" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4" style={{ paddingTop: insets.top + 16 }}>
            <BackButton iconSize={18} iconName="arrow-back-ios-new" className="w-10 h-10 bg-white/20" />
          </View>
          <View className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur">
            <Text className="text-[10px] font-bold text-white tracking-wider uppercase">Shared</Text>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background-light dark:bg-background-dark pt-6 px-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">Giza Plateau Highlights</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Cairo, Egypt • 3 Days</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">Free</Text>
          </View>

          <View className="flex-row items-center gap-3 mb-6">
            <View className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Text className="text-[10px] font-bold text-primary tracking-wide uppercase">Historical</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="language" size={14} color="#94a3b8" />
              <Text className="text-xs text-slate-400">EN, AR</Text>
            </View>
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="group" size={14} color="#94a3b8" />
              <Text className="text-xs text-slate-400">4/10 joined</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <View className="flex-row items-center gap-4">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDIb8G2snwYgyYPVsfFWkowb1l-xb-B2NDysBsL8L1_kKhsqIb6o6QpUbUxL20hWPMsY9ZP-3OqXPHEgjpwAPbyUFUQWpZ89E5I0r6_1ah5bkjCt22oCyVja2_Sw6vO7yKLFPhUsd7SW-9Rklb51bCcX46lTuia1BhcQnlAcoePJClCA3RMCcEG0yOmMIE0TbkKLXTKHJ6pCxmSO-zf7XTsq7UKlPH8jd-jc1-Xv6cn2HcCh631Fxci0n4LUJM9EmjReJGRJ_Q5KAfp" }}
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white">Sara Ahmed</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MaterialIcons name="star" size={14} color="#eab308" />
                  <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">4.8</Text>
                  <Text className="text-xs text-slate-400">(12 reviews)</Text>
                </View>
              </View>
              <Pressable className="px-4 py-2 rounded-lg border border-primary/30">
                <Text className="text-xs font-bold text-primary">View Profile</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">About this trip</Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Join us for an incredible 3-day journey through the Giza Plateau! We&apos;ll explore the Great Pyramids, the Sphinx, and the Grand Egyptian Museum. This is a group trip organized by a fellow traveler — come make new friends!
              <Text className="text-primary font-semibold"> Read more</Text>
            </Text>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden mb-6">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white p-5 pb-3">Itinerary</Text>
            {[
              { day: 1, title: "Arrival & Pyramids" },
              { day: 2, title: "Sphinx & Museums" },
              { day: 3, title: "Old Cairo & Departure" },
            ].map((day) => (
              <View key={day.day}>
                <Pressable
                  onPress={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="flex-row items-center justify-between p-4 border-t border-slate-50 dark:border-slate-700"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                      <Text className="text-white font-bold">{day.day}</Text>
                    </View>
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{day.title}</Text>
                  </View>
                  <MaterialIcons name={expandedDay === day.day ? "expand-less" : "expand-more"} size={20} color="#94a3b8" />
                </Pressable>
                {expandedDay === day.day && (
                  <View className="px-5 pb-4 gap-3 border-t border-slate-50 dark:border-slate-700 pt-3">
                    <Text className="text-xs text-slate-500 dark:text-slate-400">Details coming soon...</Text>
                  </View>
                )}
              </View>
            ))}
          </View>

          <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <View className="flex-row items-start gap-3">
              <MaterialIcons name="info" size={20} color="#d97706" />
              <Text className="text-xs text-amber-800 dark:text-amber-200 flex-1 leading-relaxed">
                This trip was created by a community member. Availability and details may change. Contact the organizer before joining.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton title="Join Trip" onPress={() => {}} />
      </View>
    </View>
  );
}
