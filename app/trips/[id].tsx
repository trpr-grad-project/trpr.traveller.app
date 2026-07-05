import React, { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, router } from "expo-router";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useTripDetails } from "@/hooks/useTripDetails";
import { useJoinTrip } from "@/hooks/useJoinTrip";
import { useStartTrip } from "@/hooks/useStartTrip";
import { useEndTrip } from "@/hooks/useEndTrip";
import { useRespondToParticipant } from "@/hooks/useRespondToParticipant";
import { STATUS_TO_LABEL, STATUS_COLORS } from "@/utils/tripSegments";
import { resolveImageUrl } from "@/utils/constants";
import type { TripResponse } from "@/types";

function getTripLocation(trip: TripResponse): string {
  const governorate =
    trip.segments?.[0]?.places?.[0]?.governorate?.name ?? "";
  return governorate ? `${governorate}, Egypt` : "";
}

function formatDate(dateStr: string): string {
  if (!dateStr) return "";
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
}

function getInitials(firstName?: string, lastName?: string): string {
  return `${firstName?.charAt(0) ?? ""}${lastName?.charAt(0) ?? ""}`.toUpperCase() || "?";
}

function formatVisitTime(minutes: number | null): string {
  if (!minutes) return "";
  return minutes >= 60
    ? `${Math.round(minutes / 60)}h`
    : `${minutes}m`;
}

const AVATAR_COLORS = [
  "#359EFF", "#22c55e", "#eab308", "#ef4444",
  "#a855f7", "#ec4899", "#f97316", "#06b6d4",
];

