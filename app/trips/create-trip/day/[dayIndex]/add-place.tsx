import { MaterialIcons } from "@expo/vector-icons";
import { FlashList } from "@shopify/flash-list";
import { useColorScheme } from "nativewind";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useTripDraftStore } from "@/store/tripCreation";
import { usePlacesInfinite } from "@/hooks/usePlacesInfinite";

export default function AddPlaceScreen() {
  const { dayIndex } = useLocalSearchParams<{ dayIndex: string }>();
  const idx = parseInt(dayIndex ?? "0", 10);
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [search, setSearch] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const draftDays = useTripDraftStore((s) => s.days);
  const addPlacesToDay = useTripDraftStore((s) => s.addPlacesToDay);
  const governorateId = useTripDraftStore((s) => s.governorateId);
  const mapLocation = useTripDraftStore((s) => s.mapLocation);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = usePlacesInfinite(search);

  useEffect(() => {
    if (isError) {
      Toast.show({
        type: "error",
        text1: "Failed to load places",
        text2: (error as any)?.message ?? "Try again later",
      });
    }
  }, [isError, error]);

  const allPlaces = useMemo(
    () => data?.pages.flatMap((p: any) => p.items ?? []) ?? [],
    [data],
  );

  const existingPlaceIds = useMemo(() => {
    if (idx >= 0 && idx < draftDays.length) {
      return new Set(draftDays[idx].placeIds);
    }
    return new Set<number>();
  }, [draftDays, idx]);

  const noFilter = governorateId === null && mapLocation === null;

  const togglePlace = useCallback((placeId: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(placeId)) {
        next.delete(placeId);
      } else {
        next.add(placeId);
      }
      return next;
    });
  }, []);

  const handleAdd = useCallback(() => {
    addPlacesToDay(idx, Array.from(selectedIds));
    router.back();
  }, [addPlacesToDay, idx, selectedIds]);

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
          Add Places - Day {idx + 1}
        </Text>
      </View>

      <View className="px-4 pt-3 pb-2">
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-11 gap-2">
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search places..."
            placeholderTextColor="#94a3b8"
            className="flex-1 text-sm text-[#0c141d] dark:text-white"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={18} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      {noFilter && !isLoading && (
        <View className="flex-1 items-center justify-center px-8">
          <MaterialIcons name="map" size={48} color="#94a3b8" />
          <Text className="text-sm text-slate-500 text-center mt-3">
            Select a governorate or pin a location on the map first to browse
            places
          </Text>
        </View>
      )}

      {!noFilter && (
        <FlashList
          data={allPlaces}
          estimatedItemSize={72}
          keyExtractor={(item: any) => String(item.id)}
          onEndReached={() => {
            if (hasNextPage && !isFetchingNextPage) {
              fetchNextPage();
            }
          }}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View className="py-4">
                <Text className="text-xs text-slate-500 text-center">
                  Loading more...
                </Text>
              </View>
            ) : null
          }
          ListEmptyComponent={
            !isLoading ? (
              <View className="py-8">
                <Text className="text-sm text-slate-500 text-center">
                  No places found
                </Text>
              </View>
            ) : null
          }
          renderItem={({ item }: { item: any }) => {
            const placeId = item.id as number;
            const isExisting = existingPlaceIds.has(placeId);
            const isSelected = selectedIds.has(placeId);

            return (
              <Pressable
                onPress={() => {
                  if (!isExisting) togglePlace(placeId);
                }}
                disabled={isExisting}
                className={`flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-slate-700 ${
                  isExisting ? "opacity-40" : ""
                }`}
              >
                <View
                  className={`w-6 h-6 rounded border-2 items-center justify-center mr-3 ${
                    isExisting
                      ? "border-slate-300 bg-slate-200 dark:border-slate-600 dark:bg-slate-700"
                      : isSelected
                        ? "border-primary bg-primary"
                        : "border-slate-300 dark:border-slate-600"
                  }`}
                >
                  {(isExisting || isSelected) && (
                    <MaterialIcons name="check" size={14} color="white" />
                  )}
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-medium text-[#0c141d] dark:text-white">
                    {item.title}
                  </Text>
                  {item.governorate?.name && (
                    <Text className="text-xs text-slate-500 mt-0.5">
                      {item.governorate.name}
                      {item.category?.name ? ` · ${item.category.name}` : ""}
                    </Text>
                  )}
                </View>
              </Pressable>
            );
          }}
          contentContainerStyle={{ paddingBottom: 100 }}
        />
      )}

      {!noFilter && selectedIds.size > 0 && (
        <View
          className="bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-4 py-4"
          style={{ paddingBottom: insets.bottom + 16 }}
        >
          <PrimaryButton
            title={`Add Selected (${selectedIds.size})`}
            onPress={handleAdd}
          />
        </View>
      )}
    </View>
  );
}
