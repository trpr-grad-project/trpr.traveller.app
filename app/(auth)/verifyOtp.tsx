import BackButton from "@/components/BackButton";
import OtpInput from "@/components/OtpInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { useOtpInput } from "@/hooks/useOtpInput";
import { MaterialIcons } from "@expo/vector-icons";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function VerifyOtp() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { otpVerify } = useAuth();
  const { otpId, email } = useLocalSearchParams<{
    otpId: string;
    email: string;
  }>();

  const {
    otp,
    otpValue,
    isComplete,
    inputRefs,
    handleOtpChange,
    handleKeyPress,
  } = useOtpInput();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleVerify = async () => {
    if (!isComplete) {
      setError("Please enter the 6-digit code");
      return;
    }
    if (!otpId) {
      setError("OTP ID is missing. Please sign up again.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      await otpVerify(otpId, otpValue);
      router.replace("/");
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || "Invalid OTP code";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (!otpId) {
    return <Redirect href="/(auth)/register" />;
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
            <Text className="text-center font-display text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
              We sent a code to{"\n"}
              <Text className="font-medium text-slate-700 dark:text-slate-300">
                {email || "your email"}
              </Text>
              . Please enter it below.
            </Text>
          </View>

          {/* OTP */}
          <View className="w-full gap-4">
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
              title="Verify & Sign In"
              onPress={handleVerify}
              isLoading={isLoading}
            />

            {/* Resend */}
            <View className="mt-4 flex-row items-center justify-between w-full px-1">
              <Text className="font-display text-sm font-medium text-gray-custom">
                Didn&apos;t receive code?
              </Text>
              <Pressable
                disabled={isLoading}
                style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
              >
                <Text className="font-display text-sm font-bold text-primary">
                  Resend
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}
