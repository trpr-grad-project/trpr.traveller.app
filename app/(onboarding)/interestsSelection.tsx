import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const INTERESTS = [
  { id: "history", name: "History", icon: "account-balance", type: "material" },
  { id: "food", name: "Food", icon: "restaurant", type: "material" },
  { id: "adventure", name: "Adventure", icon: "hiking", type: "material" },
  { id: "nature", name: "Nature", icon: "terrain", type: "material" },
  { id: "culture", name: "Culture", icon: "theater-comedy", type: "material" },
  { id: "wellness", name: "Wellness", icon: "spa", type: "material" },
  { id: "romantic", name: "Romantic", icon: "favorite", type: "material" },
];

export default function InterestsSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [selectedInterests, setSelectedInterests] = useState<string[]>(["history", "adventure"]);

  const toggleInterest = (id: string) => {
    if (selectedInterests.includes(id)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== id));
    } else {
      setSelectedInterests([...selectedInterests, id]);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16 }} className="px-6 pb-4">
        <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight mb-2">
          What are you interested in?
        </Text>
        <Text className="text-[#828282] dark:text-gray-400 text-sm leading-relaxed">
          Select your interests to help us personalize your travel recommendations.
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="flex-row flex-wrap gap-4 max-w-md mx-auto">
          {INTERESTS.map((item) => {
            const isSelected = selectedInterests.includes(item.id);
            return (
              <Pressable
                key={item.id}
                onPress={() => toggleInterest(item.id)}
                className={`relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 active:scale-[0.98] transition-all`}
                style={{
                  width: "47%", // Rough approximation for grid-cols-2
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
                    name={item.icon as any} 
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

          <Pressable
            onPress={() => router.push("/(onboarding)/destinationSelection")}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-[20px] font-semibold">Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
