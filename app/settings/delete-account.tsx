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

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [checked, setChecked] = useState(false);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Delete Account</Text>
      </View>

      <View className="flex-1 px-6 justify-center">
        <View className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 items-center justify-center self-center mb-6">
          <MaterialIcons name="error-outline" size={40} color="#ef4444" />
        </View>

        <Text className="text-2xl font-bold text-main-light dark:text-white text-center mb-3">
          Are you sure you want to leave?
        </Text>
        <Text className="text-sm text-sub-light text-center leading-relaxed mb-8 max-w-sm mx-auto">
          This action is irreversible. All your personal data, trip history, messages, and account information will be permanently deleted from our servers.
        </Text>

        <Pressable
          onPress={() => setChecked(!checked)}
          className="flex-row items-start gap-3 mb-10 max-w-sm mx-auto"
        >
          <View
            className={`w-6 h-6 rounded-md border-2 items-center justify-center mt-0.5 ${
              checked
                ? "bg-red-500 border-red-500"
                : "border-gray-300 dark:border-gray-600"
            }`}
          >
            {checked && <MaterialIcons name="check" size={16} color="white" />}
          </View>
          <Text className="flex-1 text-sm font-medium text-main-light dark:text-white leading-relaxed">
            I understand that all my data will be permanently deleted.
          </Text>
        </Pressable>

        <Pressable
          className={`w-full h-14 rounded-xl items-center justify-center mb-3 max-w-sm mx-auto ${
            checked ? "bg-red-500" : "bg-red-300"
          }`}
          disabled={!checked}
        >
          <Text className="text-white font-bold text-base">Delete Account</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="w-full h-14 rounded-xl items-center justify-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark max-w-sm mx-auto"
        >
          <Text className="text-main-light dark:text-white font-bold text-base">Keep My Account</Text>
        </Pressable>
      </View>
    </View>
  );
}
