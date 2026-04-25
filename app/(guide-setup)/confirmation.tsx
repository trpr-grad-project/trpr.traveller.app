import React, { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function GuideSetupConfirmation() {
  const insets = useSafeAreaInsets();
  const scaleAnim = new Animated.Value(0);
  const opacityAnim = new Animated.Value(0);

  React.useEffect(() => {
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 80,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark items-center justify-center px-8"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Success icon */}
      <Animated.View
        className="w-32 h-32 bg-primary/10 rounded-full items-center justify-center mb-8"
        style={{ transform: [{ scale: scaleAnim }] }}
      >
        <View className="w-20 h-20 bg-primary rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="check" size={44} color="white" />
        </View>
      </Animated.View>

      <Animated.View className="items-center" style={{ opacity: opacityAnim }}>
        <Text className="text-2xl font-bold text-slate-900 dark:text-white mb-3 text-center">
          Profile Submitted!
        </Text>
        <Text className="text-slate-500 dark:text-slate-400 text-base leading-relaxed text-center mb-10">
          Your profile has been submitted for review. Our team will verify your information within 24-48 hours.
        </Text>

        {/* Steps */}
        {[
          { label: "Profile submitted", done: true },
          { label: "Under review", done: false },
          { label: "Profile approved", done: false },
        ].map((step, i) => (
          <View key={i} className="flex-row items-center gap-3 mb-4 w-full">
            <View
              className={`w-8 h-8 rounded-full items-center justify-center ${
                step.done ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"
              }`}
            >
              {step.done ? (
                <MaterialIcons name="check" size={18} color="white" />
              ) : (
                <View className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
              )}
            </View>
            <Text
              className={`font-medium ${
                step.done
                  ? "text-slate-900 dark:text-white"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {step.label}
            </Text>
          </View>
        ))}
      </Animated.View>

      {/* Action */}
      <Pressable
        onPress={() => router.replace("/(guide-setup)/underReview")}
        className="w-full h-14 bg-primary rounded-xl items-center justify-center mt-10 shadow-lg active:opacity-90"
        style={{ shadowColor: "#359EFF", shadowOpacity: 0.25 }}
      >
        <Text className="text-white font-bold text-base">Continue</Text>
      </Pressable>
    </View>
  );
}
