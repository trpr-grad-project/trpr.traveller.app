import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { router, useLocalSearchParams } from "expo-router";
import { profileService } from "@/services/profile";
import BackButton from "@/components/BackButton";
import type { ProfileMyProfileResponse } from "@/types";

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

const AVATAR_COLORS = [
  "#359EFF", "#22c55e", "#eab308", "#ef4444",
  "#a855f7", "#ec4899", "#f97316", "#06b6d4",
];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

export default function UserProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [profile, setProfile] = useState<ProfileMyProfileResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchProfile = useCallback(() => {
    if (!id) return;
    setLoading(true);
    setError(false);
    profileService.getProfileById(id)
      .then(setProfile)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  if (loading) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (error || !profile) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Failed to load profile.
        </Text>
        <Pressable
          onPress={fetchProfile}
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

  const { profile: pd } = profile;
  const initials = getInitials(profile.firstName, profile.lastName);
  const color = avatarColor(profile.id);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-neutral-dark">
        <View className="w-10 h-10 items-center justify-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
        <Text className="text-lg font-bold text-main-light dark:text-white">Profile</Text>
        <View className="w-10" />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Avatar + Name */}
        <View className="items-center pt-8 pb-6 px-4">
          {pd.avatarUrl ? (
            <View className="w-24 h-24 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg mb-4">
              <Image source={{ uri: pd.avatarUrl }} className="w-full h-full" resizeMode="cover" />
            </View>
          ) : (
            <View className="w-24 h-24 rounded-full items-center justify-center border-4 border-white dark:border-neutral-dark shadow-lg mb-4" style={{ backgroundColor: color }}>
              <Text className="text-3xl font-bold text-white">{initials}</Text>
            </View>
          )}

          <View className="flex-row items-center gap-1.5 max-w-full">
            <Text className="text-xl font-bold text-[#0c141d] dark:text-white flex-shrink" numberOfLines={1}>
              {profile.firstName} {profile.lastName}
            </Text>
            {profile.isVerified && (
              <MaterialIcons name="verified" size={18} color="#22c55e" />
            )}
          </View>

          {/* Rating */}
          <View className="flex-row items-center gap-1 mt-2">
            <MaterialIcons name="star" size={16} color="#eab308" />
            <Text className="text-sm font-bold text-slate-600 dark:text-slate-400">
              {pd.rating ? pd.rating.toFixed(1) : "—"}
            </Text>
          </View>
        </View>

        {/* Bio */}
        {pd.bio ? (
          <View className="mx-4 mb-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-50 dark:border-slate-700">
            <Text className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Bio</Text>
            <Text className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{pd.bio}</Text>
          </View>
        ) : null}

        {/* Languages */}
        {pd.languages.length > 0 && (
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
        {pd.interests.length > 0 && (
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
        {pd.vibes.length > 0 && (
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

        {/* Reputations */}
        {pd.reviews?.length > 0 && (
          <View className="mx-4 mb-4">
            <View className="flex-row items-center justify-between mb-2 px-1">
              <Text className="text-xs font-bold text-slate-400 uppercase tracking-wider">Reputations</Text>
              <Pressable onPress={() => router.push(`/trips/user/${profile.id}/reviews`)}>
                <Text className="text-xs font-semibold text-primary">Show all</Text>
              </Pressable>
            </View>
            {(pd.reviews ?? []).slice(0, 3).map((review, index) => (
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
