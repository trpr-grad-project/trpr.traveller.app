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

export default function DeleteAccountScreen() {
  const insets = useSafeAreaInsets();
  const [checked, setChecked] = useState(false);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Delete Account</Text>
      </View>

      <View className="flex-1 px-6 justify-center">
        {/* Error Icon */}
        <View className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 items-center justify-center self-center mb-6">
          <MaterialIcons name="error-outline" size={40} color="#ef4444" />
        </View>

        {/* Heading */}
        <Text className="text-2xl font-bold text-[#0d1b1b] dark:text-white text-center mb-3">
          Are you sure you want to leave?
        </Text>
        <Text className="text-sm text-[#4c9a9a] text-center leading-relaxed mb-8">
          This action is irreversible. All your personal data, trip history, messages, and account information will be permanently deleted from our servers.
        </Text>

        {/* Checkbox */}
        <Pressable
          onPress={() => setChecked(!checked)}
          className="flex-row items-start gap-3 mb-10"
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
          <Text className="flex-1 text-sm font-medium text-[#0d1b1b] dark:text-white leading-relaxed">
            I understand that all my data will be permanently deleted.
          </Text>
        </Pressable>

        {/* Buttons */}
        <Pressable
          className={`w-full h-14 rounded-xl items-center justify-center mb-3 ${
            checked ? "bg-red-500" : "bg-red-300"
          }`}
          disabled={!checked}
        >
          <Text className="text-white font-bold text-base">Delete Account</Text>
        </Pressable>
        <Pressable
          onPress={() => router.back()}
          className="w-full h-14 rounded-xl items-center justify-center bg-white dark:bg-neutral-dark border border-neutral-light dark:border-neutral-dark"
        >
          <Text className="text-[#0d1b1b] dark:text-white font-bold text-base">Keep My Account</Text>
        </Pressable>
      </View>
    </View>
  );
}
