import { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import SearchablePicker, { SearchablePickerRef, PickerItem } from "@/components/create-trip/SearchablePicker";
import { placesService } from "@/services/places";
import { usePlaceDraftStore } from "@/store/placeDraft";

interface FormData {
  categories: { id: number; name: string }[];
  governorates: { id: number; name: string }[];
  tags: { id: number; name: string }[];
}

export default function AddPlaceScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const draft = usePlaceDraftStore();

  const [formData, setFormData] = useState<FormData | null>(null);
  const [isLoadingForm, setIsLoadingForm] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const governoratePickerRef = useRef<SearchablePickerRef>(null);
  const categoryPickerRef = useRef<SearchablePickerRef>(null);

  useEffect(() => {
    placesService
      .getFormData()
      .then((data) => setFormData(data))
      .catch(() => Toast.show({ type: "error", text1: "Failed to load form data" }))
      .finally(() => setIsLoadingForm(false));
  }, []);

  const handleSave = async () => {
    if (!draft.title.trim()) {
      Toast.show({ type: "error", text1: "Title is required" });
      return;
    }
    if (!draft.governorateId) {
      Toast.show({ type: "error", text1: "Please select a governorate" });
      return;
    }
    if (!draft.categoryId) {
      Toast.show({ type: "error", text1: "Please select a category" });
      return;
    }
    if (draft.latitude === null || draft.longitude === null) {
      Toast.show({ type: "error", text1: "Please pick a location on the map" });
      return;
    }

    setIsSaving(true);
    try {
      await placesService.createPlace({
        title: draft.title,
        description: draft.description,
        categoryId: String(draft.categoryId),
        governorateId: String(draft.governorateId),
        latitude: String(draft.latitude),
        longitude: String(draft.longitude),
        tagIds: draft.tagIds.map(String),
      });
      Toast.show({ type: "success", text1: "Place created" });
      draft.reset();
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Failed to create place" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingForm) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white text-center mr-10">
          Add Place
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="gap-4">
          {/* Title */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Title *
            </Text>
            <TextInput
              value={draft.title}
              onChangeText={draft.setTitle}
              placeholder="Place name"
              placeholderTextColor="#94a3b8"
              className="bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 h-12 text-sm text-main-light dark:text-white"
            />
          </View>

          {/* Description */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Description
            </Text>
            <TextInput
              value={draft.description}
              onChangeText={draft.setDescription}
              placeholder="Describe this place"
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 py-3 h-24 text-sm text-main-light dark:text-white"
            />
          </View>

          {/* Governorate */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Governorate *
            </Text>
            <Pressable
              onPress={() => governoratePickerRef.current?.open()}
              className="flex-row items-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 h-12"
            >
              <MaterialIcons name="business" size={20} color="#94a3b8" />
              <Text
                className={`flex-1 text-sm ml-3 ${
                  draft.governorateName
                    ? "text-main-light dark:text-white font-semibold"
                    : "text-slate-400"
                }`}
              >
                {draft.governorateName || "Select governorate"}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Category */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Category *
            </Text>
            <Pressable
              onPress={() => categoryPickerRef.current?.open()}
              className="flex-row items-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 h-12"
            >
              <MaterialIcons name="category" size={20} color="#94a3b8" />
              <Text
                className={`flex-1 text-sm ml-3 ${
                  draft.categoryName
                    ? "text-main-light dark:text-white font-semibold"
                    : "text-slate-400"
                }`}
              >
                {draft.categoryName || "Select category"}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Tags */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Tags
            </Text>
            <Pressable
              onPress={() => router.push("/settings/select-tags")}
              className="flex-row items-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 h-12"
            >
              <MaterialIcons name="label" size={20} color="#94a3b8" />
              <Text
                className={`flex-1 text-sm ml-3 ${
                  draft.tagIds.length > 0
                    ? "text-main-light dark:text-white font-semibold"
                    : "text-slate-400"
                }`}
              >
                {draft.tagIds.length > 0
                  ? `${draft.tagIds.length} tag${draft.tagIds.length > 1 ? "s" : ""} selected`
                  : "Select tags"}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          {/* Location */}
          <View>
            <Text className="text-xs font-semibold text-sub-dark dark:text-gray-400 mb-1.5 uppercase tracking-wider">
              Location *
            </Text>
            <Pressable
              onPress={() => router.push("/settings/pick-location")}
              className="flex-row items-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark rounded-xl px-4 h-12"
            >
              <MaterialIcons name="map" size={20} color="#94a3b8" />
              <Text
                className={`flex-1 text-sm ml-3 ${
                  draft.latitude !== null
                    ? "text-main-light dark:text-white font-semibold"
                    : "text-slate-400"
                }`}
              >
                {draft.latitude !== null
                  ? `${draft.latitude?.toFixed(4)}, ${draft.longitude?.toFixed(4)}`
                  : "Pick on map"}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          </View>
        </View>
      </ScrollView>

      {/* Save button */}
      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleSave}
          disabled={isSaving}
          className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white text-lg font-semibold">Save Place</Text>
          )}
        </Pressable>
      </View>

      {/* Bottom sheets */}
      {formData && (
        <>
          <SearchablePicker
            ref={governoratePickerRef}
            items={formData.governorates.map((g) => ({ id: g.id, name: g.name }))}
            selectedId={draft.governorateId}
            onSelect={(item: PickerItem) => draft.setGovernorate(item.id, item.name)}
          />
          <SearchablePicker
            ref={categoryPickerRef}
            items={formData.categories.map((c) => ({ id: c.id, name: c.name }))}
            selectedId={draft.categoryId}
            onSelect={(item: PickerItem) => draft.setCategory(item.id, item.name)}
          />
        </>
      )}
    </View>
  );
}
