import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View, type NativeSyntheticEvent } from "react-native";
import { useColorScheme } from "nativewind";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import SegmentedControl from "@react-native-segmented-control/segmented-control";

import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import {
  forgotPasswordEmailSchema,
  forgotPasswordPhoneSchema,
} from "@/utils/validation";

type Method = "email" | "phone";
type FormValues = { inputValue: string };

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedMethod, setSelectedMethod] = useState<Method>("email");

  const schema =
    selectedMethod === "email"
      ? forgotPasswordEmailSchema
      : forgotPasswordPhoneSchema;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inputValue: "" },
  });

  const handleMethodChange = useCallback(
    (event: NativeSyntheticEvent<{ selectedSegmentIndex: number }>) => {
      const method: Method =
        event.nativeEvent.selectedSegmentIndex === 0 ? "email" : "phone";
      setSelectedMethod(method);
      reset({ inputValue: "" });
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        await forgotPassword(data.inputValue);
        router.push({
          pathname: "/(auth)/otpVerification",
          params: { identifier: data.inputValue, action: "reset" },
        });
      } catch (error: any) {
        const message =
          error?.response?.data?.message ||
          error?.message ||
          "Failed to send reset code. Please try again.";
        Toast.show({ type: "error", text1: "Error", text2: message });
      }
    },
    [forgotPassword, router, selectedMethod],
  );

  const isEmail = selectedMethod === "email";

  return (
    <KeyboardAwareScrollView
      enableOnAndroid
      extraScrollHeight={20}
      keyboardShouldPersistTaps="handled"
      showsVerticalScrollIndicator={false}
      className="bg-background-light dark:bg-background-dark"
      contentContainerStyle={{
        flexGrow: 1,
        paddingTop: insets.top,
        paddingBottom: insets.bottom + 20,
      }}
    >
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between py-6">
          <BackButton />
        </View>

        {/* Icon */}
        <View className="items-center justify-center py-2">
          <View className="mb-4 h-32 w-32 items-center justify-center rounded-full bg-primary/10 dark:bg-primary/5">
            <MaterialIcons name="lock-reset" size={64} color="#359EFF" />
          </View>
        </View>

        {/* Title and Description */}
        <View className="pb-8 pt-2">
          <Text className="pb-3 font-display text-[32px] font-bold leading-tight tracking-tight text-slate-900 dark:text-white">
            Forgot Password?
          </Text>
          <Text className="font-display text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
            Don&apos;t worry! It happens. Please enter the email or phone number
            associated with your account to receive a reset code.
          </Text>
        </View>

        {/* Method Selector */}
        <View className="mb-6">
          <SegmentedControl
            values={["Email", "Phone"]}
            selectedIndex={isEmail ? 0 : 1}
            onChange={handleMethodChange}
            style={{ height: 45 }}
            backgroundColor={isDark ? "#1E2D2D" : "#E5E7EB"}
            tintColor={isDark ? "#2C3E3E" : "#FFFFFF"}
            fontStyle={{
              color: isDark ? "#A0AEC0" : "#4F4F4F",
              fontSize: 13,
              fontWeight: "600",
            }}
            activeFontStyle={{
              color: "#359EFF",
              fontSize: 13,
              fontWeight: "600",
            }}
          />
        </View>

        {/* Input */}
        <Controller
          key={selectedMethod}
          control={control}
          name="inputValue"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label={isEmail ? "Email Address" : "Phone Number"}
              icon={isEmail ? "mail-outline" : "phone"}
              value={value}
              onChangeText={onChange}
              error={errors.inputValue?.message}
              placeholder={isEmail ? "user@example.com" : "+20 123 456 7890"}
              keyboardType={isEmail ? "email-address" : "phone-pad"}
              editable={!isSubmitting}
            />
          )}
        />

        <View className="mt-8">
          <PrimaryButton
            title="Send Code"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          />
        </View>

        <View className="flex-1" />

        {/* Footer */}
        <View className="w-full py-8">
          <Text className="text-center font-display text-sm text-slate-500 dark:text-slate-400">
            Remember password?{" "}
            <Text
              onPress={() => router.back()}
              className="font-display font-bold text-slate-900 dark:text-white"
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}