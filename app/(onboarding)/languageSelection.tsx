import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const LANGUAGES = [
  { id: "en", name: "English (US)", sub: "Standard English", flag: "🇺🇸" },
  { id: "ar", name: "Arabic (العربية)", sub: "Middle East", flag: "🇸🇦" },
  { id: "fr", name: "French (Français)", sub: "Europe", flag: "🇫🇷" },
  { id: "es", name: "Spanish (Español)", sub: "Latin America", flag: "🇪🇸" },
  { id: "de", name: "German (Deutsch)", sub: "Europe", flag: "🇩🇪" },
];

export default function LanguageSelectionScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("en");

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Header */}
      <View style={{ paddingTop: insets.top + 16 }} className="px-6 pb-4">
        <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight text-center">
          Select Your Language
        </Text>
      </View>

      <ScrollView className="flex-1 px-5 pt-2" contentContainerStyle={{ paddingBottom: 120 }}>
        <View className="gap-4 max-w-md mx-auto w-full">
          {LANGUAGES.map((lang) => (
            <Pressable
              key={lang.id}
              onPress={() => setSelected(lang.id)}
              className={`flex-row items-center gap-4 rounded-xl border-2 p-4 active:scale-[0.98] transition-all ${
                selected === lang.id
                  ? "border-primary bg-white dark:bg-neutral-dark"
                  : "border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark"
              }`}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.05,
                shadowRadius: 12,
                elevation: 2,
              }}
            >
              <View className="size-12 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
                <Text className="text-2xl">{lang.flag}</Text>
              </View>
              
              <View className="flex-1">
                <Text className="text-[#1A1A1A] dark:text-white text-base font-semibold">
                  {lang.name}
                </Text>
                <Text className="text-[#828282] dark:text-gray-400 text-xs font-normal">
                  {lang.sub}
                </Text>
              </View>

              <View 
                className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
                  selected === lang.id ? "border-primary" : "border-[#E0E0E0] dark:border-gray-600"
                }`}
              >
                {selected === lang.id && (
                  <View className="h-3 w-3 rounded-full bg-primary" />
                )}
              </View>
            </Pressable>
          ))}
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
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          <Pressable
            onPress={() => router.push("/(onboarding)/interestsSelection")}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-[20px] font-bold">Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
