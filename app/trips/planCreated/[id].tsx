import React, { useCallback, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { Image } from "expo-image";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import { tripService } from "@/services/trips";
import { resolveImageUrl } from "@/utils/constants";
import type { TripResponse } from "@/types/trip-creation";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const IMAGE_HEIGHT = SCREEN_HEIGHT * 0.4;

export default function PlanCreatedScreen() {
  const insets = useSafeAreaInsets();
  const { id, location } = useLocalSearchParams<{ id: string; location: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const scrollRef = useRef<ScrollView>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const { data: trip, isLoading } = useQuery<TripResponse>({
    queryKey: ["trip", id],
    queryFn: () => tripService.getTripById(id!),
    enabled: !!id,
  });

  const handleScroll = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.x;
      const index = Math.round(offset / SCREEN_WIDTH);
      setActiveIndex(index);
    },
    [],
  );

  if (isLoading || !trip) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  const hasMultipleImages = trip.imagesUrls.length > 1;

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="relative" style={{ height: IMAGE_HEIGHT }}>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handleScroll}
          style={{ height: IMAGE_HEIGHT }}
        >
          {trip.imagesUrls.map((url, idx) => (
            <Image
              key={idx}
              source={{ uri: resolveImageUrl(url) }}
              style={{ width: SCREEN_WIDTH, height: IMAGE_HEIGHT }}
              contentFit="cover"
              cachePolicy="memory-disk"
              onError={(e) => console.warn("Image load error:", e.error)}
            />
          ))}
        </ScrollView>
        <View className="absolute inset-0 bg-black/40" pointerEvents="none" />
        <View className="absolute top-0 left-0 right-0 px-4" style={{ paddingTop: insets.top + 16 }}>
          <BackButton iconSize={18} iconName="close" className="w-10 h-10 bg-white/20" onPress={() => router.dismissAll()} />
        </View>
        {hasMultipleImages && (
          <View className="absolute bottom-4 left-0 right-0 flex-row justify-center gap-1.5">
            {trip.imagesUrls.map((_, idx) => (
              <View
                key={idx}
                className={`w-2 h-2 rounded-full ${idx === activeIndex ? "bg-white" : "bg-white/40"}`}
              />
            ))}
          </View>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1">
        <View className="bg-background-light dark:bg-background-dark pt-6 px-5">
          <Text className="text-[26px] font-bold leading-8 text-[#0c141d] dark:text-white mb-4">
            {trip.title}
          </Text>

          <View className="flex-row flex-wrap items-center gap-2 mb-6">
            <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
              <MaterialIcons name="group" size={14} color="#64748b" />
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">
                {trip.approvedParticipants.length} / {trip.maxParticipantsCount}
              </Text>
            </View>
            <View className="flex-row items-center gap-1 px-3 py-1.5 rounded-full bg-primary/10">
              <MaterialIcons
                name={trip.tripVisibility === "Public" ? "public" : "lock"}
                size={14}
                color="#359EFF"
              />
              <Text className="text-xs font-semibold text-primary">{trip.tripVisibility}</Text>
            </View>
            <View className="flex-row items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
              <MaterialIcons name="calendar-today" size={14} color="#64748b" />
              <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">{trip.startDate}</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 mb-6" style={{ gap: 16 }}>
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center">
                <MaterialIcons name="location-on" size={18} color="#359EFF" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Location</Text>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white mt-0.5">{location || "Not specified"}</Text>
              </View>
            </View>
            <View className="h-px bg-slate-100 dark:bg-slate-700" />
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center">
                <MaterialIcons name="category" size={18} color="#359EFF" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Theme</Text>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white mt-0.5">{trip.theme}</Text>
              </View>
            </View>
            <View className="h-px bg-slate-100 dark:bg-slate-700" />
            <View className="flex-row items-center gap-3">
              <View className="w-9 h-9 rounded-full bg-primary/10 items-center justify-center">
                <MaterialIcons name="person" size={18} color="#359EFF" />
              </View>
              <View className="flex-1">
                <Text className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Host</Text>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white mt-0.5">
                  {trip.createdByUser.firstName} {trip.createdByUser.lastName}
                </Text>
              </View>
            </View>
          </View>

          <View className="mb-8">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-2">About this trip</Text>
            <Text className="text-sm leading-6 text-slate-600 dark:text-slate-400">{trip.description}</Text>
          </View>
        </View>
      </ScrollView>

      <View className="px-5 py-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <View className="w-full h-12 rounded-2xl border-2 border-primary border-dashed items-center justify-center flex-row gap-2">
          <MaterialIcons name="hourglass-empty" size={16} color="#359EFF" />
          <Text className="text-sm font-bold text-primary">Waiting for Acceptance</Text>
        </View>
      </View>
    </View>
  );
}
