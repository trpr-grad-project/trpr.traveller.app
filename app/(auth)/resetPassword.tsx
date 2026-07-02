import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/errorHandler";
import {
  resetPasswordSchema,
  type ResetPasswordFormData,
} from "@/utils/validation";
import { MaterialIcons } from "@expo/vector-icons";
import { zodResolver } from "@hookform/resolvers/zod";
import { Redirect, useLocalSearchParams, useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useMemo, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

// Password requirement row
function PasswordRequirement({
  label,
  met,
  isDark,
}: {
  label: string;
  met: boolean;
  isDark: boolean;
}) {
  return (
    <View className="flex-row items-center gap-2">
      <MaterialIcons
        name={met ? "check-circle" : "circle"}
        size={16}
        color={met ? "#10B981" : isDark ? "#475569" : "#CBD5E1"}
      />
      <Text
        className={`font-display text-xs ${
          met
            ? "font-medium text-emerald-600 dark:text-emerald-400"
            : "text-slate-500 dark:text-slate-400"
        }`}
      >
        {label}
      </Text>
    </View>
  );
}

export default function ResetPassword() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();

  const { identifier } = useLocalSearchParams<{
    identifier: string;
  }>();

  const { resetPassword } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: "", confirmPassword: "" },
  });

  const password = watch("password");

  const passwordRequirements = useMemo(
    () => [
      { label: "At least 8 characters", met: password.length >= 8 },
      { label: "Contains a number", met: /\d/.test(password) },
      {
        label: "Contains a special character",
        met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      },
    ],
    [password],
  );

  const onSubmit = async (data: ResetPasswordFormData) => {
    try {
      setError(null);
      await resetPassword(data.password);
      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Your password has been reset successfully.",
      });
      router.replace("/(auth)");
    } catch (err) {
      setError(getErrorMessage(err, "Failed to reset password."));
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
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="pt-6 pb-2 items-start">
          <BackButton />
        </View>

        {/* Title */}
        <View className="pb-8 pt-2">
          <Text className="pb-3 font-display text-[32px] font-bold leading-tight tracking-tight text-[#0F172A] dark:text-[#E2E8F0]">
            Create New Password
          </Text>
          <Text className="font-display text-base font-normal leading-relaxed text-slate-500 dark:text-slate-400">
            Your new password must be different from previous used passwords.
          </Text>
        </View>

        {/* Password Fields */}
        <View className="mb-8 gap-6">
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="New Password"
                icon="lock-outline"
                value={value}
                onChangeText={onChange}
                error={errors.password?.message}
                placeholder="••••••••"
                secure
                editable={!isSubmitting}
              />
            )}
          />

          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, value } }) => (
              <FormInput
                label="Confirm New Password"
                icon="lock-outline"
                value={value}
                onChangeText={onChange}
                error={errors.confirmPassword?.message}
                placeholder="••••••••"
                secure
                editable={!isSubmitting}
              />
            )}
          />
        </View>

        {error && (
          <Text className="mb-4 text-center font-display text-sm text-red-500">
            {error}
          </Text>
        )}

        {/* Password Requirements */}
        <View className="mb-8 rounded-2xl border border-slate-100 bg-slate-50 p-4 dark:border-slate-700/50 dark:bg-slate-800/30">
          <Text className="mb-3 font-display text-sm font-bold text-slate-900 dark:text-white">
            Password Requirements:
          </Text>
          <View className="gap-2">
            {passwordRequirements.map((req) => (
              <PasswordRequirement
                key={req.label}
                label={req.label}
                met={req.met}
                isDark={isDark}
              />
            ))}
          </View>
        </View>

        <PrimaryButton
          title="Update Password"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />

        <View className="flex-1" />
      </View>
    </KeyboardAwareScrollView>
  );
}
