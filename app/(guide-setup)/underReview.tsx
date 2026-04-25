import React from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function ProfileUnderReview() {
  const insets = useSafeAreaInsets();
  const { signOut } = useAuth();
  const pulseAnim = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.06,
          duration: 900,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 900,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center p-6"
      style={{ paddingTop: insets.top, paddingBottom: insets.bottom }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Background decorative blobs */}
      <View className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-50 pointer-events-none">
        <View className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-3xl" />
        <View className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] bg-primary/5 rounded-full blur-3xl" />
      </View>

      <View className="w-full max-w-sm bg-white dark:bg-neutral-dark rounded-xl shadow-xl p-8 items-center border border-stone-200 dark:border-stone-800">
        {/* Pulsing icon */}
        <View className="relative w-32 h-32 items-center justify-center mb-8">
          <Animated.View
            className="absolute inset-0 bg-primary/10 rounded-full"
            style={{ transform: [{ scale: pulseAnim }] }}
          />
          <View className="absolute inset-4 bg-primary/20 rounded-full" />
          <View className="relative z-10 w-20 h-20 bg-primary rounded-full items-center justify-center shadow-lg">
            <MaterialIcons name="history" size={40} color="white" />
          </View>
          {/* Orbiting dots */}
          <View className="absolute -top-1 -right-1 w-4 h-4 bg-primary/40 rounded-full" />
          <View className="absolute -bottom-2 -left-2 w-6 h-6 bg-primary/20 rounded-full" />
        </View>

        {/* Content */}
        <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-4 tracking-tight text-center">
          Profile Under Review
        </Text>
        <Text className="text-slate-600 dark:text-slate-400 leading-relaxed text-center mb-10">
          Our team is reviewing your documents. You'll be notified once your account is approved. This usually takes 24-48 hours.
        </Text>

        {/* Actions */}
        <View className="w-full gap-4">
          <Pressable
            disabled
            className="w-full py-4 px-6 rounded-lg items-center justify-center flex-row gap-2 bg-primary/60"
          >
            <MaterialIcons name="hourglass-empty" size={18} color="white" />
            <Text className="text-white font-semibold">Waiting for Approval</Text>
          </Pressable>

          <Pressable
            onPress={signOut}
            className="w-full py-2 items-center justify-center flex-row gap-1"
          >
            <MaterialIcons name="logout" size={18} color="#94a3b8" />
            <Text className="text-slate-500 dark:text-stone-500 font-medium text-sm">Logout</Text>
          </Pressable>
        </View>

        {/* Footer help */}
        <View className="mt-12 pt-8 border-t border-stone-100 dark:border-stone-800 w-full items-center">
          <Text className="text-xs text-slate-400 dark:text-stone-500">
            Need help?{" "}
            <Text className="text-primary">Contact Support</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
