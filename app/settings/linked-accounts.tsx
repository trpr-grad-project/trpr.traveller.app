import React from "react";
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

const ACCOUNTS = [
  { name: "Google", icon: "Google", connected: true },
  { name: "Apple", icon: "Apple", connected: true },
  { name: "Facebook", icon: "Facebook", connected: false },
];

export default function LinkedAccountsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Linked Accounts</Text>
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
              <Text className="flex-1 text-sm font-bold text-main-light dark:text-white">{acct.name}</Text>
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

      <View className="px-4 mt-6">
        <View className="flex-row items-start gap-2 opacity-60">
          <MaterialIcons name="info-outline" size={16} color="#64748b" style={{ marginTop: 1 }} />
          <Text className="text-xs text-sub-light leading-relaxed flex-1">
            Linking your accounts makes sign-in faster and helps us personalize your experience. We never post without your permission.
          </Text>
        </View>
      </View>
    </View>
  );
}
