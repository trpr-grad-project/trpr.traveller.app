import { MaterialIcons } from "@expo/vector-icons";
import { useRouter as useExpoRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ResetPassword() {
  const router = useExpoRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const newErrors: typeof errors = {};

    if (!password) {
      newErrors.password = "Password is required";
    } else {
      if (password.length < 8) {
        newErrors.password = "Min 8 characters";
      } else if (!/\d/.test(password)) {
        newErrors.password = "Must contain a number";
      } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        newErrors.password = "Must contain a special character";
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Please confirm password";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleUpdatePassword = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Mock API call
      setTimeout(() => {
        setIsLoading(false);
        Alert.alert("Success", "Your password has been reset successfully.", [
          { text: "OK", onPress: () => router.replace("/(auth)/signIn") },
        ]);
      }, 1500);
    } catch {
      setIsLoading(false);
      Alert.alert("Error", "Failed to reset password. Please try again.");
    }
  };

  const passwordRequirements = [
    { label: "At least 8 characters", met: password.length >= 8 },
    { label: "Contains a number", met: /\d/.test(password) },
    {
      label: "Contains a special character",
      met: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
      className="bg-background-light dark:bg-background-dark"
    >
      <View className="flex-1 px-6">
        {/* Header */}
        <View className="flex-row items-center justify-between pt-6 pb-2">
          <TouchableOpacity
            onPress={() => router.back()}
            className="flex size-12 shrink-0 items-center justify-center rounded-full hover:bg-slate-200 dark:hover:bg-slate-800"
          >
            <MaterialIcons
              name="arrow-back-ios"
              size={24}
              color={isDark ? "#E2E8F0" : "#0F172A"}
            />
          </TouchableOpacity>
        </View>

        {/* Title and Description */}
        <View className="pt-2 pb-8">
          <Text className="text-[#0F172A] dark:text-[#E2E8F0] tracking-tight text-[32px] font-bold leading-tight pb-3 font-display">
            Create New Password
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed font-display">
            Your new password must be different from previous used passwords.
          </Text>
        </View>

        {/* Password Fields */}
        <View className="flex-col gap-6 mb-8">
          {/* New Password */}
          <View className="flex-col">
            <Text className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 ml-1 font-display">
              New Password
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={
                    errors.password ? "#EF4444" : isDark ? "#94A3B8" : "#0F172A"
                  }
                />
              </View>
              <TextInput
                className={`flex w-full rounded-xl text-[#0F172A] dark:text-white border bg-white dark:bg-slate-800 h-14 pl-12 pr-12 text-base font-medium leading-normal ${
                  errors.password
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                value={password}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center"
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password */}
          <View className="flex-col">
            <Text className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 ml-1 font-display">
              Confirm New Password
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MaterialIcons
                  name="lock"
                  size={24}
                  color={
                    errors.confirmPassword
                      ? "#EF4444"
                      : isDark
                        ? "#94A3B8"
                        : "#0F172A"
                  }
                />
              </View>
              <TextInput
                className={`flex w-full rounded-xl text-[#0F172A] dark:text-white border bg-white dark:bg-slate-800 h-14 pl-12 pr-12 text-base font-medium leading-normal ${
                  errors.confirmPassword
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showConfirmPassword}
                onChangeText={(text) => {
                  setConfirmPassword(text);
                  if (errors.confirmPassword)
                    setErrors({ ...errors, confirmPassword: undefined });
                }}
                value={confirmPassword}
                editable={!isLoading}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center justify-center"
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showConfirmPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color={isDark ? "#94A3B8" : "#64748B"}
                />
              </TouchableOpacity>
            </View>
            {errors.confirmPassword && (
              <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
                {errors.confirmPassword}
              </Text>
            )}
          </View>
        </View>

        {/* Password Requirements */}
        <View className="mb-8 p-4 bg-slate-50 dark:bg-slate-800/30 rounded-2xl border border-slate-100 dark:border-slate-700/50">
          <Text className="text-slate-900 dark:text-white text-sm font-bold mb-3 font-display">
            Password Requirements:
          </Text>
          <View className="gap-2">
            {passwordRequirements.map((req, index) => (
              <View key={index} className="flex-row items-center gap-2">
                <MaterialIcons
                  name={req.met ? "check-circle" : "circle"}
                  size={16}
                  color={req.met ? "#10B981" : isDark ? "#475569" : "#CBD5E1"}
                />
                <Text
                  className={`text-xs font-display ${
                    req.met
                      ? "text-emerald-600 dark:text-emerald-400 font-medium"
                      : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {req.label}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Update Password Button */}
        <TouchableOpacity
          onPress={handleUpdatePassword}
          disabled={isLoading}
          className={`w-full h-14 bg-primary active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg font-display">
              Update Password
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-1" />
      </View>
    </ScrollView>
  );
}
