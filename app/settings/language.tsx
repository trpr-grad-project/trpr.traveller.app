import React, { useState } from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";

const LANGUAGES = [
  { flag: "🇺🇸", name: "English (US)", id: "en" },
  { flag: "🇪🇬", name: "Arabic (العربية)", id: "ar" },
  { flag: "🇫🇷", name: "French (Français)", id: "fr" },
  { flag: "🇪🇸", name: "Spanish (Español)", id: "es" },
  { flag: "🇩🇪", name: "German (Deutsch)", id: "de" },
];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState("en");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Language</Text>
      </View>

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
              <Text className="flex-1 text-sm font-semibold text-main-light dark:text-white">{lang.name}</Text>
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

      <View className="flex-1 justify-end px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton title="Apply Changes" onPress={() => {}} />
      </View>
    </View>
  );
}
