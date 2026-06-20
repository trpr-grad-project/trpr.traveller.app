import React from "react";
import { Slot } from "expo-router";
import { useColorScheme } from "nativewind";
import { StatusBar, View } from "react-native";

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      <Slot />
    </View>
  );
}
