import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

export default function PaymentScreen() {
  const insets = useSafeAreaInsets();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center bg-white/80 dark:bg-background-dark/80 border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-4">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-center mr-8 text-lg font-bold text-[#0c141d] dark:text-white">Payment</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}>
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 flex-row items-center gap-4">
          <View className="w-16 h-16 rounded-xl overflow-hidden">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="flex-1">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white">Luxor Temples Discovery</Text>
            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex-row items-center gap-0.5">
                <MaterialIcons name="location-on" size={12} color="#94a3b8" />
                <Text className="text-xs text-slate-500">Luxor, Egypt</Text>
              </View>
              <View className="flex-row items-center gap-0.5">
                <MaterialIcons name="calendar-today" size={12} color="#94a3b8" />
                <Text className="text-xs text-slate-500">Oct 24-25, 2026</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-3 mt-1">
              <View className="flex-row items-center gap-0.5">
                <MaterialIcons name="group" size={12} color="#94a3b8" />
                <Text className="text-xs text-slate-500">2 Travelers</Text>
              </View>
              <View className="flex-row items-center gap-0.5">
                <MaterialIcons name="schedule" size={12} color="#94a3b8" />
                <Text className="text-xs text-slate-500">2 Days</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
          <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-4">Price Breakdown</Text>
          <View className="gap-3">
            {[
              { label: "Trip Price (2 × $150)", value: "$300" },
              { label: "Service Fee", value: "$15" },
              { label: "Taxes", value: "$5" },
            ].map((item) => (
              <View key={item.label} className="flex-row justify-between">
                <Text className="text-sm text-slate-600 dark:text-slate-400">{item.label}</Text>
                <Text className="text-sm font-semibold text-[#0c141d] dark:text-white">{item.value}</Text>
              </View>
            ))}
            <View className="border-t border-slate-100 dark:border-slate-700 pt-3 flex-row justify-between">
              <Text className="text-base font-bold text-[#0c141d] dark:text-white">Total Amount</Text>
              <Text className="text-base font-bold text-primary">$320</Text>
            </View>
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white">Payment Method</Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary">Change</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center gap-4 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
            <View className="w-12 h-8 rounded-md bg-primary/10 items-center justify-center">
              <MaterialIcons name="credit-card" size={24} color="#359EFF" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Visa ending in 4242</Text>
              <Text className="text-xs text-slate-500">Expires 12/26</Text>
            </View>
          </View>
        </View>

        <View className="flex-row items-start gap-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-xl p-4">
          <MaterialIcons name="info" size={20} color="#3b82f6" />
          <Text className="text-xs text-blue-700 dark:text-blue-300 flex-1 leading-relaxed">
            Free cancellation up to 48 hours before the trip. Full refund guaranteed.
          </Text>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton title="Pay Now $320" onPress={() => {}} />
      </View>
    </View>
  );
}
