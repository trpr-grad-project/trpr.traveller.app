import { useProfileFormData } from "@/context/ProfileFormDataContext";
import { useOnboardingSelections } from "@/context/OnboardingSelectionsContext";
import BackButton from "@/components/BackButton";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

// Fallback icon map for common interest names
const ICON_MAP: Record<string, string> = {
  history: "account-balance",
  adventure: "hiking",
  nature: "terrain",
  culture: "theater-comedy",
  foodie: "restaurant",
  wellness: "spa",
  romantic: "favorite",
  food: "restaurant",
};

function getIcon(name: string): string {
  return ICON_MAP[name.toLowerCase()] ?? "star";
}

const InterestItem = React.memo(function InterestItem({ item, isSelected, onPress }: { item: any, isSelected: boolean, onPress: (id: number) => void }) {
  return (
    <Pressable
      onPress={() => onPress(item.id)}
      className="relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 active:scale-[0.98]"
      style={{
        width: "47%",
        aspectRatio: 1,
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
          <MaterialIcons
            name="check-circle"
            size={20}
            color="#359EFF"
          />
        </View>
      )}

      <View className="bg-gray-50 dark:bg-gray-800 rounded-full p-4 mb-3">
        <MaterialIcons
          name={getIcon(item.name) as any}
          size={32}
          color={isSelected ? "#359EFF" : "#1A1A1A"}
        />
      </View>

      <Text className="text-[#1A1A1A] dark:text-white text-sm font-semibold">
        {item.name}
      </Text>
    </Pressable>
  );
});

export default function InterestsSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { interests, isLoading, error } = useProfileFormData();
  const { interestIds: selectedIds, setInterestIds } = useOnboardingSelections();
  const [continueError, setContinueError] = React.useState<string | null>(null);
  const navigating = React.useRef(false);

  useFocusEffect(React.useCallback(() => { navigating.current = false; }, []));

  const toggleInterest = React.useCallback((id: number) => {
    setContinueError(null);
    setInterestIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  }, [setInterestIds]);

  const handleContinue = React.useCallback(() => {
    if (navigating.current) return;
    if (selectedIds.length === 0) {
      setContinueError("Please select at least one interest to continue.");
      return;
    }
    navigating.current = true;
    router.push("/(onboarding)/vibeSelection");
  }, [selectedIds]);

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4">
        <BackButton />
        <View className="px-4 pt-2">
          <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight mb-2">
            What are you interested in?
          </Text>
          <Text className="text-[#828282] dark:text-gray-400 text-sm leading-relaxed">
            Select your interests to help us personalize your travel
            recommendations.
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
              Failed to load interests.{"\n"}Please try again.
            </Text>
          </View>
        ) : (
          <View className="flex-row flex-wrap gap-4 max-w-md mx-auto">
            {interests.map((item) => (
              <InterestItem
                key={item.id}
                item={item}
                isSelected={selectedIds.includes(item.id)}
                onPress={toggleInterest}
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
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          {continueError && (
            <Text className="mb-3 text-center text-sm text-red-500">
              {continueError}
            </Text>
          )}

          <Pressable
            onPress={handleContinue}
            disabled={selectedIds.length === 0}
            className="flex w-full items-center justify-center rounded-2xl disabled:opacity-50 h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-[20px] font-semibold">
              Continue
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
