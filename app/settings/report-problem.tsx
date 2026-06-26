import React, { useState } from "react";
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
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import {
  reportProblemSchema,
  type ReportProblemFormData,
} from "@/utils/validation";

const ISSUE_TYPES = [
  "Technical Issue",
  "Account Access",
  "Trip Request Issue",
  "Client Issue",
  "Payout Issue",
  "Verification Issue",
  "General Feedback",
  "Other",
];

export default function ReportProblemScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [showOptions, setShowOptions] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ReportProblemFormData>({
    resolver: zodResolver(reportProblemSchema),
    defaultValues: { issueType: "", description: "" },
  });

  const issueType = watch("issueType");

  const onSubmit = async (_data: ReportProblemFormData) => {};

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Report a Problem</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <Text className="text-xs font-bold text-sub-light uppercase tracking-widest mb-3 ml-1">Issue Type</Text>
          <Pressable
            onPress={() => setShowOptions(!showOptions)}
            className="flex-row items-center bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark px-4 h-14 shadow-sm mb-2"
          >
            <Text className={`flex-1 text-sm font-medium ${issueType ? "text-main-light dark:text-white" : "text-[#9ca3af]"}`}>
              {issueType || "Select issue type"}
            </Text>
            <MaterialIcons name={showOptions ? "expand-less" : "expand-more"} size={20} color="#64748b" />
          </Pressable>

          {errors.issueType && (
            <Text className="text-xs text-red-500 mb-2 ml-1">{errors.issueType.message}</Text>
          )}

          {showOptions && (
            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
              {ISSUE_TYPES.map((type, i) => (
                <Pressable
                  key={type}
                  onPress={() => {
                    setValue("issueType", type, { shouldValidate: true });
                    setShowOptions(false);
                  }}
                  className={`px-4 py-3.5 ${
                    i !== ISSUE_TYPES.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
                  } ${issueType === type ? "bg-primary/5" : ""}`}
                >
                  <Text
                    className={`text-sm font-medium ${
                      issueType === type ? "text-primary" : "text-main-light dark:text-white"
                    }`}
                  >
                    {type}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}

          <Text className="text-xs font-bold text-sub-light uppercase tracking-widest mb-3 ml-1 mt-2">Description</Text>
          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
            <View className="px-4 py-4">
              <Controller
                control={control}
                name="description"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe the issue you're experiencing..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="text-sm font-medium text-main-light dark:text-white p-0"
                    style={{ minHeight: 120 }}
                  />
                )}
              />
              {errors.description && (
                <Text className="text-xs text-red-500 mt-1">{errors.description.message}</Text>
              )}
            </View>
          </View>

          <Pressable className="border-2 border-dashed border-neutral-light dark:border-neutral-dark rounded-2xl h-28 items-center justify-center bg-white/50 dark:bg-neutral-dark/50">
            <MaterialIcons name="camera-alt" size={28} color="#64748b" />
            <Text className="text-xs font-semibold text-sub-light mt-2">Add Screenshot (Optional)</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton
          title="Submit Report"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );
}
