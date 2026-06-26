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

const THEMES = [
  { id: "system", label: "System Default", icon: "phone-android" as const, desc: "Follow your device theme" },
  { id: "light", label: "Light Mode", icon: "light-mode" as const, desc: "Always use light theme" },
  { id: "dark", label: "Dark Mode", icon: "dark-mode" as const, desc: "Always use dark theme" },
];

export default function ThemeScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState("system");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Appearance</Text>
      </View>

      <View className="p-4">
        <Text className="text-xs font-bold text-sub-light uppercase tracking-widest mb-4 ml-1">
          Color Theme
        </Text>
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm">
          {THEMES.map((theme, i) => (
            <Pressable
              key={theme.id}
              onPress={() => setSelected(theme.id)}
              className={`flex-row items-center px-4 py-4 gap-4 ${
                i !== THEMES.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${
                selected === theme.id ? "bg-primary" : "bg-background-light dark:bg-background-dark"
              }`}>
                <MaterialIcons name={theme.icon} size={20} color={selected === theme.id ? "white" : "#64748b"} />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-main-light dark:text-white">{theme.label}</Text>
                <Text className="text-xs text-sub-light mt-0.5">{theme.desc}</Text>
              </View>
              <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
                selected === theme.id ? "border-primary" : "border-gray-300 dark:border-gray-600"
              }`}>
                {selected === theme.id && (
                  <View className="w-3 h-3 rounded-full bg-primary" />
                )}
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </View>
  );
}
