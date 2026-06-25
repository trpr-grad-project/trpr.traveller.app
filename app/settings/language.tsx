import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const LANGUAGES = [
  { flag: "🇺🇸", name: "English (US)", id: "en" },
  { flag: "🇪🇬", name: "Arabic (العربية)", id: "ar" },
  { flag: "🇫🇷", name: "French (Français)", id: "fr" },
  { flag: "🇪🇸", name: "Spanish (Español)", id: "es" },
  { flag: "🇩🇪", name: "German (Deutsch)", id: "de" },
];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState("en");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Language</Text>
      </View>

      {/* List */}
      <View className="mx-4 mt-2 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm">
        {LANGUAGES.map((lang, i) => {
          const isSelected = selected === lang.id;
          return (
            <Pressable
              key={lang.id}
              onPress={() => setSelected(lang.id)}
              className={`flex-row items-center px-4 py-4 gap-3 ${
                i !== LANGUAGES.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              <Text className="text-2xl">{lang.flag}</Text>
              <Text className="flex-1 text-sm font-semibold text-[#0d1b1b] dark:text-white">{lang.name}</Text>
              <View
                className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                  isSelected ? "border-primary" : "border-gray-300 dark:border-gray-600"
                }`}
              >
                {isSelected && <View className="w-3 h-3 rounded-full bg-primary" />}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* Apply Button */}
      <View className="flex-1 justify-end px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
          <Text className="text-white font-bold text-base">Apply Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}
