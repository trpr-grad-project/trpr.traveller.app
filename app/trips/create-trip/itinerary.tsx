import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  LayoutAnimation,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import DayAccordion from "@/components/create-trip/DayAccordion";
import { useTripDraftStore } from "@/store/tripCreation";
import { useCreateTrip } from "@/hooks/useCreateTrip";
import { getTripSuggestion } from "@/services/suggestion";
import type { CreateTripPayload } from "@/types/trip-creation";

export default function CreateTripStep3() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const draft = useTripDraftStore();
  const createTripMutation = useCreateTrip();
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);

  const toggleDay = useCallback((idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex((prev) => (prev === idx ? -1 : idx));
  }, []);

  const handleDayCountChange = useCallback(
    (delta: number) => {
      const next = draft.days.length + delta;
      if (next < 1) return;
      draft.setDayCount(next);
    },
    [draft],
  );

  const handleGenerateSuggestion = useCallback(async () => {
    if (!draft.themeId) {
      Toast.show({ type: "error", text1: "Missing theme", text2: "Please select a theme first" });
      return;
    }
    if (!draft.startDate) {
      Toast.show({ type: "error", text1: "Missing start date", text2: "Please set a start date first" });
      return;
    }

    setIsGenerating(true);
    try {
      const params: Parameters<typeof getTripSuggestion>[0] = {
        ThemeId: draft.themeId,
        NumberOfDays: draft.days.length,
        StartDateUtc: draft.startDate,
      };
      if (draft.governorateId) params.GovernorateId = draft.governorateId;
      if (draft.mapLocation) {
        params.Latitude = draft.mapLocation.lat;
        params.Longitude = draft.mapLocation.lng;
        params.RadiusInMeters = draft.mapLocation.radius;
      }

      const result = await getTripSuggestion(params);

      const dayMap = (result as any).data ?? (result as any).days ?? result;

      Object.entries(dayMap).forEach(([dayKey, dayData]: [string, any]) => {
        const dayIndex = parseInt(dayKey) - 1;
        if (isNaN(dayIndex) || dayIndex < 0 || dayIndex >= draft.days.length) return;
        const places = dayData?.itinerary?.places ?? dayData?.places ?? [];
        if (places.length === 0) return;
        draft.setDayPlaces(dayIndex, places.map((p: any) => p.id));
        places.forEach((p: any) => draft.setPlaceName(p.id, p.title));
      });

      Toast.show({
        type: "success",
        text1: "Itinerary generated!",
        text2: "AI suggestions have been added to your days",
      });
    } catch (err: any) {
      const data = err?.response?.data;
      const detail =
        data?.message ?? data?.title ?? data?.detail ?? err?.message ?? "Failed to generate suggestion";
      Toast.show({ type: "error", text1: "Suggestion failed", text2: detail });
    } finally {
      setIsGenerating(false);
    }
  }, [draft]);

  const handleSubmitTrip = useCallback(() => {
    if (draft.days.length === 0) {
      Toast.show({
        type: "error",
        text1: "Missing days",
        text2: "Please add at least one day",
      });
      return;
    }
    for (let i = 0; i < draft.days.length; i++) {
      if (draft.days[i].placeIds.length === 0) {
        Toast.show({
          type: "error",
          text1: `Day ${i + 1} has no places`,
          text2: "Assign at least one place per day",
        });
        return;
      }
      if (draft.days[i].duration <= 0) {
        Toast.show({
          type: "error",
          text1: `Day ${i + 1} has no hours`,
          text2: "Set the duration for each day",
        });
        return;
      }
      if (draft.days[i].duration > 24) {
        Toast.show({
          type: "error",
          text1: `Day ${i + 1} exceeds 24 hours`,
          text2: "Duration cannot exceed 24 hours per day",
        });
        return;
      }
    }

    const allUploaded = draft.images.every(
      (i) => !i.uploading && i.filename,
    );
    if (!allUploaded) {
      Toast.show({
        type: "error",
        text1: "Still uploading",
        text2: "Please wait for all images to finish uploading",
      });
      return;
    }

    const locationLabel = draft.governorateId
      ? `${draft.governorateName}, Egypt`
      : "Not specified";

    const payload: CreateTripPayload = {
      themeId: String(draft.themeId!),
      title: draft.title,
      description: draft.description,
      price: "0",
      startDate: draft.startDate!,
      endDate: draft.endDate ?? draft.startDate ?? "",
      images: draft.images.map((i) => i.filename!),
      autoApprove: draft.autoApprove,
      tripVisibility: draft.visibility,
      publishMode: draft.publishMode,
      segments: draft.days.map((d) => ({
        duration: String(d.duration),
        dayDate: d.dayDate ?? "",
        placesIds: d.placeIds.map(String),
      })),
      maxParticipantsCount: String(draft.maxParticipants),
      guideId: null,
    };

    createTripMutation.mutate(payload, {
      onSuccess: (data) => {
        Toast.show({
          type: "success",
          text1: "Trip Created!",
          text2: "Your trip has been published",
        });
        const tripId =
          data?.id ??
          data?.tripId ??
          data?.data?.id ??
          (data as any)?.createdTrip?.id;
        if (tripId) {
          router.replace(`/trips/planCreated/${tripId}?location=${encodeURIComponent(locationLabel)}`);
        } else {
          router.replace("/(traveler)");
        }
      },
      onError: (err: any) => {
        const status = err?.response?.status ?? "";
        const data = err?.response?.data;
        const detail =
          data?.message ?? data?.title ?? data?.detail ?? JSON.stringify(data);
        Toast.show({
          type: "error",
          text1: `Error ${status}`,
          text2: detail ?? err?.message ?? "Failed to create trip",
        });
      },
    });
  }, [draft, createTripMutation]);

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

      <View className="flex-row items-center border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-4">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-center mr-8 text-lg font-bold text-[#0c141d] dark:text-white">
          Plan Your Days
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1"
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 120 }}
        >
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xs font-semibold text-slate-500">
                Number of Days
              </Text>
              <View className="flex-row items-center gap-3">
                <Pressable
                  onPress={() => handleDayCountChange(-1)}
                  className="w-8 h-8 rounded-full border-2 border-slate-200 dark:border-slate-600 items-center justify-center"
                >
                  <MaterialIcons name="remove" size={16} color="#64748b" />
                </Pressable>
                <Text className="text-base font-bold text-[#0c141d] dark:text-white min-w-[20px] text-center">
                  {draft.days.length}
                </Text>
                <Pressable
                  onPress={() => handleDayCountChange(1)}
                  className="w-8 h-8 rounded-full bg-primary items-center justify-center"
                >
                  <MaterialIcons name="add" size={16} color="white" />
                </Pressable>
              </View>
            </View>

            <DayAccordion
              dayCount={draft.days.length}
              days={draft.days}
              placeNames={draft.placeNames}
              onDurationChange={draft.setDayDuration}
              onDayDateChange={draft.setDayDate}
              onRemovePlace={draft.removePlaceFromDay}
              onReorderPlace={draft.reorderDayPlace}
              onAddPlace={(dayIndex) =>
                router.push(`/trips/create-trip/day/${dayIndex}/add-place`)
              }
              onRemoveDay={draft.removeDay}
              expandedIndex={expandedIndex}
              onToggle={toggleDay}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        className="absolute bottom-24 right-4 z-50"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleGenerateSuggestion}
          disabled={isGenerating}
          className="w-14 h-14 rounded-full bg-primary items-center justify-center shadow-lg active:opacity-80"
        >
          {isGenerating ? (
            <ActivityIndicator color="white" size="small" />
          ) : (
            <MaterialCommunityIcons name="auto-fix" size={24} color="white" />
          )}
        </Pressable>
      </View>

      <View
        className="bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton
          title={
            createTripMutation.isPending ? "Creating..." : "Create Trip"
          }
          onPress={handleSubmitTrip}
          isLoading={createTripMutation.isPending}
          disabled={createTripMutation.isPending}
        />
      </View>
    </View>
  );
}
