import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/errorHandler";
import { forgotPasswordEmailSchema } from "@/utils/validation";

type FormValues = { inputValue: string };

export default function ForgotPassword() {
  const router = useRouter();
  const { forgotPassword } = useAuth();
  const insets = useSafeAreaInsets();
  const schema = forgotPasswordEmailSchema;

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { inputValue: "" },
  });

  const onSubmit = useCallback(
    async (data: FormValues) => {
      try {
        const otpId = await forgotPassword(data.inputValue);
        router.push({
          pathname: "/(auth)/otpVerification",
          params: { identifier: data.inputValue, action: "reset", otpId },
        });
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: getErrorMessage(error, "Failed to send reset code. Please try again."),
        });
      }
    },
    [forgotPassword, router],
  );

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
            Don&apos;t worry! It happens. Please enter the email address
            associated with your account to receive a reset code.
          </Text>
        </View>

        {/* Input */}
        <Controller
          control={control}
          name="inputValue"
          render={({ field: { onChange, value } }) => (
            <FormInput
              label="Email Address"
              icon="mail-outline"
              value={value}
              onChangeText={onChange}
              error={errors.inputValue?.message}
              placeholder="user@example.com"
              keyboardType="email-address"
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
