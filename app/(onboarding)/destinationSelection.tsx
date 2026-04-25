import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

const POPULAR_DESTINATIONS = ["Cairo", "Luxor", "Alexandria", "Aswan", "Sharm El-Sheikh", "Hurghada", "Siwa"];

export default function DestinationSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");
  const [selectedDestinations, setSelectedDestinations] = useState<string[]>(["Alexandria", "Aswan"]);

  const toggleDestination = (name: string) => {
    if (selectedDestinations.includes(name)) {
      setSelectedDestinations(selectedDestinations.filter((d) => d !== name));
    } else {
      setSelectedDestinations([...selectedDestinations, name]);
    }
  };

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16 }} className="px-6 pb-4">
        <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight mb-2">
          Where do you want to go?
        </Text>
        <Text className="text-[#828282] dark:text-gray-400 text-sm leading-relaxed">
          This helps us show more relevant content.
        </Text>
      </View>

      <ScrollView className="flex-1 px-6 pt-4" contentContainerStyle={{ paddingBottom: 150 }}>
        <View className="max-w-md mx-auto w-full space-y-8">
          {/* Search Bar */}
          <View className="relative">
            <View className="absolute inset-y-0 left-4 z-10 flex items-center justify-center">
              <MaterialIcons name="search" size={24} color="#9ca3af" />
            </View>
            <TextInput
              className="w-full bg-gray-50 dark:bg-neutral-dark rounded-2xl py-4 pl-12 pr-4 text-[#1A1A1A] dark:text-white text-base border border-transparent focus:border-primary/20"
              placeholder="Search cities or countries"
              placeholderTextColor="#9ca3af"
              value={search}
              onChangeText={setSearch}
            />
          </View>

          {/* Suggestions */}
          <View className="mt-8">
            <Text className="text-[#1A1A1A] dark:text-white font-bold text-lg mb-4">
              Popular Suggestions
            </Text>
            <View className="flex-row flex-wrap gap-3">
              {POPULAR_DESTINATIONS.map((city) => {
                const isSelected = selectedDestinations.includes(city);
                return (
                  <Pressable
                    key={city}
                    onPress={() => toggleDestination(city)}
                    className={`px-5 py-2.5 rounded-full border transition-all active:scale-95 ${
                      isSelected
                        ? "border-primary bg-primary"
                        : "border-[#E0E0E0] dark:border-gray-700 bg-white dark:bg-neutral-dark"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        isSelected ? "text-white" : "text-[#1A1A1A] dark:text-white"
                      }`}
                    >
                      {city}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>
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
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          <Pressable
            onPress={() => router.push("/(onboarding)/locationPermission")}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-[20px] font-semibold">Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
