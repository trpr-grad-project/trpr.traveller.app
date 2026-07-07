import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { useLocalSearchParams } from "expo-router";
import { profileService } from "@/services/profile";
import BackButton from "@/components/BackButton";
import type { ProfileMyProfileResponse } from "@/types";

export default function UserReviewsScreen() {
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
          Failed to load reviews.
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
  const reviews = pd.reviews ?? [];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-neutral-dark">
        <View className="w-10 h-10 items-center justify-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
        <Text className="text-lg font-bold text-main-light dark:text-white">Reviews</Text>
        <Text className="text-xs text-slate-400 w-10 text-right">{reviews.length}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {reviews.length === 0 ? (
          <View className="items-center py-16">
            <MaterialIcons name="rate-review" size={48} color="#94a3b8" />
            <Text className="text-sm text-slate-400 dark:text-slate-500 mt-3 text-center">
              No reviews yet.
            </Text>
          </View>
        ) : (
          <View className="gap-2">
            {reviews.map((review, index) => (
              <View
                key={index}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-50 dark:border-slate-700"
              >
                <View className="flex-row items-start gap-3">
                  <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mt-0.5 shrink-0">
                    <MaterialIcons name="format-quote" size={14} color="#359EFF" />
                  </View>
                  <Text className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed flex-1">
                    {review}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
