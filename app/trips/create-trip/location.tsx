import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useCallback, useRef } from "react";
import { StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import SearchablePicker from "@/components/create-trip/SearchablePicker";
import type { SearchablePickerRef } from "@/components/create-trip/SearchablePicker";
import LocationFilter from "@/components/create-trip/LocationFilter";
import { useTripDraftStore } from "@/store/tripCreation";
import { usePlaceFormData } from "@/hooks/useTripFormData";

export default function CreateTripStep2() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const draft = useTripDraftStore();
  const placeFormData = usePlaceFormData();
  const governoratePickerRef = useRef<SearchablePickerRef>(null);

  const governorates = placeFormData.data?.governorates ?? [];

  const selectedGovernorateName =
    governorates.find((g: any) => g.id === draft.governorateId)?.name ?? null;

  const handleNext = useCallback(() => {
    if (draft.governorateId === null && draft.mapLocation === null) {
      Toast.show({
        type: "error",
        text1: "Location required",
        text2: "Select a governorate or pin a location on the map",
      });
      return;
    }
    router.push("/trips/create-trip/itinerary");
  }, [draft]);

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
          Choose Location
        </Text>
      </View>

      <View className="flex-1 px-4 pt-6" style={{ gap: 16 }}>
        <LocationFilter
          governorateName={selectedGovernorateName}
          isMapSelected={draft.mapLocation !== null}
          onSelectGovernorate={() => governoratePickerRef.current?.open()}
          onSelectMap={() => router.push("/trips/create-trip/map")}
        />

        {draft.mapLocation && (
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              Pinned Location
            </Text>
            <View className="flex-row items-center gap-3">
              <MaterialIcons name="location-on" size={20} color="#359EFF" />
              <View>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white">
                  {draft.mapLocation.lat.toFixed(4)},{" "}
                  {draft.mapLocation.lng.toFixed(4)}
                </Text>
                <Text className="text-xs text-slate-500">
                  Radius: {draft.mapLocation.radius}m
                </Text>
              </View>
            </View>
          </View>
        )}
      </View>

      <View
        className="bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton title="Next" onPress={handleNext} />
      </View>

      <SearchablePicker
        ref={governoratePickerRef}
        items={governorates}
        selectedId={draft.governorateId}
        onSelect={draft.setGovernorate}
      />
    </View>
  );
}
