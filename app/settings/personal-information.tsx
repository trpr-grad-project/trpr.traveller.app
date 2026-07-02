import React from "react";
import {
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import { useProfile } from "@/context/ProfileContext";

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();
  const { profile } = useProfile();

  const firstName = user?.firstName ?? "";
  const lastName = user?.lastName ?? "";
  const initial = firstName.charAt(0).toUpperCase();
  const email = user?.email ?? "";
  const bio = profile?.bio ?? "";

  const FIELDS = [
    { label: "Full Name", value: `${firstName} ${lastName}`, icon: "person" as const },
    { label: "Email", value: email, icon: "mail" as const },
    { label: "Bio", value: bio || "No bio yet", icon: "info" as const },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Personal Information</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="items-center py-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full bg-primary items-center justify-center border-4 border-white dark:border-neutral-dark shadow-lg">
              <Text className="text-4xl font-bold text-white">{initial}</Text>
            </View>
          </View>
        </View>

        <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
          {FIELDS.map((field, i, arr) => (
            <View
              key={field.label}
              className={`px-4 py-4 ${
                i !== arr.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">
                {field.label}
              </Text>
              <View className="flex-row items-center gap-2">
                <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                  <MaterialIcons name={field.icon} size={18} color="#64748b" />
                </View>
                <Text className="flex-1 text-sm font-medium text-main-light dark:text-white">
                  {field.value}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
