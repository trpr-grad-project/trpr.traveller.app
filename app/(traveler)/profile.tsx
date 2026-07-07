import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";

import { useAuth } from "@/context/AuthContext";

const CREATED_PLANS = [
  { id: "1", title: "Luxor Ancient Wonders", tag: "Historical", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuvSvG6yW3GPtGrB5y0OG69QGWi70n2y_eTIJ8NRAQSF0_UA6iauWcG9biqzIOLJNmd2qH0e_RUGxt9a2zIhykR8tJhetFP7vfefnwvfy6kSC2gXR8EEfTAidldgoY2aQABAg9HJh8ahSGjS0OL1rGQ_5H-vXb2W7C7ttTh1UzeBdFQIFo4LRgTEkEG7h9ELM-HEi6UX9ND0vWz2joEKaGyxkgGDgGv5C8E3yINsLQc_w5TPWfvEdUBGgz7g_-YEySUXJXX8R81be5", members: "1/5", isPublic: true },
  { id: "2", title: "Cairo Night Markets", tag: "Culture", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDhMcBHM7uZqiaN9CTWAIeg69VIoZC5se9-ebAw9ms2pOoIPMcnqY8Loun7PhuNIEfDk4kJsQN7D988C8RlFFBrS9ws0GdhSIWE5CoYLcIwfoCE8HBMAxPPz_FhViIKBCEI6l7564jH7pJqFZU_xseH9JCXua6YeUM57yBUP_Hpzp0x-oL2sTrgmbwX0ZfaKuoQMQIIwfpgNjCeH2V45nNdSraFXYrPSE36Opxs3FpJPMrdWxdP6joKcHUtSPzVBvFdkiaJUqP44de", members: "Private", isPublic: false },
];

const SAVED_TRIPS = [
  { id: "1", title: "Dahab Blue Hole", tag: "Adventure", duration: "4 days", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDDhMcBHM7uZqiaN9CTWAIeg69VIoZC5se9-ebAw9ms2pOoIPMcnqY8Loun7PhuNIEfDk4kJsQN7D988C8RlFFBrS9ws0GdhSIWE5CoYLcIwfoCE8HBMAxPPz_FhViIKBCEI6l7564jH7pJqFZU_xseH9JCXua6YeUM57yBUP_Hpzp0x-oL2sTrgmbwX0ZfaKuoQMQIIwfpgNjCeH2V45nNdSraFXYrPSE36Opxs3FpJPMrdWxdP6joKcHUtSPzVBvFdkiaJUqP44de" },
  { id: "2", title: "Alexandria Coast", tag: "Relax", duration: "2 days", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDShsx8ILlSwntA8HJBSPvIrFi9Yo56bJPBHMAhD5yvI6n3VdRvJQnbirJcS-4luNvIkcJ-IlbO4nLB4jrKC2aejMkvtUZG01fpd9E0MspnKo4mbNpIAoXFeYFIJXcVyEqSekaY7BSA-W3tqbutkJ77hCIKksBvv33d6ocZG91dZumuz2pAhv24peeSYmFGOdKw74_O71sXSBGDbn8zVvEar4cD_D7mZ9REYkZRPfLh3orrE7aX9gIK29Qmw-ddDJZZ7K3XGYAhX9aL" },
  { id: "3", title: "The Valley Peaks", tag: "Hiking", duration: "5 days", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuvSvG6yW3GPtGrB5y0OG69QGWi70n2y_eTIJ8NRAQSF0_UA6iauWcG9biqzIOLJNmd2qH0e_RUGxt9a2zIhykR8tJhetFP7vfefnwvfy6kSC2gXR8EEfTAidldgoY2aQABAg9HJh8ahSGjS0OL1rGQ_5H-vXb2W7C7ttTh1UzeBdFQIFo4LRgTEkEG7h9ELM-HEi6UX9ND0vWz2joEKaGyxkgGDgGv5C8E3yINsLQc_w5TPWfvEdUBGgz7g_-YEySUXJXX8R81be5" },
];

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="px-6 pt-4 pb-2">
          <View className="flex-row justify-end mb-4">
            <Pressable
              onPress={() => router.push("/settings")}
              className="p-2 rounded-full active:bg-slate-100 dark:active:bg-slate-800"
            >
              <MaterialIcons name="settings" size={24} color={isDark ? "#ffffff" : "#64748b"} />
            </Pressable>
          </View>

          <View className="w-full flex-col items-center">
            <View className="relative mb-4">
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center border-4 border-white dark:border-neutral-dark shadow-md">
                <Text className="text-white text-4xl font-bold">{initial}</Text>
              </View>
              <Pressable className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-white items-center justify-center shadow-sm">
                <MaterialIcons name="photo-camera" size={14} color="white" />
              </Pressable>
            </View>
            <Text className="text-2xl font-bold font-jakarta-bold text-[#0c141d] dark:text-white w-full text-center tracking-wide" numberOfLines={1}>{`${firstName} ${lastName}`.trim() || "Traveler"}</Text>
            <View className="flex-row items-center gap-1 mt-1">
              <MaterialIcons name="star" size={16} color="#eab308" />
              <Text className="text-sm font-bold text-slate-700 dark:text-slate-200">4.9</Text>
              <Text className="text-sm text-slate-400 font-medium">(24 reviews)</Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-6">
          <Pressable
            onPress={() => router.push("/profile/trips")}
            className="w-full bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm active:scale-[0.98] transition-transform"
          >
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center gap-4">
                <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center">
                  <MaterialIcons name="explore" size={24} color="#359EFF" />
                </View>
                <View>
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">My Trips</Text>
                  <Text className="text-xs text-slate-400 mt-0.5">11 total trips</Text>
                </View>
              </View>
              <MaterialIcons name="chevron-right" size={20} color="#cbd5e1" />
            </View>
          </Pressable>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Created plans</Text>
            <Pressable onPress={() => router.push("/profile/created-plans")}>
              <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">View All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {CREATED_PLANS.map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => router.push(`/trips/planCreated/${plan.id}`)}
                className="min-w-[240px] bg-white dark:bg-slate-800 p-3 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm"
              >
                <View className="flex-row gap-3">
                  <View className="w-16 h-16 rounded-xl overflow-hidden bg-slate-200">
                    <Image source={{ uri: plan.image }} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <View className="flex-1 justify-between py-0.5">
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white line-clamp-1">{plan.title}</Text>
                    <View className="flex-row items-center gap-2">
                      <View className={`px-2 py-0.5 rounded-full ${plan.isPublic ? "bg-primary/10" : "bg-orange-100"}`}>
                        <Text className={`text-[10px] font-bold ${plan.isPublic ? "text-primary" : "text-orange-600"}`}>
                          {plan.tag}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View className="mt-3 pt-3 border-t border-slate-50 dark:border-slate-700 flex-row items-center justify-between">
                  <View className="flex-row items-center gap-1.5 text-slate-500">
                    <MaterialIcons name={plan.isPublic ? "group" : "lock"} size={14} color={plan.isPublic ? "#94a3b8" : "#94a3b8"} />
                    <Text className="text-[11px] font-semibold text-slate-500">{plan.members}</Text>
                  </View>
                  <MaterialIcons name="chevron-right" size={16} color="#cbd5e1" />
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="mb-6">
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Saved Trips</Text>
            <Pressable onPress={() => router.push("/profile/saved-trips")}>
              <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">View All</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}>
            {SAVED_TRIPS.map((trip) => (
              <Pressable key={trip.id} className="min-w-[140px]">
                <View className="relative w-[140px] h-[140px] rounded-2xl overflow-hidden mb-3 shadow-sm">
                  <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                  <View className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm p-1.5 rounded-full">
                    <MaterialIcons name="bookmark" size={16} color="#359EFF" />
                  </View>
                </View>
                <Text className="text-xs font-bold text-[#0c141d] dark:text-white truncate">{trip.title}</Text>
                <Text className="text-[10px] text-slate-400 mt-0.5">{trip.tag} • {trip.duration}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-6">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reputation</Text>
            <Pressable onPress={() => router.push("/profile/reviews")}>
              <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">View all</Text>
            </Pressable>
          </View>
          <View className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-50 dark:border-slate-700 shadow-sm">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-4">Plan Reviews</Text>
            <View className="flex-row gap-4">
              <View className="w-12 h-12 rounded-full overflow-hidden bg-primary/10 items-center justify-center flex-shrink-0">
                <Text className="text-lg font-bold text-primary">A</Text>
              </View>
              <View className="flex-1">
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Amira K.</Text>
                  <View className="flex-row">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialIcons key={i} name="star" size={14} color="#eab308" />
                    ))}
                  </View>
                </View>
                <Text className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed italic">
                  {"\u201C"}Excellent coordination for the Luxor Ancient Wonders plan!{"\u201D"}
                </Text>
                <Text className="text-[10px] text-slate-300 dark:text-slate-600 mt-2 uppercase font-bold tracking-tight">
                  Luxor Ancient Wonders
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
