import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import { useTripHubStore } from "@/store/tripHubStore";
import { STATUS_TO_LABEL, STATUS_COLORS } from "@/utils/tripSegments";
import BackButton from "@/components/BackButton";
import { resolveImageUrl, UPLOADS_URL } from "@/utils/constants";
import type { TripTodayItem } from "@/types/trip-hub";

function tripImageUrl(filename: string): string {
  return resolveImageUrl(`${UPLOADS_URL}/uploads/${filename}`);
}

function formatStartTime(dateStr: string): string {
  try {
    const d = new Date(dateStr);
    return d.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  } catch {
    return "";
  }
}

function getStatusBadge(status: string): { label: string; bg: string; text: string } {
  const label = STATUS_TO_LABEL[status] || status;
  const colors = STATUS_COLORS[label] || { bg: "#64748B", text: "#FFFFFF" };
  return { label, ...colors };
}

function TripCard({ trip }: { trip: TripTodayItem }) {
  const { label, bg, text } = getStatusBadge(trip.status);
  const imageUri = trip.images?.[0]
    ? tripImageUrl(trip.images[0])
    : null;
  const isStarted = trip.status === "Started";

  return (
    <Pressable
      onPress={() => router.push(`/trips/${trip.id}`)}
      className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden active:opacity-80 border border-slate-100 dark:border-slate-700"
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
        elevation: 2,
      }}
    >
      <View className="flex-row">
        {imageUri && (
          <View className="w-24 h-24">
            <Image
              source={{ uri: imageUri }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
        )}
        <View className="flex-1 p-3 justify-center gap-1">
          <View className="flex-row items-center gap-2">
            <View
              className="px-2 py-0.5 rounded-full"
              style={{ backgroundColor: bg }}
            >
              <Text
                className="text-[10px] font-bold uppercase tracking-wider"
                style={{ color: text }}
              >
                {label}
              </Text>
            </View>
            <Text className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              {formatStartTime(trip.startDate)}
            </Text>
          </View>
          <Text
            className="text-sm font-bold text-[#0c141d] dark:text-white"
            numberOfLines={1}
          >
            {trip.title}
          </Text>
          <View className="flex-row items-center justify-between">
            <Text
              className="text-xs text-slate-500 dark:text-slate-400 flex-1"
              numberOfLines={1}
            >
              {trip.description}
            </Text>
            {isStarted && (
              <Pressable
                onPress={() => router.push(`/map/userView?tripId=${trip.id}`)}
                className="ml-2 w-8 h-8 rounded-full bg-green-500 items-center justify-center"
                hitSlop={8}
              >
                <MaterialIcons name="map" size={16} color="white" />
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Pressable>
  );
}

export default function TripsTodayScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tripsToday = useTripHubStore((s) => s.tripsToday);
  const connectionState = useTripHubStore((s) => s.connectionState);
  const isConnecting = useTripHubStore((s) => s.isConnecting);

  const isLoading = isConnecting || connectionState === "connecting";

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View className="flex-row items-center px-4 py-3">
        <BackButton />
        <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">
          Trips Today
        </Text>
      </View>

      {isLoading && tripsToday.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#359EFF" />
        </View>
      ) : tripsToday.length === 0 ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="event-busy" size={56} color="#94a3b8" />
          <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
            No trips scheduled for today
          </Text>
          <Text className="text-sm text-slate-400 dark:text-slate-500 mt-1 text-center">
            Your trips for today will appear here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={tripsToday}
          keyExtractor={(item) => item.id}
          contentContainerClassName="px-4 pb-6 gap-3"
          renderItem={({ item }) => <TripCard trip={item} />}
        />
      )}
    </View>
  );
}
