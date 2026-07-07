import React from "react";
import {
  Appearance,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";
import { saveColorScheme } from "@/utils/storage";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "person" as const, label: "Personal Information", route: "/settings/personal-information" },
      { icon: "lock" as const, label: "Change Password", route: "/settings/change-password" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "language" as const, label: "Language", route: "/settings/language" },
      { icon: "favorite-border" as const, label: "Travel Interests", route: "/settings/interests" },
      { icon: "dark-mode" as const, label: "Dark Mode", key: "darkMode" as const },
    ],
  },
  {
    title: "Content",
    items: [
      { icon: "place" as const, label: "My Places", route: "/settings/my-places" },
    ],
  },
  {
    title: "Payments",
    items: [
      { icon: "credit-card" as const, label: "My Card", route: "/settings/my-card" },
      { icon: "receipt-long" as const, label: "Billing history", route: "/settings/billing-history" },
    ],
  },
  {
    title: "Legal",
    items: [
      { icon: "description" as const, label: "Terms & Conditions", route: "/legal/terms-and-conditions" },
      { icon: "privacy-tip" as const, label: "Privacy Policy", route: "/legal/privacy-policy" },
    ],
  },
];

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { signOut } = useAuth();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white text-center mr-10">Settings</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {SECTIONS.map((section) => (
          <View key={section.title} className="px-4 mb-6">
            <Text className="px-2 text-xs font-bold text-sub-light uppercase tracking-widest mb-3">
              {section.title}
            </Text>
            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm">
              {section.items.map((item, iIdx) => {
                const isLast = iIdx === section.items.length - 1;
                return (
                  <Pressable
                    key={item.label}
                    onPress={() => {
                      if ("key" in item && item.key === "darkMode") {
                        const next = colorScheme === "dark" ? "light" : "dark";
                        Appearance.setColorScheme(next);
                        saveColorScheme(next);
                      } else if ("route" in item && item.route) {
                        router.push(item.route as any);
                      }
                    }}
                    className={`flex-row items-center px-4 py-3.5 gap-3 ${
                      !isLast ? "border-b border-neutral-light dark:border-neutral-dark" : ""
                    }`}
                  >
                    <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                      <MaterialIcons
                        name={item.icon}
                        size={18}
                        color={"destructive" in item && item.destructive ? "#ef4444" : "#359EFF"}
                      />
                    </View>
                    <Text
                      className={`flex-1 text-sm font-semibold ${
                        "destructive" in item && item.destructive
                          ? "text-red-500"
                          : "text-main-light dark:text-white"
                      }`}
                    >
                      {item.label}
                    </Text>
                    {"key" in item && item.key === "darkMode" ? (
                      <Text className="text-xs font-medium text-sub-dark mr-1">
                        {colorScheme === "dark" ? "On" : "Off"}
                      </Text>
                    ) : "value" in item && item.value ? (
                      <Text className="text-xs font-medium text-sub-dark mr-1">{item.value}</Text>
                    ) : null}
                    <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}

        <Pressable
          onPress={signOut}
          className="mx-4 flex-row items-center justify-center gap-2 py-4 rounded-xl border border-red-200 dark:border-red-900 active:bg-red-50 dark:active:bg-red-900/20"
        >
          <MaterialIcons name="logout" size={20} color="#ef4444" />
          <Text className="text-red-500 font-bold">Log Out</Text>
        </Pressable>

        <View className="h-8" />
      </ScrollView>
    </View>
  );
}
