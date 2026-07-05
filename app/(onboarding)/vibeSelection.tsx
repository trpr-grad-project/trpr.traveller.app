import { useProfileFormData } from "@/context/ProfileFormDataContext";
import { useOnboardingSelections } from "@/context/OnboardingSelectionsContext";
import BackButton from "@/components/BackButton";
import { getErrorMessage } from "@/utils/errorHandler";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import Toast from "react-native-toast-message";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function vibeIcon(name: string): string {
  const map: Record<string, string> = {
    solo: "person",
    friends: "group",
    romantic: "favorite",
    family: "family-restroom",
  };
  return map[name.toLowerCase()] ?? "star";
}

const VibeItem = React.memo(function VibeItem({
  vibe,
  isSelected,
  onPress,
}: {
  vibe: any;
  isSelected: boolean;
  onPress: (id: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(vibe.id)}
      className="relative flex flex-col items-center rounded-2xl border-2 p-5 active:scale-[0.98]"
      style={{
        width: "47%",
        borderColor: isSelected ? "#359EFF" : "#E0E0E0",
        backgroundColor: "white",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      {isSelected && (
        <View className="absolute top-2 right-2">
          <MaterialIcons name="check-circle" size={20} color="#359EFF" />
        </View>
      )}

      <View className="bg-gray-50 dark:bg-gray-800 rounded-full p-4 mb-3">
        <MaterialIcons
          name={vibeIcon(vibe.name) as any}
          size={32}
          color={isSelected ? "#359EFF" : "#1A1A1A"}
        />
      </View>

      <Text className="text-[#1A1A1A] dark:text-white text-sm font-semibold text-center">
        {vibe.name}
      </Text>

      <Text
        className="text-[#828282] dark:text-gray-400 text-xs text-center mt-1"
        numberOfLines={2}
      >
        {vibe.description}
      </Text>
    </Pressable>
  );
});

export default function VibeSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { vibes, isLoading, error } = useProfileFormData();
  const { submitProfile, isSubmitting } = useOnboardingSelections();
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const handleSelect = React.useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id],
    );
  }, []);

  const navigating = useRef(false);

  useFocusEffect(React.useCallback(() => { navigating.current = false; }, []));

  const handleContinue = useCallback(async () => {
    if (selectedIds.length === 0 || isSubmitting || navigating.current) return;
    navigating.current = true;
    try {
      await submitProfile(selectedIds);
      router.push("/(onboarding)/locationPermission");
    } catch (err) {
      navigating.current = false;
      Toast.show({
        type: "error",
        text1: "Error",
        text2: getErrorMessage(err, "Failed to save your vibe. Please try again."),
      });
    }
  }, [selectedIds, isSubmitting, submitProfile]);

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4 items-start">
        <BackButton />
        <View className="px-4 pt-2">
          <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight mb-2">
            What&apos;s your travel vibe?
          </Text>
          <Text className="text-[#828282] dark:text-gray-400 text-sm leading-relaxed">
            Choose the experiences that describe your trip.
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#359EFF" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <MaterialIcons name="error-outline" size={40} color="#ef4444" />
            <Text className="text-[#828282] dark:text-gray-400 text-sm text-center">
              Failed to load vibes.{"\n"}Please try again.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4 max-w-md mx-auto">
            {vibes.map((vibe) => (
              <VibeItem
                key={vibe.id}
                vibe={vibe}
                isSelected={selectedIds.includes(vibe.id)}
                onPress={handleSelect}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="max-w-md mx-auto w-full items-center">
          {/* Progress Dots */}
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          <Pressable
            disabled={selectedIds.length === 0 || isSubmitting}
            onPress={handleContinue}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSubmitting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[20px] font-semibold">
                Continue
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
