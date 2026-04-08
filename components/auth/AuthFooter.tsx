import { View, Text, Pressable } from "react-native";
import React from "react";
import { MaterialIcons } from "@expo/vector-icons";
import SocialButton from "../SocialButton";
import { useColorScheme } from "nativewind";

export default function AuthFooter() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  return (
    <>
      {/* Divider */}
      <View className="relative flex flex-row items-center pt-6 pb-8">
        <View className="flex-grow border-t border-neutral-light dark:border-neutral-dark/50" />
        <Text className="mx-4 flex-shrink text-sm font-medium text-gray-custom">
          Or continue with
        </Text>
        <View className="flex-grow border-t border-neutral-light dark:border-neutral-dark/50" />
      </View>

      {/* Social Buttons */}
      <View className="mb-8 flex flex-row justify-between gap-4">
        <SocialButton provider="google" />
        <SocialButton provider="apple" color={isDark ? "#fff" : "#000"} />
        <SocialButton provider="facebook" />
      </View>

      {/* Continue as Guest */}
      <Pressable
        onPress={() => {}}
        className="flex flex-row items-center justify-center gap-1"
      >
        {({ pressed }) => (
          <>
            <Text
              className={`text-sm font-semibold tracking-wider ${
                pressed ? "opacity-60" : "opacity-100"
              } text-primary`}
            >
              Continue as Guest
            </Text>
            <MaterialIcons
              name="chevron-right"
              size={20}
              color="#359EFF"
              style={{ opacity: pressed ? 0.6 : 1 }}
            />
          </>
        )}
      </Pressable>

      {/* Terms and Conditions */}
      <Text className="mt-8 text-center text-xs leading-relaxed text-gray-custom">
        By logging in, you agree to our{" "}
        <Text className="text-gray-custom underline">Terms of Service</Text> and{" "}
        <Text className="text-gray-custom underline">Privacy Policy</Text>.
      </Text>
    </>
  );
}
