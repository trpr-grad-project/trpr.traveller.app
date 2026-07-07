import React, { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
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
import TripsTodayFAB from "@/components/TripsTodayFAB";
import { router, useFocusEffect } from "expo-router";
import { useQueryClient } from "@tanstack/react-query";
import { useHomeTrips } from "@/hooks/useHomeTrips";
import { useUnreadCount } from "@/hooks/useUnreadCount";
import { notificationSync } from "@/services/notification/notificationSync";
import { refreshTripsToday } from "@/services/trip/initializeTripHub";
import { resolveImageUrl } from "@/utils/constants";

export default function TravelerHome() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, refetch, isRefetching } = useHomeTrips();
  const { hasUnread } = useUnreadCount();
  const queryClient = useQueryClient();

  useFocusEffect(
    useCallback(() => {
      refreshTripsToday().catch(console.error);
    }, []),
  );

  useFocusEffect(
    useCallback(() => {
      notificationSync.syncNotifications().then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications", "unreadCount"] });
      }).catch(console.error);
    }, [queryClient]),
  );

  const today = new Date().toISOString().slice(0, 10);
  const upcomingByCompany = (data?.byCompany.items ?? []).filter((t) => t.startDate >= today);
  const upcomingShared = (data?.shared.items ?? []).filter((t) => t.startDate >= today);
  const upcomingByGuide = (data?.byGuide.items ?? []).filter((t) => t.startDate >= today);

  if (isLoading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Failed to load trips.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-6 bg-primary rounded-xl py-3 px-8"
        >
          {({ pressed }) => (
            <Text className="text-white font-bold text-sm tracking-wide" style={{ opacity: pressed ? 0.7 : 1 }}>
              Retry
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

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
            {hasUnread && (
              <View className="absolute top-2.5 right-2.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-background-dark" />
            )}
          </Pressable>
        </View>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 96 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor="#359EFF" />
        }
      >
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
              className="w-full h-14 rounded-xl active:opacity-80"
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
              {({ pressed }) => (
                <LinearGradient
                  colors={pressed ? ["#359EFF", "#2b7fd4"] : ["#5cb4ff", "#359EFF"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  className="w-full h-full rounded-xl overflow-hidden flex-row items-center justify-center gap-2"
                >
                  <MaterialIcons name="add" size={22} color="white" />
                  <Text className="text-white text-base font-semibold tracking-wide">Create Your Trip</Text>
                  <View className="absolute top-0 left-0 right-0 h-[1px] bg-white/25" pointerEvents="none" />
                </LinearGradient>
              )}
            </Pressable>
            <Text className="text-[11px] text-slate-400 dark:text-slate-500 text-center font-medium">
              Plan a multi-day trip with places, photos, and more.
            </Text>
          </View>
        </View>

        {/* Featured Trips by Companies */}
        {upcomingByCompany.length > 0 && (
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
              {upcomingByCompany.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  image={resolveImageUrl(trip.imagesUrls?.[0] ?? "")}
                  title={trip.title}
                  info={trip.tripTime || "N/A"}
                  rating="0"
                  badgeLabel="BY COMPANY"
                  badgeVariant="company"
                  price={trip.price === 0 ? "Free" : `$${trip.price}`}
                  onPress={() => router.push(`/trips/${trip.tripId}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {upcomingByCompany.length === 0 && upcomingShared.length === 0 && upcomingByGuide.length === 0 && (
          <View className="flex-1 items-center justify-center py-20 px-6">
            <MaterialIcons name="explore-off" size={56} color="#94a3b8" />
            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
              There are no trips yet
            </Text>
            <Text className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center">
              Create your first trip or explore featured trips.
            </Text>
          </View>
        )}

        {/* Shared Plans */}
        {upcomingShared.length > 0 && (
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
              <Text className="text-[12px] text-slate-500 dark:text-slate-500 mt-0.5 leading-tight">
                Join trips created by other travelers and explore new experiences together.
              </Text>
            </View>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 12, gap: 16 }}
            >
              {upcomingShared.map((plan) => (
                <TripCard
                  key={plan.tripId}
                  image={resolveImageUrl(plan.imagesUrls?.[0] ?? "")}
                  title={plan.title}
                  info={plan.tripTime || "N/A"}
                  rating="0"
                  badgeLabel="GROUP TRIP"
                  badgeVariant="group"
                  price={plan.price === 0 ? "Free" : `$${plan.price}`}
                  onPress={() => router.push(`/trips/${plan.tripId}`)}
                />
              ))}
            </ScrollView>
          </View>
        )}

        {/* Plans by Local Guides */}
        {upcomingByGuide.length > 0 && (
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
              {upcomingByGuide.map((plan) => (
                <Pressable
                  key={plan.tripId}
                  onPress={() => router.push(`/trips/${plan.tripId}`)}
                  className="bg-white dark:bg-slate-800 p-3 rounded-xl flex-row gap-4 border border-slate-50 dark:border-slate-700 active:opacity-80"
                  style={SOFT_SHADOW}
                >
                  <View className="w-24 h-24 rounded-lg overflow-hidden">
                    <Image source={{ uri: resolveImageUrl(plan.imagesUrls?.[0] ?? "") }} className="w-full h-full" resizeMode="cover" />
                  </View>
                  <View className="flex-1 justify-between py-0.5">
                    <View>
                      <View className="flex-row items-center gap-2 mb-1.5">
                        <View className="w-5 h-5 rounded-full bg-primary/20 items-center justify-center">
                          <MaterialIcons name="person" size={14} color="#359EFF" />
                        </View>
                        <View>
                          <Text className="text-[10px] font-bold text-primary tracking-[0.05em] uppercase leading-none mb-0.5">
                            Local Guide
                          </Text>
                          <Text className="text-[11px] font-bold text-slate-800 dark:text-white uppercase tracking-wide">
                            Guide
                          </Text>
                        </View>
                      </View>
                      <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{plan.title}</Text>
                      <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        {plan.segments?.[0]?.places?.[0]?.governorate?.name || plan.theme}
                      </Text>
                    </View>
                    <View className="flex-row items-center justify-between mt-1">
                      <Text className="text-primary font-bold text-sm tracking-wide">
                        {plan.price === 0 ? "Free" : `$${plan.price}`}
                      </Text>
                      <View className="bg-primary px-4 py-2 rounded-lg">
                        <Text className="text-white text-[12px] font-bold">View Plan</Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
      <TripsTodayFAB />
    </View>
  );
}