export default function TripDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const { data: trip, isLoading, isError, refetch } = useTripDetails(id ?? "");
  const { user } = useAuth();
  const joinMutation = useJoinTrip();
  const startTripMutation = useStartTrip();
  const endTripMutation = useEndTrip();
  const respondMutation = useRespondToParticipant();
  const [joinRequested, setJoinRequested] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(1);
  const [expandedDesc, setExpandedDesc] = useState(false);

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
        <Pressable
          onPress={() => refetch()}
          className="mt-6 bg-primary rounded-xl py-3 px-8"
        >
          {({ pressed }) => (
            <Text className="text-white font-bold text-sm" style={{ opacity: pressed ? 0.7 : 1 }}>
              Retry
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  const label = STATUS_TO_LABEL[trip.status] ?? trip.status;
  const statusColor = STATUS_COLORS[label];
  const location = getTripLocation(trip);
  const theme = trip.theme;
  const creator = trip.createdByUser;
  const participantsCount = trip.approvedParticipants?.length ?? 0;
  const spotsLeft = trip.maxParticipantsCount - participantsCount;
  const creatorInitials = getInitials(creator?.firstName, creator?.lastName);

  const isCreator = user?.id === trip.createdByUser?.id;
  const todayStr = new Date().toISOString().slice(0, 10);
  const isStartDay = trip.startDate === todayStr;
  const isApproved = trip.approvedParticipants?.some((p) => p.id === user?.id) ?? false;
  const isPending = trip.pendingParticipants?.some((p) => p.id === user?.id) ?? false;
  const tripDays = parseInt(trip.tripTime, 10) || 1;
  const endDateObj = new Date(trip.startDate);
  endDateObj.setDate(endDateObj.getDate() + tripDays - 1);
  const endDateStr = endDateObj.toISOString().slice(0, 10);
  const isEndDay = todayStr >= endDateStr;
  const isStarted = trip.status === "Started";
  const isFinished = trip.status === "Finished";

  let buttonTitle: string;
  let buttonDisabled: boolean;
  if (isFinished) {
    buttonTitle = "Completed";
    buttonDisabled = true;
  } else if (isStarted) {
    if (isCreator) {
      buttonTitle = "End Trip";
      buttonDisabled = !isEndDay;
    } else if (isApproved || (joinRequested && trip.autoApprove)) {
      buttonTitle = "In Progress";
      buttonDisabled = true;
    } else if (isPending || joinRequested) {
      buttonTitle = "Waiting for acceptance";
      buttonDisabled = true;
    } else {
      buttonTitle = "In Progress";
      buttonDisabled = true;
    }
  } else if (isCreator) {
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

  const quickStats = [
    {
      icon: "calendar-today" as const,
      label: "Start",
      value: formatDate(trip.startDate),
    },
    {
      icon: "schedule" as const,
      label: "Duration",
      value: trip.tripTime || "N/A",
    },
    {
      icon: "people" as const,
      label: "Group",
      value: `${participantsCount}/${trip.maxParticipantsCount}`,
    },
    {
      icon: "star" as const,
      label: "Rating",
      value: creator?.rating ? creator.rating.toFixed(1) : "—",
    },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={async () => {
              setRefreshing(true);
              await refetch();
              setRefreshing(false);
            }}
          />
        }
      >
        {/* Hero */}
        <View className="relative w-full aspect-[4/3]">
          <Image
            source={{ uri: resolveImageUrl(trip.imagesUrls?.[0] ?? "") }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />

          {/* Top controls */}
          <View
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4"
            style={{ paddingTop: insets.top + 12 }}
          >
            <View className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
              <BackButton iconSize={18} iconName="chevron-left" className="!min-w-0 !min-h-0 w-10 h-10" />
            </View>
            <View className="flex-row gap-2">
              <Pressable className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                {({ pressed }) => (
                  <MaterialIcons
                    name="share"
                    size={20}
                    color="white"
                    style={{ opacity: pressed ? 0.6 : 1 }}
                  />
                )}
              </Pressable>
              <Pressable className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md items-center justify-center">
                {({ pressed }) => (
                  <MaterialIcons
                    name="favorite-border"
                    size={20}
                    color="white"
                    style={{ opacity: pressed ? 0.6 : 1 }}
                  />
                )}
              </Pressable>
            </View>
          </View>

          {/* Bottom badges */}
          <View className="absolute bottom-8 left-4 right-4 flex-row items-center gap-2">
            <View
              className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg"
              style={{ backgroundColor: statusColor?.bg ?? "#359EFF" }}
            >
              <MaterialIcons name="verified" size={14} color="white" />
              <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                {label}
              </Text>
            </View>
            {theme && (
              <View className="px-3 py-1.5 rounded-full bg-white/20 backdrop-blur-md border border-white/30">
                <Text className="text-[10px] font-bold text-white uppercase tracking-wider">
                  {theme}
                </Text>
              </View>
            )}
          </View>
        </View>

        {/* Content */}
        <View className="-mt-4 bg-background-light dark:bg-background-dark pt-6 px-4">
          {/* Title + Price */}
          <View className="flex-row justify-between items-start mb-1">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-[#0c141d] dark:text-white leading-tight">
                {trip.title}
              </Text>
              {location && (
                <View className="flex-row items-center gap-1.5 mt-1.5">
                  <MaterialIcons name="location-on" size={16} color="#94a3b8" />
                  <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
                    {location}
                  </Text>
                </View>
              )}
            </View>
            <Text className="text-2xl font-bold text-primary">
              {trip.price === 0 ? "Free" : `$${trip.price}`}
            </Text>
          </View>

          {/* Meta row */}
          <View className="flex-row items-center gap-2 mt-1 mb-5">
            {trip.tripTime && (
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="schedule" size={14} color="#94a3b8" />
                <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">
                  {trip.tripTime}
                </Text>
              </View>
            )}
            {trip.startDate && (
              <>
                <View className="w-1 h-1 rounded-full bg-slate-300" />
                <View className="flex-row items-center gap-1">
                  <MaterialIcons name="calendar-today" size={13} color="#94a3b8" />
                  <Text className="text-xs font-medium text-slate-500 dark:text-slate-400">
                    {formatDate(trip.startDate)}
                  </Text>
                </View>
              </>
            )}
          </View>

          {/* Quick Stats */}
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <View className="flex-row justify-between">
              {quickStats.map((stat) => (
                <View key={stat.label} className="items-center flex-1">
                  <MaterialIcons name={stat.icon} size={20} color="#359EFF" />
                  <Text className="text-xs font-bold text-[#0c141d] dark:text-white mt-1.5">
                    {stat.value}
                  </Text>
                  <Text className="text-[10px] font-medium text-slate-400 dark:text-slate-500 mt-0.5">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Host Card */}
          {creator && (
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
              <View className="flex-row items-center gap-4">
                <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
                  <Text className="text-lg font-bold text-primary">
                    {creatorInitials}
                  </Text>
                </View>
                <View className="flex-1">
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-base font-bold text-[#0c141d] dark:text-white">
                      {creator.firstName} {creator.lastName}
                    </Text>
                    <MaterialIcons name="verified" size={16} color="#22c55e" />
                  </View>
                  {creator.rating && (
                    <View className="flex-row items-center gap-1 mt-0.5">
                      <MaterialIcons name="star" size={14} color="#eab308" />
                      <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">
                        {creator.rating.toFixed(1)}
                      </Text>
                    </View>
                  )}
                  <Text className="text-xs text-slate-400 mt-0.5">
                    @{creator.userName}
                  </Text>
                </View>
                <Pressable
                  onPress={() => router.push(`/trips/user/${creator.id}`)}
                  className="px-4 py-2 rounded-lg border border-primary/30"
                >
                  {({ pressed }) => (
                    <Text
                      className="text-xs font-bold text-primary"
                      style={{ opacity: pressed ? 0.6 : 1 }}
                    >
                      View Profile
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          )}

          {/* About */}
          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">
              About this trip
            </Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              {trip.description
                ? trip.description.length > 120 && !expandedDesc
                  ? trip.description.slice(0, 120).trimEnd() + "... "
                  : trip.description
                : "No description available."}
              {trip.description && trip.description.length > 120 && (
                <Text
                  className="text-primary font-bold"
                  onPress={() => setExpandedDesc(!expandedDesc)}
                >
                  {expandedDesc ? "Show less" : "Read more"}
                </Text>
              )}
            </Text>
          </View>

          {/* Participants */}
          {trip.maxParticipantsCount > 0 && (
            <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white">
                  Participants
                </Text>
                <Text className="text-xs font-bold text-primary">
                  {participantsCount}/{trip.maxParticipantsCount}
                </Text>
              </View>

              {trip.approvedParticipants && trip.approvedParticipants.length > 0 && (
                <View className="flex-row items-center mb-3">
                  {trip.approvedParticipants.slice(0, 6).map((p, idx) => (
                    <View
                      key={p.id}
                      className="w-9 h-9 rounded-full items-center justify-center -ml-1.5 first:ml-0 border-2 border-white dark:border-slate-800"
                      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length], zIndex: 6 - idx }}
                    >
                      <Text className="text-[10px] font-bold text-white">
                        {getInitials(p.firstName, p.lastName)}
                      </Text>
                    </View>
                  ))}
                  {participantsCount > 6 && (
                    <View className="w-9 h-9 rounded-full items-center justify-center -ml-1.5 border-2 border-white dark:border-slate-800 bg-slate-100 dark:bg-slate-700">
                      <Text className="text-[10px] font-bold text-slate-500 dark:text-slate-300">
                        +{participantsCount - 6}
                      </Text>
                    </View>
                  )}
                </View>
              )}

              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  {spotsLeft > 0 ? (
                    <>
                      <MaterialIcons name="people-alt" size={16} color="#22c55e" />
                      <Text className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                        {spotsLeft} spot{spotsLeft !== 1 ? "s" : ""} left
                      </Text>
                    </>
                  ) : (
                    <>
                      <MaterialIcons name="group-off" size={16} color="#ef4444" />
                      <Text className="text-xs font-bold text-red-500">
                        Fully booked
                      </Text>
                    </>
                  )}
                </View>
                {trip.autoApprove && (
                  <View className="flex-row items-center gap-1">
                    <MaterialIcons name="check-circle" size={14} color="#22c55e" />
                    <Text className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                      Auto-approve
                    </Text>
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Pending requests (creator only) */}
          {isCreator && trip.pendingParticipants && trip.pendingParticipants.length > 0 && (
            <View className="mb-6">
              <View className="flex-row items-center justify-between mb-4">
                <Text className="text-lg font-bold text-[#0c141d] dark:text-white">
                  Pending Requests
                </Text>
                <Text className="text-xs font-bold text-primary">
                  {trip.pendingParticipants.length} request{trip.pendingParticipants.length !== 1 ? "s" : ""}
                </Text>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerClassName="gap-3">
                {trip.pendingParticipants.map((p, idx) => (
                  <View
                    key={p.id}
                    className="bg-white dark:bg-slate-800 rounded-2xl p-4 border border-slate-50 dark:border-slate-700 shadow-sm w-44"
                  >
                    <View
                      className="w-12 h-12 rounded-full items-center justify-center mb-3"
                      style={{ backgroundColor: AVATAR_COLORS[idx % AVATAR_COLORS.length] }}
                    >
                      <Text className="text-sm font-bold text-white">
                        {getInitials(p.firstName, p.lastName)}
                      </Text>
                    </View>
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white mb-1" numberOfLines={1}>
                      {p.firstName} {p.lastName}
                    </Text>
                    <Text className="text-[11px] text-slate-400 mb-4" numberOfLines={1}>
                      @{p.userName}
                    </Text>
                    <View className="flex-row gap-2">
                      <Pressable
                        className="flex-1 h-9 rounded-lg bg-emerald-500 items-center justify-center"
                        onPress={() =>
                          respondMutation.mutate({
                            tripId: trip.id,
                            participantId: p.id,
                            action: "accept",
                          })
                        }
                      >
                        <MaterialIcons name="check" size={18} color="white" />
                      </Pressable>
                      <Pressable
                        className="flex-1 h-9 rounded-lg bg-red-500 items-center justify-center"
                        onPress={() =>
                          respondMutation.mutate({
                            tripId: trip.id,
                            participantId: p.id,
                            action: "reject",
                          })
                        }
                      >
                        <MaterialIcons name="close" size={18} color="white" />
                      </Pressable>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>
          )}

          {/* Itinerary */}
          {trip.segments && trip.segments.length > 0 && (
            <View className="mb-6">
              <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-4">
                Itinerary
              </Text>
              <View className="gap-3">
                {trip.segments.map((segment) => {
                  const isExpanded = expandedDay === segment.day;
                  const places = segment.places ?? [];
                  const placesCount = places.length;
                  return (
                    <View
                      key={segment.day}
                      className="rounded-2xl bg-white dark:bg-slate-800 border border-slate-50 dark:border-slate-700 shadow-sm overflow-hidden"
                    >
                      <Pressable
                        onPress={() => setExpandedDay(isExpanded ? null : segment.day)}
                      >
                        {({ pressed }) => (
                          <View
                            className="flex-row items-center justify-between p-4"
                            style={{ opacity: pressed ? 0.7 : 1 }}
                          >
                            <View className="flex-row items-center gap-4">
                              <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                                <Text className="text-white font-bold">{segment.day}</Text>
                              </View>
                              <View>
                                <Text className="text-xs font-bold text-slate-400 uppercase">
                                  Day {segment.day}
                                </Text>
                                <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
                                  {places[0]?.title ?? "Explore"}
                                </Text>
                                <Text className="text-[11px] text-slate-400 mt-0.5">
                                  {placesCount} stop{placesCount !== 1 ? "s" : ""}
                                  {segment.duration ? ` · ${formatVisitTime(segment.duration)}` : ""}
                                </Text>
                              </View>
                            </View>
                            <MaterialIcons
                              name={isExpanded ? "expand-less" : "expand-more"}
                              size={20}
                              color={isExpanded ? "#359EFF" : "#94A3B8"}
                            />
                          </View>
                        )}
                      </Pressable>

                      {isExpanded && places.length > 0 && (
                        <>
                        <Pressable
                          onPress={() => router.push(`/trips/day-map?tripId=${trip.id}&day=${segment.day}`)}
                          className="relative aspect-[21/9] rounded-xl overflow-hidden mx-4"
                        >
                          <Image
                            source={{ uri: resolveImageUrl(trip.imagesUrls?.[0] ?? "") }}
                            className="absolute inset-0 w-full h-full"
                            resizeMode="cover"
                          />
                          <View className="absolute inset-0 bg-black/30 items-center justify-center">
                            <View className="bg-white/90 dark:bg-slate-800/90 px-5 py-2 rounded-full flex-row items-center gap-2 shadow-lg">
                              <MaterialIcons name="map" size={16} color="#359EFF" />
                              <Text className="text-xs font-bold text-slate-900 dark:text-white">View Map</Text>
                            </View>
                          </View>
                        </Pressable>
                        <View className="px-4 pb-4 pt-3 border-t border-slate-50 dark:border-slate-700">
                          {places.map((place, idx) => (
                            <View key={place.id} className="flex-row gap-3">
                              {/* Timeline column */}
                              <View className="items-center">
                                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                                  <Text className="text-xs font-bold text-primary">
                                    {idx + 1}
                                  </Text>
                                </View>
                                {idx < places.length - 1 && (
                                  <View className="flex-1 w-px bg-primary/20 my-1" style={{ minHeight: 24 }} />
                                )}
                              </View>

                              {/* Place content */}
                              <View className="flex-1 pb-4">
                                <View className="flex-row justify-between items-start">
                                  <View className="flex-1 mr-2">
                                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
                                      {place.title}
                                    </Text>
                                    {place.description && (
                                      <Text
                                        className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 leading-relaxed"
                                        numberOfLines={2}
                                      >
                                        {place.description}
                                      </Text>
                                    )}
                                  </View>
                                  {place.averageVisitTime && (
                                    <View className="px-2 py-0.5 rounded-md bg-primary/10">
                                      <Text className="text-[10px] font-bold text-primary">
                                        {formatVisitTime(place.averageVisitTime)}
                                      </Text>
                                    </View>
                                  )}
                                </View>

                                <View className="flex-row items-center gap-2 mt-1.5 flex-wrap">
                                  {place.governorate?.name && (
                                    <View className="flex-row items-center gap-1">
                                      <MaterialIcons name="location-on" size={12} color="#94a3b8" />
                                      <Text className="text-[11px] text-slate-400">
                                        {place.governorate.name}
                                      </Text>
                                    </View>
                                  )}
                                  {place.category?.name && (
                                    <>
                                      <View className="w-1 h-1 rounded-full bg-slate-300" />
                                      <View className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-700">
                                        <Text className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                                          {place.category.name}
                                        </Text>
                                      </View>
                                    </>
                                  )}
                                  {place.tags && place.tags.length > 0 && (
                                    <>
                                      <View className="w-1 h-1 rounded-full bg-slate-300" />
                                      <Text className="text-[11px] text-slate-400">
                                        {place.tags.slice(0, 2).map((t) => t.name).join(", ")}
                                      </Text>
                                    </>
                                  )}
                                </View>
                              </View>
                            </View>
                          ))}
                        </View>
                        </>
                      )}

                      {isExpanded && places.length === 0 && (
                        <View className="px-4 pb-4 pt-3 border-t border-slate-50 dark:border-slate-700">
                          <Text className="text-sm text-slate-400 italic">
                            No details available for this day.
                          </Text>
                        </View>
                      )}
                    </View>
                  );
                })}
              </View>
            </View>
          )}

          {/* Bottom spacing */}
          <View className="h-8" />
        </View>
      </ScrollView>

      {/* Sticky CTA */}
      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View>
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">
              {trip.price === 0 ? "Free" : `$${trip.price}`}
            </Text>
            {!isCreator && (
              <Text className="text-xs text-slate-400">
                {spotsLeft > 0
                  ? `${spotsLeft} spot${spotsLeft !== 1 ? "s" : ""} left`
                  : "Fully booked"}
              </Text>
            )}
          </View>
          {!isCreator && (
            <View className="flex-row items-center gap-1">
              {trip.autoApprove && (
                <MaterialIcons name="bolt" size={16} color="#22c55e" />
              )}
              <Text className="text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                {trip.autoApprove ? "Instant booking" : "Request to join"}
              </Text>
            </View>
          )}
        </View>
        <PrimaryButton
          title={buttonTitle}
          disabled={buttonDisabled}
          isLoading={joinMutation.isPending || startTripMutation.isPending || endTripMutation.isPending}
          className={isCreator && isStarted ? "!bg-red-500" : ""}
          onPress={async () => {
            if (isCreator && isStarted) {
              await endTripMutation.mutateAsync(id);
            } else if (isCreator) {
              await startTripMutation.mutateAsync(id);
            } else if (!isApproved && !isPending) {
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
