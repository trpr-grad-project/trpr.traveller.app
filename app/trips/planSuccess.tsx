import React, { useState } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";

const SUCCESS_ANIM_VALUE = new Animated.Value(0);

export default function PlanSuccessScreen() {
  const insets = useSafeAreaInsets();
  const { tripName } = useLocalSearchParams<{ tripName?: string }>();
  const [scale] = React.useState(new Animated.Value(0));
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  React.useEffect(() => {
    Animated.spring(scale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  }, []);

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark flex-col"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Close button */}
      <View className="flex-row justify-end p-4 pt-6">
        <BackButton iconName="close" onPress={() => router.dismissAll()} />
      </View>

      {/* Main illustration + content */}
      <View className="flex-1 px-6 items-center text-center">
        {/* Illustration */}
        <Animated.View
          className="w-full max-w-[320px] items-center justify-center mb-8 relative"
          style={{ transform: [{ scale }] }}
        >
          <View className="absolute inset-0 bg-primary/5 rounded-full" />
          <View className="w-48 h-48 bg-primary/10 rounded-full items-center justify-center">
            <MaterialIcons name="celebration" size={120} color="#359EFF" />
          </View>
          {/* Confetti */}
          {["★", "🎉", "✦", "★", "●", "🎊"].map((emoji, i) => (
            <Text
              key={i}
              className="absolute text-2xl"
              style={{
                top: `${[15, 5, 25, 50, 75, 60][i]}%`,
                left: `${[10, 45, 75, 5, 20, 80][i]}%`,
                opacity: 0.6,
              }}
            >
              {emoji}
            </Text>
          ))}
        </Animated.View>

        {/* Text */}
        <Text className="text-[#0F172A] dark:text-white text-3xl font-bold leading-tight tracking-tight mb-4 text-center">
          Plan Created Successfully!
        </Text>
        <Text className="text-slate-600 dark:text-slate-400 text-base leading-relaxed max-w-sm text-center mb-8">
          Your trip{" "}
          <Text className="font-semibold text-primary">
            {"\u201C"}{tripName ?? "Luxor Ancient Wonders"}{"\u201D"}
          </Text>{" "}
          is now live. We&apos;ve automatically created a group chat for you and your future participants.
        </Text>

        {/* Status card */}
        <View className="w-full max-w-xs bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-700 rounded-xl p-4 flex-row items-center justify-between mb-10">
          <View className="flex-row items-center gap-3">
            <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
              <MaterialIcons name="chat-bubble" size={22} color="#359EFF" />
            </View>
            <View>
              <Text className="text-[#0F172A] dark:text-white font-semibold text-sm">Group Chat</Text>
              <Text className="text-slate-500 dark:text-slate-400 text-xs">Active & Ready</Text>
            </View>
          </View>
          <View className="flex-row items-center gap-1.5">
            <View className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
            <Text className="text-xs font-medium text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Online</Text>
          </View>
        </View>
      </View>

      {/* Footer actions */}
      <View className="p-6 gap-3" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton title="View Plan Details" onPress={() => router.replace("/(traveler)")} />
        <Pressable className="w-full h-14 bg-white dark:bg-transparent border-2 border-primary/20 dark:border-primary/40 rounded-xl items-center justify-center flex-row gap-2">
          <MaterialIcons name="share" size={20} color="#359EFF" />
          <Text className="text-primary font-bold text-base">Share with Friends</Text>
        </Pressable>
      </View>
    </View>
  );
}
