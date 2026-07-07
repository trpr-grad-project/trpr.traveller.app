import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import { Image } from "expo-image";
import { createConversationRepository } from "@/database/repositories/conversationRepositoryImpl";
import { tripService } from "@/services/trips";
import { resolveImageUrl } from "@/utils/constants";
import type { TripCreatorUser } from "@/types/trip-creation";

const AVATAR_COLORS = ["#359EFF", "#FF6B6B", "#4CAF50", "#FF9800", "#9C27B0", "#00BCD4", "#F44336", "#3F51B5"];

function avatarColor(id: string): string {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

export default function GroupChatSettingsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [tripTitle, setTripTitle] = useState<string | null>(null);
  const [tripImageUrl, setTripImageUrl] = useState<string | null>(null);
  const [members, setMembers] = useState<TripCreatorUser[]>([]);

  const fetchData = useCallback(async () => {
    if (!id) return;
    try {
      const convRepo = createConversationRepository();
      const conv = await convRepo.findConversation(id);
      const tripId = conv?.tripId;

      if (tripId) {
        const trip = await tripService.getTripById(tripId);
        setTripTitle(trip.title);
        setTripImageUrl(trip.imagesUrls?.[0] ?? null);
        setMembers(trip.approvedParticipants ?? []);
      } else {
        setTripTitle(conv?.title ?? "Group Chat");
        setTripImageUrl(conv?.imageUrl ?? null);
        setMembers([]);
      }
    } catch (error) {
      console.error("[GroupChatSettings] Failed to load", error);
    }
  }, [id]);

  useEffect(() => {
    fetchData().finally(() => setLoading(false));
  }, [fetchData]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-background-light/90 dark:bg-background-dark/90 px-4 py-4 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#359EFF" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor="#359EFF" />
          }
        >
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 items-center gap-4">
            {tripImageUrl ? (
              <View className="w-20 h-20 rounded-2xl overflow-hidden">
                <Image
                  source={{ uri: resolveImageUrl(tripImageUrl) }}
                  className="w-full h-full"
                  contentFit="cover"
                />
              </View>
            ) : (
              <View
                className="w-20 h-20 rounded-2xl items-center justify-center"
                style={{ backgroundColor: avatarColor(id ?? "") }}
              >
                <Text className="text-white text-2xl font-bold">{tripTitle?.charAt(0).toUpperCase() ?? "?"}</Text>
              </View>
            )}
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white text-center">
              {tripTitle ? `${tripTitle} Trip Chat` : "Trip Chat"}
            </Text>
          </View>

          {members.length > 0 && (
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white mb-4">
                Members ({members.length})
              </Text>
              <View className="gap-3">
                {members.map((member) => {
                  const name = `${member.firstName} ${member.lastName}`.trim();
                  return (
                    <View key={member.id} className="flex-row items-center gap-3">
                      <View
                        className="w-10 h-10 rounded-full items-center justify-center"
                        style={{ backgroundColor: avatarColor(member.id) }}
                      >
                        <Text className="text-white text-xs font-bold">{getInitials(member.firstName, member.lastName)}</Text>
                      </View>
                      <Text className="text-sm font-medium text-[#0c141d] dark:text-white flex-1">
                        {name || member.userName || `User #${member.id.slice(-4)}`}
                      </Text>
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {members.length === 0 && !loading && (
            <View className="items-center py-8">
              <MaterialIcons name="people-outline" size={48} color="#94a3b8" />
              <Text className="text-sm text-slate-400 mt-2">No member data available</Text>
            </View>
          )}
        </ScrollView>
      )}
    </View>
  );
}
