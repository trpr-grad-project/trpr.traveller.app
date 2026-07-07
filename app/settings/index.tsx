import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Switch,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

import { useAuth } from "@/context/AuthContext";
import BackButton from "@/components/BackButton";

const SECTIONS = [
  {
    title: "Account",
    items: [
      { icon: "person" as const, label: "Personal Information", route: "/settings/personal-information" },
      { icon: "lock" as const, label: "Change Password", route: "/settings/change-password" },
      { icon: "link" as const, label: "Linked Accounts", route: "/settings/linked-accounts" },
    ],
  },
  {
    title: "Preferences",
    items: [
      { icon: "language" as const, label: "Language", route: "/settings/language", value: "English" },
      { icon: "favorite-border" as const, label: "Travel Interests", route: "/settings/interests" },
    ],
  },
  {
    title: "Content",
    items: [
      { icon: "place" as const, label: "My Places", route: "/settings/my-places" },
    ],
  },
  {
    title: "Notifications",
    toggle: true,
    items: [
      { icon: "flight" as const, label: "Trip Updates", key: "tripUpdates" as const },
      { icon: "chat" as const, label: "Messages", key: "messages" as const },
      { icon: "campaign" as const, label: "Promotions", key: "promotions" as const },
    ],
  },
  {
    title: "Privacy & Security",
    items: [
      { icon: "block" as const, label: "Blocked users", route: "/settings/blocked-users" },
      { icon: "delete-forever" as const, label: "Delete account", route: "/settings/delete-account", destructive: true },
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
    title: "Support",
    items: [
      { icon: "help" as const, label: "Help Center", route: "/settings/help-center" },
      { icon: "mail-outline" as const, label: "Contact Support", route: "/settings/contact-support" },
      { icon: "report-problem" as const, label: "Report a problem", route: "/settings/report-problem" },
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
  const [toggles, setToggles] = useState({ tripUpdates: true, messages: true, promotions: false });

  const toggleSwitch = (key: keyof typeof toggles) => {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  };

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
                      if (!section.toggle && "route" in item && item.route) {
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
                    {"value" in item && item.value && (
                      <Text className="text-xs font-medium text-sub-dark mr-1">{item.value}</Text>
                    )}
                    {section.toggle && "key" in item ? (
                      <Switch
                        value={toggles[item.key as keyof typeof toggles]}
                        onValueChange={() => toggleSwitch(item.key as keyof typeof toggles)}
                        trackColor={{ false: "#d1d5db", true: "#359EFF80" }}
                        thumbColor={toggles[item.key as keyof typeof toggles] ? "#359EFF" : "#f4f3f4"}
                      />
                    ) : (
                      <MaterialIcons name="chevron-right" size={20} color="#94a3b8" />
                    )}
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
