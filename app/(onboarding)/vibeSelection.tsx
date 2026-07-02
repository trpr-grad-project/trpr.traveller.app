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

// Map vibe name to a Material icon
function vibeIcon(name: string): string {
  const map: Record<string, string> = {
    solo: "person",
    friends: "group",
    romantic: "favorite",
    family: "family-restroom",
  };
  return map[name.toLowerCase()] ?? "star";
}

// Per-vibe accent colour for the thumbnail tint
function vibeAccent(id: number): string {
  const colours = ["#359EFF", "#f97316", "#ec4899", "#22c55e"];
  return colours[(id - 1) % colours.length];
}

const VibeItem = React.memo(function VibeItem({ vibe, isSelected, onPress }: { vibe: any, isSelected: boolean, onPress: (id: number) => void }) {
  return (
    <Pressable
      onPress={() => onPress(vibe.id)}
      className="active:scale-[0.98]"
      style={{
        borderRadius: 24,
        overflow: "hidden",
        borderWidth: 2.5,
        borderColor: isSelected ? "#359EFF" : "transparent",
        shadowColor: isSelected ? "#359EFF" : "#000",
        shadowOffset: { width: 0, height: isSelected ? 8 : 4 },
        shadowOpacity: isSelected ? 0.25 : 0.08,
        shadowRadius: 16,
        elevation: isSelected ? 8 : 3,
      }}
    >
      {/* Thumbnail area */}
      <View
        style={{
          height: 140,
          backgroundColor: "#f3f4f6",
          overflow: "hidden",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Coloured tint per vibe */}
        <View
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: vibeAccent(vibe.id),
            opacity: 0.15,
          }}
        />
        <MaterialIcons
          name={vibeIcon(vibe.name) as any}
          size={56}
          color={isSelected ? "#359EFF" : "#9ca3af"}
        />

        {/* Selected badge */}
        {isSelected && (
          <View
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              backgroundColor: "#359EFF",
              borderRadius: 20,
              padding: 4,
            }}
          >
            <MaterialIcons name="check" size={16} color="white" />
          </View>
        )}
      </View>

      {/* Label row */}
      <View
        style={{
          backgroundColor: "white",
          paddingHorizontal: 16,
          paddingVertical: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: "700",
              color: isSelected ? "#359EFF" : "#1A1A1A",
              marginBottom: 2,
            }}
          >
            {vibe.name}
          </Text>
          <Text
            style={{
              fontSize: 12,
              color: "#828282",
              lineHeight: 18,
            }}
            numberOfLines={2}
          >
            {vibe.description}
          </Text>
        </View>

        <View
          style={{
            marginLeft: 12,
            width: 28,
            height: 28,
            borderRadius: 14,
            borderWidth: 2,
            borderColor: isSelected ? "#359EFF" : "#E0E0E0",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: isSelected ? "#359EFF" : "transparent",
          }}
        >
          {isSelected && (
            <MaterialIcons name="check" size={16} color="white" />
          )}
        </View>
      </View>
    </Pressable>
  );
});

export default function VibeSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { vibes, isLoading, error } = useProfileFormData();
  const { submitProfile, isSubmitting } = useOnboardingSelections();
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = React.useCallback((id: number) => {
    setSelectedId(id);
  }, []);

  const navigating = useRef(false);

  useFocusEffect(React.useCallback(() => { navigating.current = false; }, []));

  const handleContinue = useCallback(async () => {
    if (!selectedId || isSubmitting || navigating.current) return;
    navigating.current = true;
    try {
      await submitProfile(selectedId);
      router.push("/(onboarding)/locationPermission");
    } catch (err) {
      navigating.current = false;
      Toast.show({
        type: "error",
        text1: "Error",
        text2: getErrorMessage(err, "Failed to save your vibe. Please try again."),
      });
    }
  }, [selectedId, isSubmitting, submitProfile]);

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
            Choose the experience that best describes your trip.
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: 160 }}
        showsVerticalScrollIndicator={false}
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
          <View className="gap-4 max-w-md mx-auto w-full">
            {vibes.map((vibe) => (
              <VibeItem
                key={vibe.id}
                vibe={vibe}
                isSelected={selectedId === vibe.id}
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
          {/* Progress Dots — step 4 of 5 */}
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          <Pressable
            disabled={!selectedId || isSubmitting}
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


