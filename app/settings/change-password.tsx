import React, { useMemo, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import {
  changePasswordSchema,
  type ChangePasswordFormData,
} from "@/utils/validation";

const getStrengthLevel = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: { currentPassword: "", newPassword: "", confirmNewPassword: "" },
  });

  const newPassword = useWatch({ control, name: "newPassword" });
  const strength = getStrengthLevel(newPassword || "");

  const meetsLength = (newPassword?.length ?? 0) >= 8;
  const meetsNumber = /[0-9]/.test(newPassword || "");
  const meetsSpecial = /[^a-zA-Z0-9]/.test(newPassword || "");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const onSubmit = async (_data: ChangePasswordFormData) => {};

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Change Password</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-4">
            <View className="px-4 py-4">
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">Current Password</Text>
              <Controller
                control={control}
                name="currentPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center gap-2">
                    <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                      <MaterialIcons name="lock-outline" size={18} color="#64748b" />
                    </View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showCurrent}
                      placeholder="Enter current password"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 text-sm font-medium text-main-light dark:text-white p-0"
                    />
                    <Pressable onPress={() => setShowCurrent(!showCurrent)}>
                      <MaterialIcons name={showCurrent ? "visibility-off" : "visibility"} size={20} color="#64748b" />
                    </Pressable>
                  </View>
                )}
              />
              {errors.currentPassword && (
                <Text className="text-xs text-red-500 mt-1">{errors.currentPassword.message}</Text>
              )}
            </View>
          </View>

          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-3">
            <View className="px-4 py-4">
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">New Password</Text>
              <Controller
                control={control}
                name="newPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center gap-2">
                    <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                      <MaterialIcons name="lock" size={18} color="#64748b" />
                    </View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showNew}
                      placeholder="Enter new password"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 text-sm font-medium text-main-light dark:text-white p-0"
                    />
                    <Pressable onPress={() => setShowNew(!showNew)}>
                      <MaterialIcons name={showNew ? "visibility-off" : "visibility"} size={20} color="#64748b" />
                    </Pressable>
                  </View>
                )}
              />
              {errors.newPassword && (
                <Text className="text-xs text-red-500 mt-1">{errors.newPassword.message}</Text>
              )}
            </View>
          </View>

          <View className="flex-row gap-1 mb-4 px-1">
            {[0, 1, 2, 3].map((i) => (
              <View
                key={i}
                className="flex-1 h-1.5 rounded-full"
                style={{ backgroundColor: i < strength ? STRENGTH_COLORS[strength] : "#e5e7eb" }}
              />
            ))}
          </View>

          <View className="gap-2 mb-4 px-1">
            {[
              { label: "At least 8 characters", met: meetsLength },
              { label: "Contains a number", met: meetsNumber },
              { label: "Contains a special character", met: meetsSpecial },
            ].map((req) => (
              <View key={req.label} className="flex-row items-center gap-2">
                <MaterialIcons
                  name={req.met ? "check-circle" : "circle"}
                  size={16}
                  color={req.met ? "#22c55e" : "#cbd5e1"}
                />
                <Text className={`text-xs ${req.met ? "font-medium text-green-600 dark:text-green-400" : "text-sub-light"}`}>
                  {req.label}
                </Text>
              </View>
            ))}
          </View>

          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-6">
            <View className="px-4 py-4">
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">Confirm New Password</Text>
              <Controller
                control={control}
                name="confirmNewPassword"
                render={({ field: { onChange, value } }) => (
                  <View className="flex-row items-center gap-2">
                    <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                      <MaterialIcons name="lock" size={18} color="#64748b" />
                    </View>
                    <TextInput
                      value={value}
                      onChangeText={onChange}
                      secureTextEntry={!showConfirm}
                      placeholder="Re-enter new password"
                      placeholderTextColor="#9ca3af"
                      className="flex-1 text-sm font-medium text-main-light dark:text-white p-0"
                    />
                    <Pressable onPress={() => setShowConfirm(!showConfirm)}>
                      <MaterialIcons name={showConfirm ? "visibility-off" : "visibility"} size={20} color="#64748b" />
                    </Pressable>
                  </View>
                )}
              />
              {errors.confirmNewPassword && (
                <Text className="text-xs text-red-500 mt-1">{errors.confirmNewPassword.message}</Text>
              )}
            </View>
          </View>

          <PrimaryButton
            title="Update Password"
            onPress={handleSubmit(onSubmit)}
            isLoading={isSubmitting}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
