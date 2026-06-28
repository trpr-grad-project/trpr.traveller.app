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
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import TripCard, { SOFT_SHADOW } from "@/components/TripCard";
import { router } from "expo-router";

const FEATURED_TRIPS = [
  {
    id: "1",
    title: "Luxor Temples",
    info: "4 Days \u2022 Cultural Tour",
    rating: "4.9",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm",
  },
  {
    id: "2",
    title: "Giza Plateau",
    info: "3 Days \u2022 Historical Hub",
    rating: "4.8",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATlIyLdX0EzgB-ANyT3YzRHbzi5AAHhodUiHybWfcMYHJ2weJk1LNoLScSpGgq7lMHI5Ctz7c0HsPxU5pLIe547mXqVc-F1NeSkkMYbXTxlR4bOuKCWJvKjzh6KI7ZNjBImDiDLe1ogwzDCzCscW4JQ854MCbG34O7JJmC6ai9nV5aG-OakGRh2s9AyumPSC8ZcIJoCXJz23wBGq-8psvPormuFzaqwMNHbCy5JjCjZQqlYv0rVFWd0-qKymgT4KJJL_Kp5E7zQmMs",
  },
];

const SHARED_PLANS = [
  {
    id: "1",
    title: "Cairo Street Food",
    info: "1 Day \u2022 Local Experience",
    rating: "4.6",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf",
  },
  {
    id: "2",
    title: "Siwa Oasis Trip",
    info: "5 Days \u2022 Hidden Gem",
    rating: "4.9",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzQ7N0H5Ctb9KFdHW5X5RkDqziM8sPwCZ2V9GYbKuGg13Eb2RDqaT1R1YclOrGOnwvD1q9uNXuhHhqc340CqLxhYRLyM7etEKwyea3rwhVhqrcn695IQtLvn-8ILyLd1BNbUMkJ_s-yvShyh4mvjFPeGlXpitxyaGjO6zp7T9jlSvsifgEUj6nQ-Cg7c_l5dF6Q6rL7nOFvsMQj-ZT3aLhRp_rLfFaYE0fJ4DLFiNZpCRGAtUsGLR-bHAPwDVMQFPbHcJ-ETqkuJGu",
  },
];

const GUIDE_PLANS = [
  {
    id: "1",
    title: "Nile River Cruise",
    location: "Cairo & Aswan",
    guideName: "Amira K.",
    guideAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDIb8G2snwYgyYPVsfFWkowb1l-xb-B2NDysBsL8L1_kKhsqIb6o6QpUbUxL20hWPMsY9ZP-3OqXPHEgjpwAPbyUFUQWpZ89E5I0r6_1ah5bkjCt22oCyVja2_Sw6vO7yKLFPhUsd7SW-9Rklb51bCcX46lTuia1BhcQnlAcoePJClCA3RMCcEG0yOmMIE0TbkKLXTKHJ6pCxmSO-zf7XTsq7UKlPH8jd-jc1-Xv6cn2HcCh631Fxci0n4LUJM9EmjReJGRJ_Q5KAfp",
    rating: "4.9",
    price: "$450/day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf",
  },
  {
    id: "2",
    title: "Sharm El-Sheikh Getaway",
    location: "Red Sea Coast",
    guideName: "Omar R.",
    guideAvatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXRoVjBVWbDU44_1uomE99h_eCRFBzvkWREFuBLAzPWn3geroTnaF2T42Mh4XoUXUNkFYI5uLgKPQcEfpRHzbFQI9cTnE7URgs7g57Xlc6eERlVukkxKQ9ebxRMcdXAdjhBcSIhP42_fY3BZ2ENO2hrLKt3L9ffYvPV6v_nYy6xUMsEjEYmZVO0VQO198CiZ7Uv9m5KNF3w6KzugouRsodXT0gRGyLuHqhW_WolGBhGIMcYviRov_HXZvvgj7BxbiOPk6oOrhcKJK",
    rating: "4.7",
    price: "$320/day",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAzQ7N0H5Ctb9KFdHW5X5RkDqziM8sPwCZ2V9GYbKuGg13Eb2RDqaT1R1YclOrGOnwvD1q9uNXuhHhqc340CqLxhYRLyM7etEKwyea3rwhVhqrcn695IQtLvn-8ILyLd1BNbUMkJ_s-yvShyh4mvjFPeGlXpitxyaGjO6zp7T9jlSvsifgEUj6nQ-Cg7c_l5dF6Q6rL7nOFvsMQj-ZT3aLhRp_rLfFaYE0fJ4DLFiNZpCRGAtUsGLR-bHAPwDVMQFPbHcJ-ETqkuJGu",
  },
];

const THEMES = ["History", "Romantic", "Adventure", "Family"];

