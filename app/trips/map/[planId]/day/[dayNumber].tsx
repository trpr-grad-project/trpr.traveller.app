import React from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const ITINERARY = [
  { stop: 1, title: "Karnak Temple", time: "09:00", duration: "3h", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" },
  { stop: 2, title: "Luxor Temple", time: "14:00", duration: "2h", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATlIyLdX0EzgB-ANyT3YzRHbzi5AAHhodUiHybWfcMYHJ2weJk1LNoLScSpGgq7lMHI5Ctz7c0HsPxU5pLIe547mXqVc-F1NeSkkMYbXTxlR4bOuKCWJvKjzh6KI7ZNjBImDiDLe1ogwzDCzCscW4JQ854MCbG34O7JJmC6ai9nV5aG-OakGRh2s9AyumPSC8ZcIJoCXJz23wBGq-8psvPormuFzaqwMNHbCy5JjCjZQqlYv0rVFWd0-qKymgT4KJJL_Kp5E7zQmMs" },
  { stop: 3, title: "Local Market Walk", time: "17:00", duration: "1.5h", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf" },
];

export default function MapViewScreen() {
  const insets = useSafeAreaInsets();
  const { planId, dayNumber } = useLocalSearchParams<{ planId: string; dayNumber: string }>();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <View className="flex-1 bg-slate-200 dark:bg-slate-900 relative">
        <View className="absolute top-0 left-0 right-0 z-10 px-4" style={{ paddingTop: insets.top + 16 }}>
          <View className="flex-row items-center justify-between">
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/90 items-center justify-center shadow-sm">
              <MaterialIcons name="arrow-back" size={22} color="#0c141d" />
            </Pressable>
            <Text className="text-base font-bold text-white bg-black/40 px-4 py-1.5 rounded-full">Day {dayNumber ?? 1}</Text>
            <View className="w-10" />
          </View>
        </View>

        <View className="absolute inset-0 opacity-40">
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`h${i}`} className="absolute left-0 right-0 h-px bg-slate-400" style={{ top: `${i * 5}%` }} />
          ))}
          {Array.from({ length: 20 }).map((_, i) => (
            <View key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-slate-400" style={{ left: `${i * 5}%` }} />
          ))}
        </View>

        <View className="absolute top-1/3 left-1/4 right-1/4 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/30 items-center justify-center">
            <View className="w-6 h-6 rounded-full bg-primary shadow-lg" />
          </View>
          <Text className="mt-2 text-xs font-bold text-white bg-black/60 px-3 py-1 rounded-full">Start: Karnak Temple</Text>
        </View>

        <View className="absolute right-4 top-1/3 gap-3 z-10">
          <Pressable className="w-10 h-10 rounded-xl bg-white/90 items-center justify-center shadow-sm">
            <MaterialIcons name="search" size={20} color="#0c141d" />
          </Pressable>
          <Pressable className="w-10 h-10 rounded-xl bg-white/90 items-center justify-center shadow-sm">
            <MaterialIcons name="add" size={20} color="#0c141d" />
          </Pressable>
          <Pressable className="w-10 h-10 rounded-xl bg-white/90 items-center justify-center shadow-sm">
            <MaterialIcons name="remove" size={20} color="#0c141d" />
          </Pressable>
        </View>
      </View>

      <View className="bg-white dark:bg-slate-800 rounded-t-3xl shadow-lg" style={{ maxHeight: "48%" }}>
        <View className="items-center py-3">
          <View className="w-10 h-1 rounded-full bg-slate-300 dark:bg-slate-600" />
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16 }}>
          <View className="flex-row justify-between bg-slate-50 dark:bg-slate-700/50 rounded-xl p-4">
            <View className="items-center flex-1">
              <Text className="text-xs text-slate-500">Distance</Text>
              <Text className="text-base font-bold text-[#0c141d] dark:text-white">8.4 km</Text>
            </View>
            <View className="w-px bg-slate-200 dark:bg-slate-600" />
            <View className="items-center flex-1">
              <Text className="text-xs text-slate-500">Duration</Text>
              <Text className="text-base font-bold text-[#0c141d] dark:text-white">6.5 hrs</Text>
            </View>
            <View className="w-px bg-slate-200 dark:bg-slate-600" />
            <View className="items-center flex-1">
              <Text className="text-xs text-slate-500">Stops</Text>
              <Text className="text-base font-bold text-[#0c141d] dark:text-white">{ITINERARY.length}</Text>
            </View>
          </View>

          {ITINERARY.map((item, index) => (
            <View key={item.stop} className="flex-row gap-3">
              <View className="items-center">
                <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-sm font-bold text-primary">{item.stop}</Text>
                </View>
                {index < ITINERARY.length - 1 && <View className="flex-1 w-0.5 bg-primary/20 my-1" style={{ minHeight: 40 }} />}
              </View>
              <View className="flex-1 bg-white dark:bg-slate-700/50 rounded-xl p-3 shadow-sm border border-slate-50 dark:border-slate-600 mb-2">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1 mr-2">
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{item.title}</Text>
                    <Text className="text-xs text-primary font-medium mt-0.5">{item.time} • {item.duration}</Text>
                  </View>
                  <View className="w-12 h-12 rounded-lg overflow-hidden bg-slate-200">
                    <View className="w-full h-full bg-primary/10 items-center justify-center">
                      <MaterialIcons name="image" size={18} color="#94a3b8" />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-lg mt-2"
            style={{ shadowColor: "#359EFF", shadowOpacity: 0.2 }}
          >
            <View className="flex-row items-center gap-2">
              <MaterialIcons name="navigation" size={20} color="white" />
              <Text className="text-white font-bold text-base">Start Navigation</Text>
            </View>
          </Pressable>
        </ScrollView>
      </View>
    </View>
  );
}
