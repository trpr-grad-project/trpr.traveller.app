import React, { useCallback, useState } from "react";
import { ActivityIndicator, Pressable, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import * as Location from "expo-location";

export default function LocationPermissionScreen() {
  const insets = useSafeAreaInsets();
  const [requesting, setRequesting] = useState(false);

  const handleAllow = useCallback(async () => {
    if (requesting) return;
    setRequesting(true);
    await Location.requestForegroundPermissionsAsync();
    router.push("/(onboarding)/completion");
  }, [requesting]);

  const handleSkip = useCallback(() => {
    router.push("/(onboarding)/completion");
  }, []);

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Main illustration area */}
      <View className="flex-1 items-center justify-center px-8 pt-12">
        {/* Map card illustration */}
        <View className="relative w-72 h-72 mb-12 items-center justify-center">
          {/* Rotated BG layers */}
          <View className="absolute inset-0 bg-blue-50 dark:bg-blue-900/10 rounded-[40px] rotate-6 opacity-50" />
          <View className="absolute inset-0 bg-blue-100 dark:bg-blue-900/20 rounded-[40px] -rotate-3 opacity-30" />

          {/* Main card */}
          <View className="relative w-full h-full bg-white dark:bg-neutral-dark rounded-[40px] shadow-2xl items-center justify-center border border-gray-50 dark:border-gray-800 overflow-hidden">
            {/* Grid lines */}
            <View className="absolute inset-0 opacity-10">
              {[20, 50, 80].map((pos) => (
                <View
                  key={`h-${pos}`}
                  className="absolute left-0 right-0 h-px bg-gray-400"
                  style={{ top: `${pos}%` }}
                />
              ))}
              {[20, 50, 80].map((pos) => (
                <View
                  key={`v-${pos}`}
                  className="absolute top-0 bottom-0 w-px bg-gray-400"
                  style={{ left: `${pos}%` }}
                />
              ))}
            </View>

            {/* Center location pin */}
            <View className="z-10 items-center">
              <View className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-xl shadow-primary/40">
                <MaterialIcons name="location-on" size={48} color="white" />
              </View>
              <View className="mt-4 w-12 h-3 bg-black/5 dark:bg-white/5 rounded-full" />
            </View>

            {/* Decorative POI badges */}
            <View className="absolute top-8 right-8 w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg items-center justify-center">
              <MaterialIcons name="castle" size={18} color="#f97316" />
            </View>
            <View className="absolute bottom-12 left-8 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full items-center justify-center">
              <MaterialIcons name="park" size={22} color="#22c55e" />
            </View>
          </View>
        </View>

        {/* Text content */}
        <View className="max-w-md w-full text-center items-center">
          <Text className="text-[#1A1A1A] dark:text-white text-[28px] font-bold tracking-tight mb-4 text-center">
            Enable Your Location
          </Text>
          <Text className="text-[#828282] dark:text-gray-400 text-base leading-relaxed text-center px-4">
            We need your location to find the best trip plans, local guides, and
            nearby ancient monuments for you.
          </Text>
        </View>
      </View>

      {/* Footer actions */}
      <View
        className="p-8 w-full max-w-md mx-auto items-center"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Dots */}
        <View className="flex-row items-center gap-2 mb-8">
          <View className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <View className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <View className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <View className="w-2 h-2 rounded-full bg-gray-200 dark:bg-gray-700" />
          <View className="w-6 h-2 rounded-full bg-primary" />
        </View>

        <View className="w-full gap-4">
          <Pressable
            onPress={handleAllow}
            disabled={requesting}
            className="w-full h-[58px] bg-primary items-center justify-center rounded-2xl shadow-lg active:opacity-90 disabled:opacity-70"
            style={{ shadowColor: "#359EFF", shadowOpacity: 0.25 }}
          >
            {requesting ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white text-[17px] font-semibold">
                Allow Location Access
              </Text>
            )}
          </Pressable>

          <Pressable onPress={handleSkip} className="items-center justify-center h-12 active:opacity-60">
            <Text className="text-[#828282] dark:text-gray-400 text-[17px] font-medium">
              Not Now
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
