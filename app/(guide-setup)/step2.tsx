import React from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

function UploadCard({
  title,
  subtitle,
  iconName,
  optional,
  twoSlots,
}: {
  title: string;
  subtitle: string;
  iconName: keyof typeof MaterialIcons.glyphMap;
  optional?: boolean;
  twoSlots?: boolean;
}) {
  return (
    <View className="flex-col gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/50 shadow-sm">
      <View className="flex-row justify-between items-start">
        <View className="flex-col gap-1 flex-1">
          <View className="flex-row items-center gap-2">
            <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">{title}</Text>
            {optional && (
              <View className="px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800">
                <Text className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">Optional</Text>
              </View>
            )}
          </View>
          <Text className="text-slate-500 dark:text-slate-400 text-xs font-normal">{subtitle}</Text>
        </View>
        <View className="bg-primary/10 p-2 rounded-lg">
          <MaterialIcons name={iconName} size={20} color="#359EFF" />
        </View>
      </View>

      {twoSlots ? (
        <View className="flex-row gap-3">
          {["Upload Front View", "Upload Back View"].map((label) => (
            <Pressable
              key={label}
              className="flex-1 aspect-square bg-slate-50 dark:bg-slate-800 rounded-lg border-2 border-dashed border-slate-200 dark:border-slate-700 items-center justify-center gap-2"
            >
              <MaterialIcons name="cloud-upload" size={24} color="#94a3b8" />
              <Text className="text-slate-500 dark:text-slate-400 text-[10px] font-medium text-center">{label}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <Pressable className="flex-row items-center justify-center gap-2 h-12 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <MaterialIcons name="add-circle" size={22} color="#64748b" />
          <Text className="text-slate-600 dark:text-slate-300 text-sm font-semibold">Add Document</Text>
        </Pressable>
      )}
    </View>
  );
}

export default function GuideProfileStep2() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 pt-2 pb-0">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#0f172a" />
        </Pressable>
        <Text className="text-slate-900 dark:text-slate-100 text-sm font-bold flex-1 text-center pr-10">
          Complete Profile
        </Text>
      </View>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Title */}
        <View className="px-4 pt-6 pb-2">
          <Text className="text-slate-900 dark:text-slate-100 text-2xl font-bold leading-tight">
            Verify Your Identity
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm font-normal leading-relaxed mt-2">
            Please upload the following documents to verify your profile.
          </Text>
        </View>

        {/* Upload cards */}
        <View className="flex-col gap-4 p-4">
          <UploadCard
            title="National ID or Passport"
            subtitle="Official government issued ID"
            iconName="contact-emergency"
            twoSlots
          />
          <UploadCard
            title="Guiding Certification"
            subtitle="Proof of professional qualification"
            iconName="workspace-premium"
            optional
          />
        </View>

        {/* Info notice */}
        <View className="px-4 py-4 flex-row gap-3 items-start">
          <MaterialIcons name="info" size={20} color="#359EFF" />
          <Text className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed flex-1">
            Your documents will be reviewed by our team. Approval usually takes up to 24 hours. We'll notify you via email once verified.
          </Text>
        </View>
      </ScrollView>

      {/* CTA */}
      <View
        className="p-4 flex-col gap-3"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.push("/(guide-setup)/confirmation")}
          className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-lg active:opacity-90"
          style={{ shadowColor: "#359EFF", shadowOpacity: 0.2 }}
        >
          <Text className="text-white text-base font-bold">Submit for Review</Text>
        </Pressable>
      </View>
    </View>
  );
}
