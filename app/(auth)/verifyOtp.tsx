import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useRef, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function VerifyOtp() {
  const router = useRouter();
  const { otpVerify } = useAuth();
  const { otpId, phone } = useLocalSearchParams<{
    otpId: string;
    phone: string;
  }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [error, setError] = useState<string | null>(null);

  const handleOtpChange = (value: string, index: number) => {
    if (error) setError(null);
    if (value.length > 1) {
      value = value[value.length - 1];
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerify = async () => {
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
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
      // AuthContext handles session state, which should trigger root navigation update
      router.replace("/");
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Invalid OTP code";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      className="bg-background-light dark:bg-background-dark"
    >
      <View className="flex-1">
        {/* Header */}
        <View className="flex items-start p-4">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex size-12 shrink-0 items-center justify-center rounded-full active:bg-slate-200 dark:active:bg-slate-800"
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color={isDark ? "#E2E8F0" : "#0F172A"}
            />
          </TouchableOpacity>
        </View>

        {/* Content */}
        <View className="flex-1 flex-col items-center px-6 pt-4 pb-8">
          {/* Icon */}
          <View className="mb-8 flex h-40 w-full items-center justify-center">
            <View className="relative flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/5">
              <View className="absolute inset-0 rounded-full bg-primary/20 blur-xl" />
              <MaterialIcons name="lock-open" size={64} color="#359EFF" />
              <View className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-background-light dark:bg-background-dark shadow-sm border border-neutral-light dark:border-neutral-dark">
                <MaterialIcons name="flight" size={20} color="#94A3B8" />
              </View>
            </View>
          </View>

          {/* Title and Description */}
          <View className="mb-8 w-full text-center">
            <Text className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-3 text-center font-display">
              Verification Code
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed text-center font-display">
              We sent a code to{"\n"}
              <Text className="font-medium text-slate-700 dark:text-slate-300">
                {phone || "your phone"}
              </Text>
              . Please enter it below.
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View className="w-full space-y-6">
            <View className="flex-row justify-between gap-2 mb-4">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className={`flex h-14 w-full flex-1 text-center rounded-xl border-2 bg-white dark:bg-neutral-dark text-2xl font-semibold text-text-main-light dark:text-text-main-dark shadow-sm ${
                    error ? "border-red-500" : "border-primary"
                  }`}
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  editable={!isLoading}
                />
              ))}
            </View>

            {error && (
              <Text className="text-red-500 text-sm mb-6 text-center font-display">
                {error}
              </Text>
            )}

            {/* Verify Button */}
            <TouchableOpacity
              onPress={handleVerify}
              disabled={isLoading}
              className={`w-full rounded-xl bg-primary py-4 px-6 shadow-md shadow-primary/20 active:scale-[0.98] ${
                isLoading ? "opacity-70" : ""
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-base font-bold text-white text-center font-display">
                  Verify & Sign In
                </Text>
              )}
            </TouchableOpacity>

            {/* Resend */}
            <View className="flex-row items-center justify-between w-full px-1 mt-6">
              <Text className="text-sm font-medium text-gray-custom font-display">
                Didn&apos;t receive code?
              </Text>
              <TouchableOpacity disabled={isLoading}>
                <Text className="text-sm font-bold text-primary font-display">
                  Resend
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
