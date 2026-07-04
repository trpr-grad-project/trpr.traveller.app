import React, { useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";
import { useAuth } from "@/context/AuthContext";
import { useTripDetails } from "@/hooks/useTripDetails";
import { useJoinTrip } from "@/hooks/useJoinTrip";
import { resolveImageUrl } from "@/utils/constants";
import type { TripResponse } from "@/types";

function getTripLocation(trip: TripResponse): string {
  const governorate = trip.segments?.[0]?.places?.[0]?.governorate?.name ?? "";
  return governorate ? `${governorate}, Egypt` : "";
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

export default function PlanByUserScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const { data: trip, isLoading, isError, refetch } = useTripDetails(id ?? "");
  const joinMutation = useJoinTrip();
  const [joinRequested, setJoinRequested] = useState(false);

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (isError || !trip) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Failed to load trip details.
        </Text>
        <Pressable onPress={() => refetch()} className="mt-6 bg-primary rounded-xl py-3 px-8">
          {({ pressed }) => (
            <Text className="text-white font-bold text-sm" style={{ opacity: pressed ? 0.7 : 1 }}>
              Retry
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  const location = getTripLocation(trip);
  const creator = trip.createdByUser;
  const creatorInitials = getInitials(creator?.firstName, creator?.lastName);
  const participantsCount = trip.approvedParticipants?.length ?? 0;
  const spotsLeft = trip.maxParticipantsCount - participantsCount;

  const isCreator = user?.id === creator?.id;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isStartDay = trip.startDate === todayStr;
  const isApproved = trip.approvedParticipants?.some((p) => p.id === user?.id) ?? false;
  const isPending = trip.pendingParticipants?.some((p) => p.id === user?.id) ?? false;

  let buttonTitle: string;
  let buttonDisabled: boolean;
  if (isCreator) {
    buttonTitle = "Start Trip";
    buttonDisabled = !isStartDay;
  } else if (isApproved || (joinRequested && trip.autoApprove)) {
    buttonTitle = "Joined";
    buttonDisabled = true;
  } else if (isPending || joinRequested) {
    buttonTitle = "Waiting for acceptance";
    buttonDisabled = true;
  } else {
    buttonTitle = trip.autoApprove ? "Join Trip" : "Request to Join";
    buttonDisabled = false;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative" style={{ aspectRatio: 4 / 3 }}>
          <Image
            source={{ uri: resolveImageUrl(trip.imagesUrls?.[0] ?? "") }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4" style={{ paddingTop: insets.top + 16 }}>
            <BackButton iconSize={18} iconName="arrow-back-ios-new" className="w-10 h-10 bg-white/20" />
          </View>
          <View className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-emerald-600/90 backdrop-blur">
            <Text className="text-[10px] font-bold text-white tracking-wider uppercase">Shared</Text>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background-light dark:bg-background-dark pt-6 px-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">{trip.title}</Text>
              {location && (
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{location} • {trip.tripTime || "N/A"}</Text>
              )}
              {!location && trip.tripTime && (
                <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">{trip.tripTime}</Text>
              )}
            </View>
            <Text className="text-2xl font-bold text-primary">
              {trip.price === 0 ? "Free" : `$${trip.price}`}
            </Text>
          </View>

          <View className="flex-row items-center gap-3 mb-6">
            {trip.theme && (
              <View className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
                <Text className="text-[10px] font-bold text-primary tracking-wide uppercase">{trip.theme}</Text>
              </View>
            )}
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="group" size={14} color="#94a3b8" />
              <Text className="text-xs text-slate-400">{participantsCount}/{trip.maxParticipantsCount} joined</Text>
            </View>
          </View>

          {creator && (
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-lg font-bold text-primary">{creatorInitials}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-[#0c141d] dark:text-white">
                    {creator.firstName} {creator.lastName}
                  </Text>
                  {creator.rating && (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <MaterialIcons name="star" size={14} color="#eab308" />
                      <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">{creator.rating.toFixed(1)}</Text>
                    </View>
                  )}
                </View>
                <Pressable className="px-4 py-2 rounded-lg border border-primary/30">
                  <Text className="text-xs font-bold text-primary">View Profile</Text>
                </Pressable>
              </View>
            </View>
          )}

          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">About this trip</Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {trip.description || "No description available."}
            </Text>
          </View>

          {trip.segments && trip.segments.length > 0 && (
            <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden mb-6">
              <Text className="text-base font-bold text-[#0c141d] dark:text-white p-5 pb-3">Itinerary</Text>
              {trip.segments.map((segment) => {
                const isExpanded = expandedDay === segment.day;
                const places = segment.places ?? [];
                return (
                  <View key={segment.day}>
                    <Pressable
                      onPress={() => setExpandedDay(isExpanded ? null : segment.day)}
                      className="flex-row items-center justify-between p-4 border-t border-slate-50 dark:border-slate-700"
                    >
                      <View className="flex-row items-center gap-3">
                        <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                          <Text className="text-white font-bold">{segment.day}</Text>
                        </View>
                        <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
                          {places[0]?.title ?? `Day ${segment.day}`}
                        </Text>
                      </View>
                      <MaterialIcons
                        name={isExpanded ? "expand-less" : "expand-more"}
                        size={20}
                        color="#94a3b8"
                      />
                    </Pressable>
                    {isExpanded && places.length > 0 && (
                      <View className="px-5 pb-4 gap-3 border-t border-slate-50 dark:border-slate-700 pt-3">
                        {places.map((place, i) => (
                          <View key={place.id} className="flex-row gap-3">
                            <View className="items-center">
                              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                                <Text className="text-xs font-bold text-primary">{i + 1}</Text>
                              </View>
                              {i < places.length - 1 && <View className="flex-1 w-px bg-primary/20 my-1" />}
                            </View>
                            <View className="flex-1 pb-3">
                              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{place.title}</Text>
                              {place.description && (
                                <Text className="text-xs text-slate-500 dark:text-slate-400 mt-0.5" numberOfLines={2}>
                                  {place.description}
                                </Text>
                              )}
                            </View>
                          </View>
                        ))}
                      </View>
                    )}
                    {isExpanded && places.length === 0 && (
                      <View className="px-4 pb-4 pt-3 border-t border-slate-50 dark:border-slate-700">
                        <Text className="text-sm text-slate-400 italic">No details available for this day.</Text>
                      </View>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          <View className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-6">
            <View className="flex-row items-start gap-3">
              <MaterialIcons name="info" size={20} color="#d97706" />
              <Text className="text-xs text-amber-800 dark:text-amber-200 flex-1 leading-relaxed">
                This trip was created by a community member. Availability and details may change. Contact the organizer before joining.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">
              {trip.price === 0 ? "Free" : `$${trip.price}`}
            </Text>
            {!isCreator && (
              <Text className="text-xs text-slate-400">
                {spotsLeft > 0 ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left` : "Fully booked"}
              </Text>
            )}
          </View>
          {!isCreator && trip.autoApprove && (
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="bolt" size={16} color="#22c55e" />
              <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">Instant booking</Text>
            </View>
          )}
        </View>
        <PrimaryButton
          title={buttonTitle}
          disabled={buttonDisabled}
          isLoading={joinMutation.isPending}
          onPress={async () => {
            if (!isCreator && !isApproved && !isPending) {
              setJoinRequested(true);
              try {
                await joinMutation.mutateAsync(id);
              } catch {
                setJoinRequested(false);
              }
            }
          }}
        />
      </View>
    </View>
  );
}
