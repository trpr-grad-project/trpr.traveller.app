import { ImageBackground, Text, View, type  NativeSyntheticEvent  } from "react-native";
import React, { useCallback } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import DarkModeToggle from "../DarkModeToggle";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { usePathname, useRouter } from "expo-router";

export default function AuthHeader() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const router = useRouter();
  const selectedIndex = pathname.endsWith("/register") ? 1 : 0;

  // Set selected index based on current route
  const handleSegmentChange = useCallback(
    (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
      const index = event.nativeEvent.selectedSegmentIndex;
      router.replace(index === 0 ? "/(auth)/login" : "/(auth)/register");
    },
    [router],
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
          {/* Temporary dark mode button */}
          <View
            className="absolute right-6 z-50"
            style={{ top: insets.top + 8 }}
          >
            <DarkModeToggle />
          </View>

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
          selectedIndex={selectedIndex}
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
