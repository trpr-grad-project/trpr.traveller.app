import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

export default function ConfirmBookingScreen() {
  const insets = useSafeAreaInsets();
  const { planId } = useLocalSearchParams<{ planId: string }>();
  const [travelers, setTravelers] = useState(2);
  const pricePerPerson = 150;

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View className="flex-row items-center bg-white/80 dark:bg-background-dark/80 border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-4">
        <Pressable onPress={() => router.back()} className="p-2 -ml-2 rounded-full">
          <MaterialIcons name="chevron-left" size={28} color="#0c141d" />
        </Pressable>
        <Text className="flex-1 text-center mr-8 text-lg font-bold text-[#0c141d] dark:text-white">Confirm Booking</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-50 dark:border-slate-700 flex-row items-center gap-4" style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 20 }}>
          <View className="w-20 h-20 rounded-xl overflow-hidden">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white">Luxor Temples Discovery</Text>
            <Text className="text-xs text-slate-500 mt-0.5">2 Days</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="verified" size={14} color="#22c55e" />
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-400">Apex Travel</Text>
            </View>
          </View>
        </View>

        <View className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <Text className="text-sm font-semibold text-[#0c141d] dark:text-white mb-4">Number of Travelers</Text>
          <View className="flex-row items-center justify-between">
            <Pressable
              onPress={() => setTravelers(Math.max(1, travelers - 1))}
              className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 items-center justify-center"
            >
              <MaterialIcons name="remove" size={22} color="#64748b" />
            </Pressable>
            <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">{travelers}</Text>
            <Pressable
              onPress={() => setTravelers(Math.min(20, travelers + 1))}
              className="w-10 h-10 rounded-full bg-primary items-center justify-center"
            >
              <MaterialIcons name="add" size={22} color="white" />
            </Pressable>
          </View>
        </View>

        <View className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700">
          <Text className="text-sm font-semibold text-[#0c141d] dark:text-white mb-4">Price Details</Text>
          <View className="flex-row justify-between items-center">
            <Text className="text-sm text-slate-600 dark:text-slate-400">
              ${pricePerPerson} x {travelers} traveler{travelers > 1 ? "s" : ""}
            </Text>
            <Text className="text-base font-bold text-[#0c141d] dark:text-white">${pricePerPerson * travelers}</Text>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.push(`/trips/payment/${planId}`)}
          className="w-full h-14 bg-primary rounded-2xl items-center justify-center shadow-lg"
          style={{ shadowColor: "#359EFF", shadowOpacity: 0.2 }}
        >
          <Text className="text-white font-bold text-base">Confirm & Pay</Text>
        </Pressable>
      </View>
    </View>
  );
}
