import { ImageBackground, Text, View, type NativeSyntheticEvent } from "react-native";
import React, { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

interface AuthHeaderProps {
  activeTab: "login" | "register";
  onTabChange: (tab: "login" | "register") => void;
}

export default function AuthHeader({ activeTab, onTabChange }: AuthHeaderProps) {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const handleSegmentChange = useCallback(
    (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
      const index = event.nativeEvent.selectedSegmentIndex;
      onTabChange(index === 0 ? "login" : "register");
    },
    [onTabChange],
  );

  return (
    <>
    {/* Hero Section */}
      <View className="relative h-72 w-full shrink-0 overflow-hidden">
        <ImageBackground
          source={require("@/assets/images/landscape.png")}
          className="absolute inset-0 z-0"
          resizeMode="cover"
        >
          {/* Overlay */}
          <View className="absolute inset-0 bg-[#003B46] opacity-40" />
          <View className="absolute inset-0 bg-primary opacity-60" />
        </ImageBackground>

        <LinearGradient
          colors={[
            "rgba(26, 43, 60, 0.2)",
            "transparent",
            isDark ? "#111f21" : "#f6f8f8",
          ]}
          className="absolute inset-0 z-10"
        />

        {/* Header Content */}
        <View className="relative z-20 flex h-full flex-col justify-end px-6 pb-6">
          {/* Logo and name */}
          <View className="mb-2 flex-row items-center gap-2">
            <MaterialIcons name="explore" size={32} color="#359EFF" />
            <Text className="text-3xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark">
              TouRA
            </Text>
          </View>

          <Text className="text-lg font-bold text-tagline-prominent dark:text-text-main-dark">
            Start your adventure today.
          </Text>
        </View>
      </View>

      {/* Segmented Control */}
      <View className="mt-4 mb-3 w-full px-6">
        <SegmentedControl
          values={["Log In", "Sign Up"]}
          selectedIndex={activeTab === "register" ? 1 : 0}
          onChange={handleSegmentChange}
          style={{ height: 45 }}
          backgroundColor={isDark ? "#1E2D2D" : "#E5E7EB"}
          tintColor={isDark ? "#2C3E3E" : "#FFFFFF"}
          fontStyle={{
            color: "#4F4F4F",
            fontSize: 12,
            fontWeight: "600",
          }}
          activeFontStyle={{
            color: "#359EFF",
            fontSize: 12,
            fontWeight: "600",
          }}
        />
      </View>
    </>
  );
}
