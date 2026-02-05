import DarkModeToggle from "@/components/DarkModeToggle";
import { MaterialIcons } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { LinearGradient } from "expo-linear-gradient";
import { Slot, usePathname, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useEffect, useState } from "react";
import { ImageBackground, Text, View } from "react-native";

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const pathname = usePathname();
  const router = useRouter();
  const [selectedIndex, setSelectedIndex] = useState(0);

  // Only apply this layout for the sign in / sign up forms
  const isAuthForm = pathname.includes("signIn") || pathname.includes("signUp");
  // Show the segmented toggle only when on signIn/signUp
  const showToggle = isAuthForm;

  // Sync selectedIndex with pathname
  useEffect(() => {
    setSelectedIndex(pathname.includes("signUp") ? 1 : 0);
  }, [pathname]);

  // Handle segment change with proper navigation timing
  const handleSegmentChange = (event: any) => {
    const index = event.nativeEvent.selectedSegmentIndex;
    setSelectedIndex(index);

    // Use setTimeout to defer navigation to next tick
    setTimeout(() => {
      if (index === 0) {
        router.replace("/(auth)/signIn");
      } else {
        router.replace("/(auth)/signUp");
      }
    }, 0);
  };

  // If we're on other auth routes (forgot password, otp, etc.), render a simple layout without header
  if (!isAuthForm) {
    return <Slot />;
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <View className="relative flex-1 w-full flex-col overflow-hidden">
        {/* Header Section with Background */}
        <View className="relative h-72 w-full shrink-0 overflow-hidden">
          <ImageBackground
            source={require("@/assets/images/landscape.png")}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              zIndex: 0,
            }}
            resizeMode="cover"
            imageStyle={{
              opacity: 0.8,
            }}
          >
            <View className="absolute inset-0 bg-[#003B46] opacity-30" />
            <View className="absolute inset-0 bg-primary opacity-60" />
          </ImageBackground>

          <LinearGradient
            colors={["rgba(26, 43, 60, 0.4)", "transparent", "transparent"]}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 10,
            }}
          />
          <LinearGradient
            colors={[
              "transparent",
              isDark ? "rgba(17, 31, 33, 0.4)" : "rgba(246, 248, 248, 0.4)",
              isDark ? "#111f21" : "#f6f8f8",
            ]}
            style={{
              width: "100%",
              height: "100%",
              position: "absolute",
              zIndex: 10,
            }}
          />

          <View className="relative z-20 flex h-full flex-col justify-end px-6 pb-6">
            <View className="absolute top-12 right-6 z-50">
              <DarkModeToggle />
            </View>
            <View className="mb-2 flex-row items-center gap-2">
              <MaterialIcons name="explore" size={32} color="#359EFF" />
              <Text className="text-3xl font-bold tracking-tight text-text-main-light dark:text-text-main-dark font-display">
                TripWhiz
              </Text>
            </View>
            <Text className="text-lg font-bold text-tagline-prominent dark:text-text-main-dark font-display">
              Start your adventure today.
            </Text>
          </View>
        </View>

        {/* Content Container */}
        <View className="flex flex-1 flex-col px-6 pt-2">
          {/* Segmented Control - Only show for signIn/signUp */}
          {showToggle && (
            <View className="mb-6 w-full">
              <SegmentedControl
                values={["Log In", "Sign Up"]}
                selectedIndex={selectedIndex}
                onChange={handleSegmentChange}
                style={{
                  height: 48,
                }}
                backgroundColor={isDark ? "#1E2D2D" : "#E5E7EB"}
                tintColor={isDark ? "#2C3E3E" : "#FFFFFF"}
                fontStyle={{
                  color: "#4F4F4F",
                  fontSize: 14,
                  fontWeight: "600",
                }}
                activeFontStyle={{
                  color: "#359EFF",
                  fontSize: 14,
                  fontWeight: "600",
                }}
              />
            </View>
          )}

          {/* Form Content Slot */}
          <Slot />
        </View>
      </View>
    </View>
  );
}