export default function TravelerHome() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("History");

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Fixed header */}
      <View className="bg-white/80 dark:bg-background-dark/80 px-4 py-4">
        <View className="flex-row items-center justify-between">
          <Text className="text-[#0c141d] dark:text-white text-xl font-bold leading-tight tracking-tight">
            Discover your next trip
          </Text>
          <Pressable onPress={() => router.push("/notifications")} className="relative p-2 rounded-full active:bg-slate-100 dark:active:bg-slate-800">
            <MaterialIcons name="notifications-none" size={22} color={isDark ? "#ffffff" : "#0c141d"} />
            <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Search + Create Plan */}
        <View className="px-4 py-2 mt-2 gap-4">
          <Pressable
            onPress={() => router.push("/trips/locationSelect")}
            className="flex-row items-center h-12 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 px-4"
            style={SOFT_SHADOW}
          >
            <MaterialIcons name="search" size={20} color="#94a3b8" />
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search cities, areas, or landmarks"
              placeholderTextColor="#94a3b8"
              className="flex-1 px-2 text-base text-[#0c141d] dark:text-white"
              pointerEvents="none"
            />
          </Pressable>

          <View className="gap-2">
            <Pressable
              onPress={() => router.push("/trips/create-trip")}
              className="w-full h-14 rounded-xl"
              style={
                isDark
                  ? null
                  : {
                      shadowColor: "#359EFF",
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.12,
                      shadowRadius: 8,
                      elevation: 3,
                    }
              }
            >
              <LinearGradient
                colors={["#5cb4ff", "#359EFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 0, y: 1 }}
                className="w-full h-full rounded-xl overflow-hidden flex-row items-center justify-center gap-2"
              >
                <MaterialIcons name="add" size={22} color="white" />
                <Text className="text-white text-base font-semibold">Create Your Trip</Text>
                <View className="absolute top-0 left-0 right-0 h-[1px] bg-white/25" pointerEvents="none" />
              </LinearGradient>
            </Pressable>
            <Text className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-medium">
              Plan a multi-day trip with places, photos, and more.
            </Text>
          </View>
        </View>

        {/* Featured Trips by Companies */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between px-4 pb-2">
            <Text className="text-[#0c141d] dark:text-white text-lg font-bold leading-tight tracking-tight">
              Featured Trips by Companies
            </Text>
            <Pressable onPress={() => router.push("/(traveler)/explore")}>
              <Text className="text-primary text-sm font-semibold">See all</Text>
            </Pressable>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}
          >
            {FEATURED_TRIPS.map((trip) => (
              <Pressable key={trip.id} onPress={() => router.push(`/trips/plan-by-company/${trip.id}`)}>
                <TripCard
                  image={trip.image}
                  title={trip.title}
                  info={trip.info}
                  rating={trip.rating}
                  badgeLabel="BY COMPANY"
                  badgeVariant="company"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Popular Themes */}
        <View className="mt-8">
          <Text className="text-[#0c141d] dark:text-white text-lg font-bold px-4 pb-4">Popular Themes</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
          >
            {THEMES.map((theme) => (
              <Pressable
                key={theme}
                onPress={() => setSelectedTheme(theme)}
                className={`px-6 py-3 rounded-full ${
                  selectedTheme === theme
                    ? "bg-primary/10 border border-primary/20"
                    : "bg-slate-50 dark:bg-slate-800 border border-slate-100 dark:border-slate-700"
                }`}
              >
                <Text
                  className={`text-sm font-bold ${
                    selectedTheme === theme ? "text-primary" : "text-slate-600 dark:text-slate-400"
                  }`}
                >
                  {theme}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Shared Plans */}
        <View className="mt-8">
          <View className="px-4 pb-2">
            <View className="flex-row items-center justify-between">
              <Text className="text-[#0c141d] dark:text-white text-lg font-bold leading-tight tracking-tight">
                Shared Plans
              </Text>
              <Pressable onPress={() => router.push("/(traveler)/explore")}>
                <Text className="text-primary text-sm font-semibold">See all</Text>
              </Pressable>
            </View>
            <Text className="text-[12px] text-slate-400 dark:text-slate-500 mt-0.5 leading-tight">
              Join trips created by other travelers and explore new experiences together.
            </Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}
          >
            {SHARED_PLANS.map((plan) => (
              <Pressable key={plan.id} onPress={() => router.push(`/trips/plan-by-user/${plan.id}`)}>
                <TripCard
                  image={plan.image}
                  title={plan.title}
                  info={plan.info}
                  rating={plan.rating}
                  badgeLabel="GROUP TRIP"
                  badgeVariant="group"
                />
              </Pressable>
            ))}
          </ScrollView>
        </View>

        {/* Plans by Local Guides */}
        <View className="mt-8 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-[#0c141d] dark:text-white text-lg font-bold leading-tight tracking-tight">
              Plans by Local Guides
            </Text>
            <Pressable onPress={() => router.push("/(traveler)/explore")}>
              <Text className="text-primary text-sm font-semibold">View All</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {GUIDE_PLANS.map((plan) => (
              <View
                key={plan.id}
                className="bg-white dark:bg-slate-800 p-3 rounded-xl flex-row gap-4 border border-slate-50 dark:border-slate-700"
                style={SOFT_SHADOW}
              >
                <View className="w-24 h-24 rounded-lg overflow-hidden">
                  <Image source={{ uri: plan.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1 justify-between py-0.5">
                  <View>
                    <View className="flex-row items-center gap-2 mb-1.5">
                      <Image
                        source={{ uri: plan.guideAvatar }}
                        className="w-5 h-5 rounded-full border border-slate-100"
                        resizeMode="cover"
                      />
                      <View>
                        <Text className="text-[10px] font-bold text-primary tracking-[0.05em] uppercase leading-none mb-0.5">
                          Local Guide
                        </Text>
                        <Text className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                          {plan.guideName}
                        </Text>
                      </View>
                    </View>
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{plan.title}</Text>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{plan.location}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-1">
                    <View>
                      <View className="flex-row items-center gap-1">
                        <MaterialIcons name="star" size={14} color="#eab308" />
                        <Text className="text-xs font-bold text-slate-700 dark:text-slate-300">{plan.rating}</Text>
                      </View>
                      <Text className="text-primary font-bold text-sm">{plan.price}</Text>
                    </View>
                    <Pressable onPress={() => router.push(`/trips/plan-by-guide/${plan.id}`)} className="bg-primary px-4 py-2 rounded-lg">
                      <Text className="text-white text-[12px] font-bold">View Plan</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
