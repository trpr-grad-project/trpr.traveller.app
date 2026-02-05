import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function OtpVerification() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  const handleOtpChange = (value: string, index: number) => {
    if (value.length > 1) {
      value = value[0];
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
            className="flex size-10 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
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
              <View className="absolute inset-0 rounded-full bg-gradient-to-tr from-primary/20 to-transparent blur-xl" />
              <MaterialIcons name="lock-open" size={64} color="#359EFF" />
              <View className="absolute -bottom-2 -right-2 flex size-10 items-center justify-center rounded-full bg-background-light dark:bg-background-dark shadow-sm">
                <MaterialIcons name="flight" size={20} color="#94A3B8" />
              </View>
            </View>
          </View>

          {/* Title and Description */}
          <View className="mb-8 w-full text-center">
            <Text className="text-slate-900 dark:text-white text-[28px] font-bold leading-tight tracking-tight mb-3 text-center">
              Verification Code
            </Text>
            <Text className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed text-center">
              We sent a code to{" "}
              <Text className="font-medium text-slate-700 dark:text-slate-300">
                user@email.com
              </Text>
              .{"\n"}
              Please enter the code to verify your identity.
            </Text>
          </View>

          {/* OTP Input Fields */}
          <View className="w-full space-y-6">
            <View className="flex-row justify-between gap-2">
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  className="flex h-14 w-full flex-1 text-center rounded-xl border border-primary bg-white dark:bg-slate-800 text-2xl font-semibold text-slate-900 dark:text-white shadow-sm"
                  maxLength={1}
                  keyboardType="number-pad"
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                />
              ))}
            </View>

            {/* Verify Button */}
            <View className="w-full">
              <TouchableOpacity
                onPress={() => router.push("/(auth)/resetPassword")}
                className="w-full rounded-xl bg-primary py-4 px-6 text-center shadow-md shadow-primary/20 active:scale-[0.98]"
              >
                <Text className="text-base font-bold text-white text-center">
                  Verify Identity
                </Text>
              </TouchableOpacity>
            </View>

            {/* Timer and Resend */}
            <View className="flex-row items-center justify-between w-full px-1">
              <Text className="text-sm font-medium text-[#4F4F4F] dark:text-slate-400">
                00:45
              </Text>
              <TouchableOpacity>
                <Text className="text-sm font-bold text-primary">
                  Resend code
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
