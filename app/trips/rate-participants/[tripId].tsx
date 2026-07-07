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
import { useLocalSearchParams, router } from "expo-router";
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useQueryClient } from "@tanstack/react-query";

import BackButton from "@/components/BackButton";
import RatingModal from "@/components/RatingModal";
import { useAuth } from "@/context/AuthContext";
import { useTripDetails } from "@/hooks/useTripDetails";
import { reviewService } from "@/services/reviews";

const AVATAR_COLORS = [
  "#359EFF", "#22c55e", "#eab308", "#ef4444",
  "#a855f7", "#ec4899", "#f97316", "#06b6d4",
];

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

function storageKey(userId: string, tripId: string): string {
  return `rated-${userId}-${tripId}`;
}

export default function RateParticipantsScreen() {
  const insets = useSafeAreaInsets();
  const { tripId } = useLocalSearchParams<{ tripId: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: trip, isLoading } = useTripDetails(tripId ?? "");

  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());
  const [ratedLoaded, setRatedLoaded] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState<{
    id: string;
    name: string;
  } | null>(null);

  useEffect(() => {
    if (!user?.id || !tripId || ratedLoaded) return;
    AsyncStorage.getItem(storageKey(user.id, tripId))
      .then((stored) => {
        if (stored) {
          const ids: string[] = JSON.parse(stored);
          setRatedIds(new Set(ids));
        }
        setRatedLoaded(true);
      })
      .catch(() => setRatedLoaded(true));
  }, [user?.id, tripId, ratedLoaded]);

  const persistRatedIds = useCallback(
    async (ids: Set<string>) => {
      if (!user?.id || !tripId) return;
      await AsyncStorage.setItem(
        storageKey(user.id, tripId),
        JSON.stringify([...ids]),
      );
    },
    [user?.id, tripId],
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (!trip) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Failed to load trip details.
        </Text>
        <Pressable onPress={() => router.back()} className="mt-6 bg-primary rounded-xl py-3 px-8">
          <Text className="text-white font-bold text-sm">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const participants = (trip.approvedParticipants ?? []).filter(
    (p) => p.id !== user?.id,
  );

  const handleOpenModal = (id: string, name: string) => {
    setSelectedParticipant({ id, name });
    setModalVisible(true);
  };

  const handleSubmitReview = async (rating: number, review: string) => {
    if (!selectedParticipant || !tripId) return;

    await reviewService.createReview(tripId, {
      tripId,
      revieweeId: selectedParticipant.id,
      rating,
      review,
    });

    const updated = new Set(ratedIds).add(selectedParticipant.id);
    setRatedIds(updated);
    await persistRatedIds(updated);

    setModalVisible(false);
    setSelectedParticipant(null);

    queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
    queryClient.invalidateQueries({ queryKey: ["my-trips"] });

    Toast.show({
      type: "success",
      text1: "Review submitted",
      text2: `You rated ${selectedParticipant.name}`,
    });
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="flex-row items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <BackButton iconSize={22} iconName="arrow-back" />
        <View className="flex-1">
          <Text className="text-lg font-bold text-[#0c141d] dark:text-white">
            Rate Participants
          </Text>
          <Text className="text-xs text-slate-400">
            {trip.title}
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-4 pt-4"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {participants.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialIcons name="people-outline" size={48} color="#94a3b8" />
            <Text className="text-base font-semibold text-slate-400 mt-4 text-center">
              No participants to rate
            </Text>
          </View>
        ) : (
          <View className="gap-3">
            {participants.map((p, idx) => {
              const isRated = ratedIds.has(p.id);
              return (
                <View
                  key={p.id}
                  className="flex-row items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-50 dark:border-slate-700"
                >
                  <View
                    className="w-12 h-12 rounded-full items-center justify-center"
                    style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                  >
                    <Text className="text-sm font-bold text-white">
                      {getInitials(p.firstName, p.lastName)}
                    </Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
                      {p.firstName} {p.lastName}
                    </Text>
                    {p.rating != null && (
                      <View className="flex-row items-center gap-1 mt-0.5">
                        <MaterialIcons name="star" size={14} color="#eab308" />
                        <Text className="text-xs text-slate-500 dark:text-slate-400">
                          {p.rating.toFixed(1)}
                        </Text>
                      </View>
                    )}
                  </View>
                  {isRated ? (
                    <View className="h-9 px-4 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 items-center justify-center">
                      <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        Rated
                      </Text>
                    </View>
                  ) : (
                    <Pressable
                      onPress={() =>
                        handleOpenModal(p.id, `${p.firstName} ${p.lastName}`)
                      }
                      className="h-9 px-5 rounded-lg bg-primary items-center justify-center active:opacity-80"
                    >
                      <Text className="text-xs font-bold text-white">
                        Rate
                      </Text>
                    </Pressable>
                  )}
                </View>
              );
            })}
          </View>
        )}
      </ScrollView>

      {selectedParticipant && (
        <RatingModal
          visible={modalVisible}
          participantName={selectedParticipant.name}
          onClose={() => {
            setModalVisible(false);
            setSelectedParticipant(null);
          }}
          onSubmit={handleSubmitReview}
        />
      )}
    </View>
  );
}
