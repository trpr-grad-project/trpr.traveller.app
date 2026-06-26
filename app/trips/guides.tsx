import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";

const GUIDES = [
  { id: "1", name: "Elena Rossi", specialty: "Art History Expert", rating: 4.9, reviews: 120, trips: 85, specialty2: "Food Tours & Hidden Gems", verified: true, topPick: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACb46Av0L2s-4J3GGZ5eTEyTzsvF6ARkpcnfaVXFgOrSHRAvzS1NQrjZncBxV3YfcqqCv2c1whBd7PNhfRDCjFNVEzc3Bdu0OrHrfJvA8hGUohleTU4aLvI0zXLRe8IzLSvsoep_HiQCZX_dY_D7zzgXrQV1GJpLj19hL_zuTkphdyR43nLtKD5ftQGBk5SKvvVtgXhMVss-JDV5jkP0jS-fXXk89059MjiurS9Zknjs7FjAP8aFu6ihEiRbpVtvRLnghr4hpKpA0L" },
  { id: "2", name: "Kenji Sato", specialty: "Local Culture Guide", rating: 5.0, reviews: 210, trips: 300, specialty2: "Temples & Zen Gardens", verified: true, topPick: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSwDWki_QrSSWazjAkJ6UTImreG6lQmAbHdePKEPQYhrpwqiF52SpDqDxVP7ZOI4yxcNlyx1crJJtPRDsh6mV1px22SU483rv9xP94uTUejL0o6O9UGTWw32DrrqyhL3Snqgc-SHRcordg81i0EFWhLjK3TnJeXkg7Et37lgj0z1XFeXAEEx8vKV2lkphtgGDXKdc83bYiI2Y7HsGuLNPihBLtg7hg1SdWkio07_oH_q-hFpRo05qUKqd9J4pPz-87VzVsJa2Osn1a" },
  { id: "3", name: "Sakura Tanaka", specialty: "Photography Guide", rating: 4.8, reviews: 85, trips: 42, specialty2: "Photo Spots & Night Walks", verified: false, topPick: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uX8wte7e5VlsG_JE0PjrevwU75qqv5dpCg4u2ToslOcL-wMNkVciJycdD8jo3SOXaGWIhnBuzHj-hdc-I36Tn0QD1dg_YeDrLyJfDmC_T3AFvF6Gy4BZ1Bcs9D-8eDQWeg4EGMWdgwnKk9dEP0P67as-JmH_gf48S8yfBVFPhCtsxIQ1nmi-v-l1dAGtzYE0iz40KOse_22gOQ210hXTl4V9Bk40tC9kprObPrHJTDVbRA0BH5Kkp5zPtACfSHkZPqtUUAPIbu3X" },
  { id: "4", name: "David Chen", specialty: "Shopping Expert", rating: 4.7, reviews: 45, trips: 12, specialty2: "Vintage & Souvenirs", verified: false, topPick: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAkv5C7UHS9PRbddQ0u6u6yvojnGjif9TRV2nsGveN92gf8_w34BVdJFjwhDrqoYx8zZWSbOIjhpyv0ks2Vq8CpWmO4LoPIhizlZOZjMHxOORHtdumtaz6klmqhZS5XJf-1yiPLSD-x58IbzFj7FUEPBst3KyUTtFU7CJlCNX8p1Ktsrxli3oFvqxQcHtvbkIh_uAUpAi-z7GKMQ5-iNbY2sfE_Xy-4GqmnzUUfdXYBQlRyKJK0IvpNAFG43Y_zB31B7sqMI1HlJs_j" },
];

export default function GuidesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="bg-background-light/95 dark:bg-background-dark/95 px-4 pt-6 pb-2 border-b border-gray-200/50 dark:border-gray-800/50">
        <View className="flex-row items-center justify-between mb-4">
          <BackButton iconSize={20} iconName="arrow-back-ios-new" className="-ml-2" />
          <Text className="text-xl font-bold flex-1 text-center pr-8 text-slate-900 dark:text-white">Guides in Kyoto</Text>
          <Pressable className="w-10 h-10 rounded-full items-center justify-center">
            <MaterialIcons name="more-horiz" size={24} color="#0f172a" />
          </Pressable>
        </View>
        <View className="flex-row items-center bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 h-12 px-4 mb-2 gap-3">
          <MaterialIcons name="search" size={22} color="#9ca3af" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search name or specialty"
            placeholderTextColor="#9ca3af"
            className="flex-1 text-base text-slate-900 dark:text-white"
          />
        </View>
      </View>

      {/* Filter chips */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 12, paddingHorizontal: 16, paddingVertical: 12 }}>
        {[
          { label: "Filter", icon: "tune" as const, active: true },
          { label: "Top Rated", icon: "star" as const, active: false },
          { label: "English", icon: "translate" as const, active: false },
          { label: "Price", icon: "attach-money" as const, active: false },
        ].map((chip) => (
          <Pressable
            key={chip.label}
            className={`flex-row shrink-0 items-center gap-2 h-9 px-4 rounded-full ${
              chip.active ? "bg-slate-900 dark:bg-white shadow-sm" : "bg-white dark:bg-slate-800 border border-gray-200 dark:border-gray-700"
            }`}
          >
            <MaterialIcons name={chip.icon} size={18} color={chip.active ? "white" : "#64748b"} />
            <Text className={`text-sm font-semibold ${chip.active ? "text-white dark:text-slate-900" : "text-slate-700 dark:text-gray-200"}`}>
              {chip.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Guide list */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
        {GUIDES.map((guide) => (
          <View
            key={guide.id}
            className={`flex-col bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm ${
              guide.topPick ? "border border-primary/20 shadow-md" : "border border-gray-100 dark:border-gray-700/50"
            }`}
          >
            {guide.topPick && (
              <View className="absolute -top-2.5 left-4 bg-slate-900 px-3 py-1 rounded-full">
                <Text className="text-white text-[10px] font-bold uppercase tracking-wider">Top Pick</Text>
              </View>
            )}
            <View className="flex-row gap-4" style={{ marginTop: guide.topPick ? 4 : 0 }}>
              <View className="relative flex-shrink-0">
                <View className="w-20 h-20 rounded-xl overflow-hidden bg-gray-200">
                  <Image source={{ uri: guide.avatar }} className="w-full h-full" resizeMode="cover" />
                </View>
                {guide.verified ? (
                  <View className="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-0.5">
                    <MaterialIcons name="check-circle" size={18} color="#22c55e" />
                  </View>
                ) : null}
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row justify-between items-start">
                  <View className="flex-1">
                    <Text className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{guide.name}</Text>
                    <Text className="text-xs text-primary font-bold uppercase tracking-wide mt-0.5">{guide.specialty}</Text>
                  </View>
                  <View className="flex-row items-center gap-1 bg-yellow-50 dark:bg-yellow-900/20 px-1.5 py-0.5 rounded-md">
                    <MaterialIcons name="star" size={14} color="#eab308" />
                    <Text className="text-xs font-bold text-slate-900 dark:text-white">{guide.rating}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-3 mt-2">
                  <Text className="text-xs text-slate-500 dark:text-gray-400">{guide.reviews} reviews</Text>
                  <View className="w-1 h-1 rounded-full bg-gray-300" />
                  <Text className="text-xs text-slate-500 dark:text-gray-400">{guide.trips} trips</Text>
                </View>
              </View>
            </View>
            <View className="flex-row items-center justify-between mt-4 pt-3 border-t border-gray-100 dark:border-gray-700 gap-3">
              <Text className="text-sm font-medium text-slate-600 dark:text-gray-300 flex-1" numberOfLines={1}>
                {guide.specialty2}
              </Text>
              <PrimaryButton
                title={guide.verified ? "Request" : "View"}
                onPress={() => router.push("/trips/confirmGuide")}
                className={`h-9 w-auto px-4 rounded-lg ${guide.verified ? "" : "bg-gray-100 dark:bg-slate-700"}`}
              />
            </View>
          </View>
        ))}

        {/* AI suggestion */}
        <View className="bg-slate-900 dark:bg-slate-800 rounded-xl p-5 flex-row items-center gap-4 shadow-lg">
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center flex-shrink-0">
            <MaterialIcons name="auto-awesome" size={22} color="#359EFF" />
          </View>
          <View className="flex-1">
            <Text className="text-sm font-bold text-primary mb-0.5">Not sure who to pick?</Text>
            <Text className="text-xs text-gray-300">Ask our AI to match you with the perfect guide for your itinerary.</Text>
          </View>
          <Pressable
            onPress={() => router.push("/chat/ai")}
            className="bg-primary px-3 py-2 rounded-lg"
          >
            <Text className="text-white text-xs font-bold">Ask AI</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
