import React, { useCallback, useMemo } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router, useFocusEffect } from "expo-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { useAuth } from "@/context/AuthContext";
import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { tripService } from "@/services/trips";
import { resolveImageUrl } from "@/utils/constants";
import type { ProfileMyProfileResponse } from "@/types";

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const queryClient = useQueryClient();

  const { data: myProfile, isLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: async (): Promise<ProfileMyProfileResponse> => {
      const res = await api.get(ENDPOINTS.profile.myProfile);
      return res.data;
    },
    enabled: !!user,
  });

  const { data: myTrips } = useQuery({
    queryKey: ["my-trips"],
    queryFn: () => tripService.getMyTrips(),
    enabled: !!user,
  });

  useFocusEffect(
    useCallback(() => {
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
    }, [queryClient]),
  );

  const createdPlans = useMemo(() => {
    if (!myTrips || !user) return [];
    return myTrips
      .filter((trip) => trip.createdByUser === user.id)
      .map((trip) => ({
        id: trip.tripId,
        title: trip.title,
        tag: trip.theme,
        image: resolveImageUrl(trip.imagesUrls?.[0] ?? ""),
        isPublic: trip.tripVisibility === "Public",
        members: trip.tripVisibility === "Public" ? `${trip.maxParticipantsCount} max` : "Private",
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

  const pd = myProfile?.profile;
  const initials = getInitials(myProfile?.firstName, myProfile?.lastName);

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
              {pd?.avatarUrl ? (
                <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-md">
                  <Image source={{ uri: pd.avatarUrl }} className="w-full h-full" resizeMode="cover" />
                </View>
              ) : (
                <View className="w-24 h-24 rounded-full bg-primary items-center justify-center border-4 border-white dark:border-neutral-dark shadow-md">
                  <Text className="text-white text-4xl font-bold">{initials}</Text>
                </View>
              )}
              <Pressable className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-primary border-2 border-white items-center justify-center shadow-sm">
                <MaterialIcons name="photo-camera" size={14} color="white" />
              </Pressable>
            </View>
            <Text className="text-2xl font-bold font-jakarta-bold text-[#0c141d] dark:text-white w-full text-center tracking-wide" numberOfLines={1}>
              {myProfile ? `${myProfile.firstName} ${myProfile.lastName}`.trim() : "Traveler"}
            </Text>
            {pd?.rating != null ? (
              <View className="flex-row items-center gap-1 mt-1">
                <MaterialIcons name="star" size={16} color="#eab308" />
                <Text className="text-sm font-bold text-slate-700 dark:text-slate-200">{pd.rating.toFixed(1)}</Text>
                {pd.reviews?.length > 0 && (
                  <Text className="text-sm text-slate-400 font-medium">({pd.reviews.length} reviews)</Text>
                )}
              </View>
            ) : (
              <View className="flex-row items-center gap-1 mt-1">
                <Text className="text-sm text-slate-400 font-medium">—</Text>
              </View>
            )}
          </View>
        </View>

        {/* Bio */}
        {pd?.bio ? (
          <View className="mx-4 mb-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-50 dark:border-slate-700">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</Text>
            <Text className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{pd.bio}</Text>
          </View>
        ) : null}

        {/* Languages */}
        {pd?.languages?.length > 0 && (
          <View className="mx-4 mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Languages</Text>
            <View className="flex-row flex-wrap gap-2">
              {pd.languages.map((lang) => (
                <View key={lang.id} className="flex-row items-center gap-1.5 bg-white dark:bg-slate-800 rounded-full px-3.5 py-2 border border-slate-50 dark:border-slate-700">
                  <Text className="text-sm font-medium text-slate-700 dark:text-slate-300">{lang.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Interests */}
        {pd?.interests?.length > 0 && (
          <View className="mx-4 mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Interests</Text>
            <View className="flex-row flex-wrap gap-2">
              {pd.interests.map((interest) => (
                <View key={interest.id} className="flex-row items-center gap-1.5 bg-primary/10 rounded-full px-3.5 py-2 border border-primary/20">
                  <Text className="text-sm font-medium text-primary">{interest.name}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Vibes */}
        {pd?.vibes?.length > 0 && (
          <View className="mx-4 mb-4">
            <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 px-1">Vibes</Text>
            <View className="flex-row flex-wrap gap-2">
              {pd.vibes.map((vibe) => (
                <View key={vibe.id} className="bg-white dark:bg-slate-800 rounded-xl px-4 py-3 border border-slate-50 dark:border-slate-700" style={{ minWidth: 120 }}>
                  <Text className="text-sm font-bold text-slate-800 dark:text-white">{vibe.name}</Text>
                  <Text className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">{vibe.description}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

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
                  <Text className="text-xs text-slate-400 mt-0.5">View your trips</Text>
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
            {createdPlans.slice(0, 5).map((plan) => (
              <Pressable
                key={plan.id}
                onPress={() => router.push(`/trips/${plan.id}`)}
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

        {/* Reputations */}
        {pd?.reviews?.length > 0 && (
          <View className="px-6 mb-4">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest">Reputation</Text>
              <Pressable onPress={() => router.push("/profile/reviews")}>
                <Text className="text-primary text-[10px] font-bold uppercase tracking-wider">View all</Text>
              </Pressable>
            </View>
            {pd.reviews.slice(0, 3).map((review, index) => (
              <View key={index} className="bg-white dark:bg-slate-800 rounded-xl p-3.5 border border-slate-50 dark:border-slate-700 mb-2">
                <View className="flex-row items-start gap-2">
                  <View className="w-6 h-6 rounded-full bg-primary/10 items-center justify-center mt-0.5 shrink-0">
                    <MaterialIcons name="format-quote" size={12} color="#359EFF" />
                  </View>
                  <Text className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">{review}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
