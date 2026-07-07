import React from "react";
import { ActivityIndicator, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { ProfileMyProfileResponse } from "@/types";
import BackButton from "@/components/BackButton";

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const { data: myProfile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async (): Promise<ProfileMyProfileResponse> => {
      const res = await api.get(ENDPOINTS.profile.myProfile);
      return res.data;
    },
    enabled: !!user,
  });

  const reviews = myProfile?.profile?.reviews ?? [];

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <BackButton iconSize={20} />
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Reviews About Me</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {reviews.length === 0 && (
          <View className="items-center py-12">
            <MaterialIcons name="rate-review" size={48} color="#94a3b8" />
            <Text className="text-sm text-slate-400 dark:text-slate-500 mt-3 text-center">No reviews yet.</Text>
          </View>
        )}
        {reviews.map((review, index) => (
          <View key={index} className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-50 dark:border-slate-700 mb-3">
            <View className="flex-row items-start gap-2">
              <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center mt-0.5 shrink-0">
                <MaterialIcons name="format-quote" size={12} color="#359EFF" />
              </View>
              <Text className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">{review}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
