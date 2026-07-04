import React, { useMemo, useState } from "react";
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
import { useColorScheme } from "nativewind";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import { useMyTrips } from "@/hooks/useMyTrips";
import {
  SEGMENTS,
  SEGMENT_LABELS,
  SEGMENT_STATUS_MAP,
  STATUS_TO_LABEL,
  STATUS_COLORS,
} from "@/utils/tripSegments";
import { resolveImageUrl } from "@/utils/constants";
import type { MyTrip } from "@/types";

function getTripLocation(trip: MyTrip): string {
  const governorate =
    trip.segments?.[0]?.places?.[0]?.governorate?.name ?? "";
  return governorate ? `${governorate}, Egypt` : "";
}

function getTripDates(trip: MyTrip): string {
  return `${trip.startDate} \u00B7 ${trip.tripTime}`;
}

const TripCard = React.memo(function TripCard({ trip }: { trip: MyTrip }) {
  const label = STATUS_TO_LABEL[trip.status] ?? trip.status;
  const colors = STATUS_COLORS[label] ?? { bg: "#64748B", text: "#FFFFFF" };

  return (
    <Pressable
      onPress={() => router.push(`/trips/${trip.tripId}`)}
      className="bg-white dark:bg-neutral-dark rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden active:opacity-80"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.08,
        shadowRadius: 30,
        elevation: 10,
      }}
    >
      <View className="relative">
        <Image
          source={{ uri: resolveImageUrl(trip.imagesUrls?.[0] ?? "") }}
          className="w-full h-56"
          resizeMode="cover"
        />
        <View className="absolute top-4 right-4">
          <View
            className="px-3 py-1.5 rounded-full shadow-md"
            style={{ backgroundColor: colors.bg }}
          >
            <Text
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: colors.text }}
            >
              {label}
            </Text>
          </View>
        </View>
      </View>
      <View className="p-6">
        <Text className="text-xl font-bold text-[#0c141d] dark:text-white mb-2 leading-tight">
          {trip.title}
        </Text>
        <View className="flex-row items-center gap-2 mb-2">
          <MaterialIcons name="location-on" size={18} color="#64748b" />
          <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {getTripLocation(trip)}
          </Text>
        </View>
        <View className="flex-row items-center gap-2 mb-4">
          <MaterialIcons name="calendar-today" size={18} color="#94a3b8" />
          <Text className="text-sm font-medium text-slate-400 dark:text-slate-500">
            {getTripDates(trip)}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push(`/trips/${trip.tripId}`)}
          className="flex-row items-center justify-center gap-2 mt-2 w-full py-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg active:opacity-80"
        >
          <Text className="text-sm font-bold text-primary">View Trip Details</Text>
          <MaterialIcons name="chevron-right" size={16} color="#359EFF" />
        </Pressable>
      </View>
    </Pressable>
  );
});

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [segmentIndex, setSegmentIndex] = useState(0);
  const selectedSegment = SEGMENTS[segmentIndex];

  const { data: trips, isLoading, isError, refetch, isRefetching } = useMyTrips();

  const filteredTrips = useMemo(
    () => {
      const items =
        selectedSegment === "all"
          ? trips ?? []
          : (trips ?? []).filter((trip) =>
              (SEGMENT_STATUS_MAP[selectedSegment] as readonly string[]).includes(trip.status),
            );
      return [...items].sort((a, b) => a.startDate.localeCompare(b.startDate));
    },
    [trips, selectedSegment],
  );

  const renderContent = () => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center py-20">
          <ActivityIndicator size="large" color="#359EFF" />
        </View>
      );
    }

    if (isError) {
      return (
        <View className="flex-1 items-center justify-center py-20 px-6">
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
            Something went wrong loading your trips.
          </Text>
          <Pressable
            onPress={() => refetch()}
            className="mt-6 bg-primary rounded-xl py-3 px-8"
          >
            <Text className="text-white font-bold text-sm">Retry</Text>
          </Pressable>
        </View>
      );
    }

    if (filteredTrips.length === 0) {
      const label = SEGMENT_LABELS[selectedSegment].toLowerCase();
      return (
        <View className="flex-1 items-center justify-center py-20">
          <MaterialIcons name="flight-takeoff" size={48} color="#64748b" />
          <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4">
            No {label} trips
          </Text>
        </View>
      );
    }

    return filteredTrips.map((trip) => <TripCard key={trip.tripId} trip={trip} />);
  };

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-3 z-10">
        <View className="flex-row items-center mb-4">
          <BackButton iconSize={20} />
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">
            My Trips
          </Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="flex-row p-1 bg-slate-50 dark:bg-slate-800 rounded-xl">
            {SEGMENTS.map((segment, i) => {
              const active = i === segmentIndex;
              return (
                <Pressable
                  key={segment}
                  onPress={() => setSegmentIndex(i)}
                  className={`py-2 px-4 rounded-[10px] ${active ? "bg-white dark:bg-slate-700 shadow-sm" : "bg-transparent dark:bg-transparent shadow-none"}`}
                >
                  {({ pressed }) => (
                    <Text
                      className={`text-center text-xs font-semibold ${
                        active
                          ? "text-primary"
                          : pressed
                            ? "text-slate-500 dark:text-slate-400"
                            : "text-slate-400 dark:text-slate-500"
                      }`}
                    >
                      {SEGMENT_LABELS[segment]}
                    </Text>
                  )}
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 40, flexGrow: 1 }}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={() => refetch()} />
        }
      >
        <View className="gap-6">
          {renderContent()}
        </View>
      </ScrollView>
    </View>
  );
}
