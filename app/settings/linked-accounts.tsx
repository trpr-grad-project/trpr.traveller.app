import React from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const ACCOUNTS = [
  { name: "Google", icon: "Google", connected: true },
  { name: "Apple", icon: "Apple", connected: true },
  { name: "Facebook", icon: "Facebook", connected: false },
];

export default function LinkedAccountsScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Linked Accounts</Text>
      </View>

      <View className="px-4 mt-2 gap-3">
        {ACCOUNTS.map((acct) => (
          <View
            key={acct.name}
            className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-4 shadow-sm"
          >
            <View className="flex-row items-center gap-3">
              <View className="w-11 h-11 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                <MaterialIcons
                  name={acct.name === "Google" ? "g-mobiledata" : acct.name === "Apple" ? "apple" : "facebook"}
                  size={22}
                  color="#0d1b1b"
                />
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0d1b1b] dark:text-white">{acct.name}</Text>
              {acct.connected ? (
                <View className="flex-row items-center gap-3">
                  <View className="flex-row items-center gap-1">
                    <View className="w-2 h-2 rounded-full bg-green-500" />
                    <Text className="text-xs font-medium text-green-500">Connected</Text>
                  </View>
                  <Pressable className="px-4 py-2 rounded-lg border border-red-200 dark:border-red-900">
                    <Text className="text-xs font-bold text-red-500">Unlink</Text>
                  </Pressable>
                </View>
              ) : (
                <Pressable className="px-4 py-2 rounded-lg bg-primary/10 border border-primary/20">
                  <Text className="text-xs font-bold text-primary">Link Account</Text>
                </Pressable>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Footer info */}
      <View className="px-4 mt-6">
        <View className="flex-row items-start gap-2 opacity-60">
          <MaterialIcons name="info-outline" size={16} color="#4c9a9a" style={{ marginTop: 1 }} />
          <Text className="text-xs text-[#4c9a9a] leading-relaxed flex-1">
            Linking your accounts makes sign-in faster and helps us personalize your experience. We never post without your permission.
          </Text>
        </View>
      </View>
    </View>
  );
}
