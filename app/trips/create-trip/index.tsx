import DateTimePicker from "@react-native-community/datetimepicker";
import { zodResolver } from "@hookform/resolvers/zod";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useCallback, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { z } from "zod";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import SearchablePicker from "@/components/create-trip/SearchablePicker";
import type { SearchablePickerRef } from "@/components/create-trip/SearchablePicker";
import ImageGrid from "@/components/create-trip/ImageGrid";
import { formatRFC3339, displayDateTime } from "@/utils/dates";
import { useTripDraftStore } from "@/store/tripCreation";
import { useTripFormData } from "@/hooks/useTripFormData";
import { useUploadImage } from "@/hooks/useUploadImage";

const fieldSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

type FieldData = z.infer<typeof fieldSchema>;

export default function CreateTripStep1() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const draft = useTripDraftStore();
  const tripFormData = useTripFormData();
  const uploadMutation = useUploadImage();
  const themePickerRef = useRef<SearchablePickerRef>(null);

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [endDatePickerDate, setEndDatePickerDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldData>({
    resolver: zodResolver(fieldSchema),
    defaultValues: { title: draft.title, description: draft.description },
  });

  const themes = tripFormData.data?.themes ?? [];

  const selectedThemeName =
    themes.find((t: any) => t.id === draft.themeId)?.name ?? null;

  const handlePickImages = useCallback(async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: true,
    });

    if (result.canceled) return;

    for (const asset of result.assets) {
      if (!asset.uri) continue;
      const filename = asset.fileName ?? `image_${Date.now()}.jpg`;
      draft.addImage(asset.uri);
      uploadMutation.mutate({ localUri: asset.uri, filename });
    }
  }, [draft, uploadMutation]);

  const onNext = useCallback(
    (fieldData: FieldData) => {
      if (isSubmitting) return;
      setIsSubmitting(true);

      draft.setTitle(fieldData.title);
      draft.setDescription(fieldData.description);

      if (!draft.themeId) {
        Toast.show({
          type: "error",
          text1: "Missing field",
          text2: "Please select a theme",
        });
        setIsSubmitting(false);
        return;
      }
      if (!draft.startDate) {
        Toast.show({
          type: "error",
          text1: "Missing field",
          text2: "Please select a start date",
        });
        setIsSubmitting(false);
        return;
      }
      if (draft.images.length === 0) {
        Toast.show({
          type: "error",
          text1: "Missing field",
          text2: "Please add at least one photo",
        });
        setIsSubmitting(false);
        return;
      }

      router.push("/trips/create-trip/location");
      setIsSubmitting(false);
    },
    [draft, isSubmitting],
  );

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
          Create Trip
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
          <View>
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              Photos
            </Text>
            <ImageGrid
              images={draft.images}
              onAdd={handlePickImages}
              onRemove={draft.removeImage}
            />
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 gap-4">
            <Text className="text-sm font-bold text-[#0c141d] dark:text-white uppercase tracking-wider opacity-70">
              Details
            </Text>

            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-1.5">
                Title
              </Text>
              <Controller
                control={control}
                name="title"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      draft.setTitle(value);
                    }}
                    placeholder="Trip title"
                    placeholderTextColor="#94a3b8"
                    className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-[#0c141d] dark:text-white"
                  />
                )}
              />
              {errors.title && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.title.message}
                </Text>
              )}
            </View>

            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-1.5">
                Description
              </Text>
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    onBlur={() => {
                      onBlur();
                      draft.setDescription(value);
                    }}
                    placeholder="Describe your trip"
                    placeholderTextColor="#94a3b8"
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-[#0c141d] dark:text-white"
                    style={{ minHeight: 72 }}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-xs text-red-500 mt-1">
                  {errors.description.message}
                </Text>
              )}
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              Theme
            </Text>
            <Pressable
              onPress={() => themePickerRef.current?.open()}
              className="flex-row items-center h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl"
            >
              <MaterialIcons
                name="palette"
                size={18}
                color={selectedThemeName ? "#359EFF" : "#94a3b8"}
              />
              <Text
                className={`flex-1 text-sm font-medium ml-2 ${
                  selectedThemeName
                    ? "text-[#0c141d] dark:text-white"
                    : "text-slate-400"
                }`}
              >
                {selectedThemeName ?? "Select a theme"}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-3">
              Visibility
            </Text>
            <Pressable
              onPress={() => draft.setVisibility("Public")}
              className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${
                draft.visibility === "Public"
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  draft.visibility === "Public"
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {draft.visibility === "Public" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                Public
              </Text>
              <MaterialIcons
                name="public"
                size={20}
                color={draft.visibility === "Public" ? "#359EFF" : "#94a3b8"}
              />
            </Pressable>
            <Pressable
              onPress={() => draft.setVisibility("Private")}
              className={`flex-row items-center gap-3 p-3 rounded-xl ${
                draft.visibility === "Private"
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  draft.visibility === "Private"
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {draft.visibility === "Private" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                Private
              </Text>
              <MaterialIcons
                name="lock"
                size={20}
                color={draft.visibility === "Private" ? "#359EFF" : "#94a3b8"}
              />
            </Pressable>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-3">
              Auto Approve
            </Text>
            <Pressable
              onPress={() => draft.setAutoApprove(true)}
              className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${
                draft.autoApprove
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  draft.autoApprove
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {draft.autoApprove && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                Yes
              </Text>
            </Pressable>
            <Pressable
              onPress={() => draft.setAutoApprove(false)}
              className={`flex-row items-center gap-3 p-3 rounded-xl ${
                !draft.autoApprove
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  !draft.autoApprove
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {!draft.autoApprove && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                No
              </Text>
            </Pressable>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-3">
              Publish Mode
            </Text>
            <Pressable
              onPress={() => draft.setPublishMode("DirectPublish")}
              className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${
                draft.publishMode === "DirectPublish"
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  draft.publishMode === "DirectPublish"
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {draft.publishMode === "DirectPublish" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                Direct Publish
              </Text>
            </Pressable>
            <Pressable
              onPress={() => draft.setPublishMode("Bidding")}
              className={`flex-row items-center gap-3 p-3 rounded-xl ${
                draft.publishMode === "Bidding"
                  ? "bg-primary/10 border border-primary/20"
                  : ""
              }`}
            >
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  draft.publishMode === "Bidding"
                    ? "border-primary bg-primary"
                    : "border-slate-300 dark:border-slate-600"
                }`}
              >
                {draft.publishMode === "Bidding" && (
                  <View className="w-2 h-2 rounded-full bg-white" />
                )}
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                Bidding
              </Text>
            </Pressable>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              Max Participants
            </Text>
            <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700">
              <Pressable
                onPress={() =>
                  draft.setMaxParticipants(
                    Math.max(2, draft.maxParticipants - 1),
                  )
                }
                className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 items-center justify-center"
              >
                <MaterialIcons name="remove" size={20} color="#64748b" />
              </Pressable>
              <Text className="text-xl font-bold text-[#0c141d] dark:text-white">
                {draft.maxParticipants}
              </Text>
              <Pressable
                onPress={() =>
                  draft.setMaxParticipants(
                    Math.min(50, draft.maxParticipants + 1),
                  )
                }
                className="w-10 h-10 rounded-full bg-primary items-center justify-center"
              >
                <MaterialIcons name="add" size={20} color="white" />
              </Pressable>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              Start Date
            </Text>
            <Pressable
              onPress={() => setShowDatePicker(true)}
              className="flex-row items-center h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl"
            >
              <MaterialIcons name="calendar-today" size={18} color="#359EFF" />
              <Text
                className={`flex-1 text-sm font-medium ml-2 ${
                  draft.startDate
                    ? "text-[#0c141d] dark:text-white"
                    : "text-slate-400"
                }`}
              >
                {displayDateTime(draft.startDate)}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
            {showDatePicker && (
              <DateTimePicker
                value={datePickerDate}
                mode={Platform.OS === "ios" ? "datetime" : "date"}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={Platform.OS === "ios" ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date()}
                onChange={(_event, selectedDate) => {
                  if (Platform.OS === "android") setShowDatePicker(false);
                  if (selectedDate) {
                    setDatePickerDate(selectedDate);
                    draft.setStartDate(formatRFC3339(selectedDate));
                    if (!draft.endDate || selectedDate > endDatePickerDate) {
                      setEndDatePickerDate(selectedDate);
                      draft.setEndDate(formatRFC3339(selectedDate));
                    }
                  }
                }}
              />
            )}
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
            <Text className="text-xs font-semibold text-slate-500 mb-2">
              End Date
            </Text>
            <Pressable
              onPress={() => setShowEndDatePicker(true)}
              className="flex-row items-center h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl"
            >
              <MaterialIcons name="calendar-today" size={18} color="#359EFF" />
              <Text
                className={`flex-1 text-sm font-medium ml-2 ${
                  draft.endDate
                    ? "text-[#0c141d] dark:text-white"
                    : "text-slate-400"
                }`}
              >
                {displayDateTime(draft.endDate)}
              </Text>
              <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
            </Pressable>
            {showEndDatePicker && (
              <DateTimePicker
                value={endDatePickerDate}
                mode={Platform.OS === "ios" ? "datetime" : "date"}
                display={Platform.OS === "ios" ? "spinner" : "default"}
                minimumDate={draft.startDate ? new Date(draft.startDate) : Platform.OS === "ios" ? new Date(new Date().setHours(0, 0, 0, 0)) : new Date()}
                onChange={(_event, selectedDate) => {
                  if (Platform.OS === "android") setShowEndDatePicker(false);
                  if (selectedDate) {
                    setEndDatePickerDate(selectedDate);
                    draft.setEndDate(formatRFC3339(selectedDate));
                  }
                }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton title="Next" onPress={handleSubmit(onNext)} />
      </View>

      <SearchablePicker
        ref={themePickerRef}
        items={themes}
        selectedId={draft.themeId}
        onSelect={(item) => draft.setTheme(item.id)}
      />
    </View>
  );
}
