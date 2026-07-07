import React, { useMemo } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import { useQuery } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import { tripService } from "@/services/trips";
import { resolveImageUrl } from "@/utils/constants";
import BackButton from "@/components/BackButton";

export default function CreatedPlansScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const { data: myTrips, isLoading } = useQuery({
    queryKey: ["my-trips"],
    queryFn: () => tripService.getMyTrips(),
    enabled: !!user,
  });

  const createdPlans = useMemo(() => {
    if (!myTrips || !user) return [];
    return myTrips
      .filter((trip) => trip.createdByUser === user.id)
      .map((trip) => ({
        id: trip.tripId,
        title: trip.title,
        theme: trip.theme,
        image: resolveImageUrl(trip.imagesUrls?.[0] ?? ""),
        isPublic: trip.tripVisibility === "Public",
      }));
  }, [myTrips, user]);

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
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Created Plans</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {createdPlans.length === 0 && (
          <View className="items-center py-12">
            <MaterialIcons name="explore-off" size={48} color="#94a3b8" />
            <Text className="text-sm text-slate-400 dark:text-slate-500 mt-3 text-center">No created plans yet.</Text>
          </View>
        )}
        {createdPlans.map((plan) => (
          <Pressable
            key={plan.id}
            onPress={() => router.push(`/trips/${plan.id}`)}
            className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-100 dark:border-slate-800 mb-4 overflow-hidden shadow-sm active:opacity-90"
          >
            <View className="flex-row">
              <Image source={{ uri: plan.image }} className="w-28 rounded-l-2xl" style={{ aspectRatio: 1 }} resizeMode="cover" />
              <View className="flex-1 p-4 justify-center min-w-0">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-1" numberOfLines={2}>{plan.title}</Text>
                <View className="flex-row items-center gap-2 mb-2">
                  <View className={`px-2 py-0.5 rounded-full ${plan.isPublic ? "bg-primary/10" : "bg-orange-100"}`}>
                    <Text className={`text-[10px] font-bold ${plan.isPublic ? "text-primary" : "text-orange-600"}`}>
                      {plan.theme}
                    </Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-1.5">
                  <MaterialIcons
                    name={plan.isPublic ? "public" : "lock"}
                    size={14}
                    color={plan.isPublic ? "#359EFF" : "#64748b"}
                  />
                  <Text className={`text-xs font-semibold ${plan.isPublic ? "text-primary" : "text-slate-500 dark:text-slate-400"}`}>
                    {plan.isPublic ? "Public" : "Private"}
                  </Text>
                </View>
              </View>
              <View className="items-center justify-center pr-4">
                <MaterialIcons name="chevron-right" size={20} color="#64748b" />
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
