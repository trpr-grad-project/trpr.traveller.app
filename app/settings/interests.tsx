import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import { useProfile } from "@/context/ProfileContext";
import { profileService } from "@/services";
import { ProfileInterest } from "@/types";

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

export default function InterestsScreen() {
  const insets = useSafeAreaInsets();
  const { interests: selectedInterests, updateProfile } = useProfile();
  const [availableInterests, setAvailableInterests] = useState<ProfileInterest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    selectedInterests.map((i) => i.id),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    profileService
      .getProfileSetupData()
      .then((data) => setAvailableInterests(data.interests ?? []))
      .catch(() => Toast.show({ type: "error", text1: "Failed to load interests" }))
      .finally(() => setIsLoading(false));
  }, []);

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = async () => {
    if (selectedIds.length === 0) return;
    setIsSaving(true);
    try {
      await updateProfile({ interestIds: selectedIds.map(String) });
      Toast.show({ type: "success", text1: "Interests updated" });
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Failed to update interests" });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4 items-start">
        <BackButton />
        <View className="px-4 pt-2">
          <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight mb-2">
            What are you interested in?
          </Text>
          <Text className="text-[#828282] dark:text-gray-400 text-sm leading-relaxed">
            Select your interests to help us personalize your travel recommendations.
          </Text>
        </View>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-4"
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
      >
        <View className="flex-row flex-wrap gap-4 max-w-md mx-auto">
          {availableInterests.map((item) => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggle(item.id)}
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
                    <MaterialIcons name="check-circle" size={20} color="#359EFF" />
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
          })}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="max-w-md mx-auto w-full">
          <Pressable
            onPress={handleSave}
            disabled={selectedIds.length === 0 || isSaving}
            className="flex w-full items-center justify-center rounded-2xl disabled:opacity-50 h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-[20px] font-semibold">
                Save ({selectedIds.length} selected)
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
