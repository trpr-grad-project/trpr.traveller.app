import React, { useEffect, useRef } from "react";
import {
  Animated,
  Easing,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";

interface SplashScreenProps {
  onFinish: () => void;
}

export default function SplashScreen({ onFinish }: SplashScreenProps) {
  const insets = useSafeAreaInsets();
  const progress = useRef(new Animated.Value(0)).current;
  const logoScale = useRef(new Animated.Value(0.8)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const bottomOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      // Logo entrance
      Animated.parallel([
        Animated.timing(logoScale, {
          toValue: 1,
          duration: 600,
          easing: Easing.out(Easing.back(1.2)),
          useNativeDriver: true,
        }),
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]),
      // Tagline fades in
      Animated.timing(taglineOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      // Bottom elements + progress
      Animated.parallel([
        Animated.timing(bottomOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 0.35,
          duration: 1000,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: false,
        }),
      ]),
    ]).start(() => {
      // Auto-navigate after animation
      setTimeout(onFinish, 400);
    });
  }, []);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark items-center justify-between"
      style={{ paddingTop: insets.top + 40, paddingBottom: insets.bottom + 48 }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Decorative blobs */}
      <View
        className="absolute -top-10 -right-10 w-56 h-56 rounded-full bg-primary/5"
        pointerEvents="none"
      />
      <View
        className="absolute -bottom-5 -left-5 w-40 h-40 rounded-full bg-primary/5"
        pointerEvents="none"
      />

      {/* Central branding */}
      <Animated.View
        className="items-center gap-6"
        style={{ opacity: logoOpacity, transform: [{ scale: logoScale }] }}
      >
        {/* Icon container */}
        <View className="w-24 h-24 rounded-3xl bg-primary/10 items-center justify-center mb-2">
          <MaterialIcons name="explore" size={64} color="#359EFF" />
        </View>

        {/* Brand name */}
        <View className="items-center">
          <Text className="text-primary text-[42px] font-bold leading-none pb-2 tracking-tight">
            TouRA
          </Text>
          <Animated.Text
            className="text-gray-custom text-lg font-medium text-center max-w-[280px]"
            style={{ opacity: taglineOpacity }}
          >
            Plan smart trips, your way
          </Animated.Text>
        </View>
      </Animated.View>

      {/* Bottom: progress bar + AI badge */}
      <Animated.View className="w-full max-w-[200px] items-center gap-8" style={{ opacity: bottomOpacity }}>
        {/* Progress bar */}
        <View className="w-full h-1.5 rounded-full bg-neutral-light overflow-hidden">
          <Animated.View
            className="h-full rounded-full bg-primary"
            style={{ width: progressWidth }}
          />
        </View>

        {/* AI powered badge */}
        <View className="flex-row items-center gap-2 opacity-60">
          <MaterialIcons name="auto-awesome" size={16} color="#4F4F4F" />
          <Text className="text-xs font-semibold tracking-widest uppercase text-gray-custom">
            AI Powered
          </Text>
        </View>
      </Animated.View>
    </View>
  );
}
