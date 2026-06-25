import React from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

const TRANSACTIONS = [
  { id: "1", title: "Nile Sunset Felucca Tour", date: "Jun 15, 2026", amount: "$129.00", status: "completed" as const },
  { id: "2", title: "Giza Pyramids Guided Tour", date: "Jun 10, 2026", amount: "$249.00", status: "completed" as const },
  { id: "3", title: "Luxor Temple Discovery", date: "Jun 5, 2026", amount: "$89.00", status: "completed" as const },
  { id: "4", title: "Egyptian Museum Pass", date: "May 28, 2026", amount: "$45.00", status: "completed" as const },
  { id: "5", title: "Alexandria Day Trip", date: "May 20, 2026", amount: "$199.00", status: "completed" as const },
  { id: "6", title: "Red Sea Snorkeling Excursion", date: "May 12, 2026", amount: "$159.00", status: "refunded" as const },
  { id: "7", title: "Siwa Oasis Weekend Package", date: "Apr 30, 2026", amount: "$349.00", status: "completed" as const },
];

export default function BillingHistoryScreen() {
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
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Billing History</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {TRANSACTIONS.map((tx) => (
          <Pressable
            key={tx.id}
            className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 active:bg-slate-50 dark:active:bg-slate-800/50"
          >
            <View className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
              <MaterialIcons name="receipt-long" size={24} color="#359EFF" />
            </View>
            <View className="flex-1 ml-4">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{tx.title}</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{tx.date}</Text>
            </View>
            <View className="items-end">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{tx.amount}</Text>
              <Text className={`text-[11px] font-semibold mt-0.5 ${tx.status === "refunded" ? "text-red-500" : "text-green-500"}`}>
                {tx.status === "refunded" ? "Refunded" : "Paid"}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
