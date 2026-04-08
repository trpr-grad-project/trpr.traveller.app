import BackButton from "@/components/BackButton";
import OtpInput from "@/components/OtpInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useOtpInput } from "@/hooks/useOtpInput";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RESEND_TIMEOUT_SECONDS = 60;

export default function OtpVerification() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { identifier } = useLocalSearchParams<{
    identifier: string;
    type: string;
  }>();

  const { forgotPassword, verifyResetOtp } = useAuth();

  const {
    otp,
    otpValue,
    isComplete,
    inputRefs,
    handleOtpChange,
    handleKeyPress,
  } = useOtpInput();

  const [secondsLeft, setSecondsLeft] = useState(RESEND_TIMEOUT_SECONDS);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = useCallback(() => {
    setSecondsLeft(RESEND_TIMEOUT_SECONDS);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startTimer]);

  const timerLabel = `${String(Math.floor(secondsLeft / 60)).padStart(2, "0")}:${String(secondsLeft % 60).padStart(2, "0")}`;

  const handleResend = async () => {
    if (secondsLeft > 0) return;
    try {
      await forgotPassword(identifier);
      startTimer();
      Toast.show({ type: "success", text1: "Success", text2: "A new code has been sent." });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Failed to resend code.";
      Toast.show({ type: "error", text1: "Error", text2: errorMessage });
    }
  };

  const handleVerify = async () => {
    if (!isComplete) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      const res = await verifyResetOtp(identifier, otpValue);
      // Assuming response contains resetToken or the API returns success
      const resetToken = res?.resetToken || "valid-reset-token";

      router.push({
        pathname: "/(auth)/resetPassword",
        params: { resetToken, identifier },
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid OTP code";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!identifier) {
    return <Redirect href="/(auth)/forgotPassword" />;
  }

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
      className="bg-background-light dark:bg-background-dark"
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex items-start p-4">
          <BackButton />
        </View>

        {/* Content */}
        <View className="flex-1 flex-col items-center px-6 pb-8 pt-4">
          {/* Icon */}
          <View className="mb-8 flex h-40 w-full items-center justify-center">
            <View className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/5">
              <View className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-xl" />
              <MaterialIcons name="lock-open" size={64} color="#359EFF" />
              <View className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-background-light shadow-sm dark:bg-background-dark">
                <MaterialIcons name="flight" size={20} color="#94A3B8" />
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mb-8 w-full">
            <Text className="mb-3 text-center text-[28px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
              Verification Code
            </Text>
            <Text className="text-center text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              We sent a code to{" "}
              <Text className="font-medium text-slate-700 dark:text-slate-300">
                {identifier || "your email"}
              </Text>
              .{"\n"}Please enter the code to verify your identity.
            </Text>
          </View>

          {/* OTP */}
          <View className="w-full gap-5">
            <OtpInput
              otp={otp}
              inputRefs={inputRefs}
              onChange={handleOtpChange}
              onKeyPress={handleKeyPress}
              error={Boolean(error)}
              editable={!isLoading}
            />

            {error && (
              <Text className="text-center font-display text-sm text-red-500">
                {error}
              </Text>
            )}

            <PrimaryButton
              title="Verify Identity"
              onPress={handleVerify}
              isLoading={isLoading}
            />

            {/* Timer & Resend */}
            <View className="mt-2 flex-row items-center justify-between w-full px-1">
              <Text className="font-display text-sm font-medium text-gray-custom dark:text-slate-400">
                {timerLabel}
              </Text>
              <Pressable
                onPress={handleResend}
                disabled={secondsLeft > 0 || isLoading}
                style={({ pressed }) => ({
                  opacity: pressed && !(secondsLeft > 0 || isLoading) ? 0.6 : 1,
                })}
              >
                <Text
                  className={`font-display text-sm font-bold ${secondsLeft > 0 ? "text-gray-custom" : "text-primary"}`}
                >
                  Resend code
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
