import BackButton from "@/components/BackButton";
import OtpInput from "@/components/OtpInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useCountdown } from "@/hooks/useCountdown";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  clearPendingRegistration,
  getPendingRegistration,
} from "@/utils/pendingRegistration";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const RESEND_TIMEOUT_SECONDS = 60;

export default function OtpVerification() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { identifier, action, otpId } = useLocalSearchParams<{
    identifier: string;
    action: "register" | "reset";
    otpId?: string;
  }>();

  const { forgotPassword, otpVerify, register, verifyResetOtp } = useAuth();

  const [code, setCode] = useState("");
  const isComplete = code.length === 6;
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { secondsLeft, timerLabel, restart } = useCountdown(
    RESEND_TIMEOUT_SECONDS,
  );

  // Clear error as soon as the user starts retyping
  useEffect(() => {
    if (error) setError(null);
  }, [code]);

  const handleResend = useCallback(async () => {
    if (secondsLeft > 0) return;
    try {
      if (action === "register") {
        const pending = getPendingRegistration();
        if (!pending) {
          Toast.show({
            type: "error",
            text1: "Error",
            text2: "Registration data not found. Please sign up again.",
          });
          return;
        }
        const response = await register({
          identifier: pending.identifier,
          firstName: pending.firstName,
          lastName: pending.lastName,
          password: pending.password,
        });
        if (response?.otpId) {
          router.setParams({ otpId: response.otpId });
          restart();
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "A new code has been sent.",
          });
        }
      } else {
        await forgotPassword(identifier);
        restart();
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "A new code has been sent.",
        });
      }
    } catch (err) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: getErrorMessage(err),
      });
    }
  }, [
    secondsLeft,
    action,
    forgotPassword,
    identifier,
    register,
    restart,
    router,
  ]);

  const handleVerify = useCallback(async () => {
    if (!isComplete) {
      setError("Please enter the 6-digit code");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      if (action === "register") {
        if (!otpId) {
          setError("OTP ID is missing. Please sign up again.");
          return;
        }
        await otpVerify(otpId, code);
        clearPendingRegistration();
        router.replace("/(onboarding)/welcome");
      } else {
        if (!otpId) {
          setError("OTP ID is missing. Please try again.");
          return;
        }
        await verifyResetOtp(otpId, code);
        router.push({
          pathname: "/(auth)/resetPassword",
          params: { identifier },
        });
      }
    } catch (err) {
      setError(getErrorMessage(err, "Invalid OTP code"));
    } finally {
      setIsLoading(false);
    }
  }, [
    isComplete,
    action,
    otpId,
    code,
    otpVerify,
    router,
    verifyResetOtp,
    identifier,
  ]);

  if (!identifier) {
    return (
      <Redirect
        href={action === "register" ? "/(auth)" : "/(auth)/forgotPassword"}
      />
    );
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
              <View className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <MaterialIcons name="lock-open" size={64} color="#359EFF" />
              <View className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full border border-neutral-light bg-background-light shadow-sm dark:border-neutral-dark dark:bg-background-dark">
                <MaterialIcons name="flight" size={20} color="#94A3B8" />
              </View>
            </View>
          </View>

          {/* Title */}
          <View className="mb-8 w-full">
            <Text className="mb-3 text-center font-display text-[28px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
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
              value={code}
              onChangeText={setCode}
              error={Boolean(error)}
              editable={!isLoading}
            />

            {error && (
              <Text className="text-center font-display text-sm text-red-500">
                {error}
              </Text>
            )}

            <PrimaryButton
              title={
                action === "register" ? "Verify & Sign In" : "Verify Identity"
              }
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
