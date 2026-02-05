import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function ForgotPassword() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [inputValue, setInputValue] = useState("");
  const [selectedMethod, setSelectedMethod] = useState<"email" | "phone">(
    "email",
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Clear input when switching methods to prevent crashes
  const handleMethodChange = (method: "email" | "phone") => {
    setSelectedMethod(method);
    setInputValue(""); // Clear the input
    setError(null);
  };

  const validate = () => {
    if (!inputValue.trim()) {
      setError(
        `${selectedMethod === "email" ? "Email" : "Phone number"} is required`,
      );
      return false;
    }

    if (selectedMethod === "email") {
      if (!/^\S+@\S+\.\S+$/.test(inputValue)) {
        setError("Invalid email format");
        return false;
      }
    } else {
      if (!/^\+?[0-9]{10,15}$/.test(inputValue.replace(/\s/g, ""))) {
        setError("Invalid phone format");
        return false;
      }
    }

    setError(null);
    return true;
  };

  const handleSendCode = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      // Mocking API call for now as per instructions in previous turns
      // In a real app, you'd call a service here
      router.push({
        pathname: "/(auth)/otpVerification",
        params: { identifier: inputValue, type: selectedMethod },
      });
    } catch {
      setError("Failed to send code. Please try again.");
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
          <TouchableOpacity>
            <Text className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Help
            </Text>
          </TouchableOpacity>
        </View>

        {/* Icon */}
        <View className="py-2 flex justify-center items-center">
          <View className="w-32 h-32 bg-primary/20 dark:bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <MaterialIcons name="lock-reset" size={64} color="#359EFF" />
          </View>
        </View>

        {/* Title and Description */}
        <View className="pt-2 pb-8">
          <Text className="text-[#0F172A] dark:text-[#E2E8F0] tracking-tight text-[32px] font-bold leading-tight pb-3 font-display">
            Forgot Password?
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-base font-normal leading-relaxed font-display">
            Don&apos;t worry! It happens. Please enter the email or phone number
            associated with your account to receive a reset code.
          </Text>
        </View>

        {/* Segmented Control */}
        <View className="flex-row gap-2 mb-6 bg-[#E0E7E7] dark:bg-slate-800/50 p-1 rounded-xl">
          <TouchableOpacity
            onPress={() => handleMethodChange("email")}
            className={`flex-1 py-2.5 px-4 rounded-lg ${
              selectedMethod === "email"
                ? "bg-white dark:bg-slate-700 shadow-sm"
                : ""
            }`}
          >
            <Text
              className={`text-sm font-bold text-center font-display ${
                selectedMethod === "email"
                  ? "text-primary"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Email
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleMethodChange("phone")}
            className={`flex-1 py-2.5 px-4 rounded-lg ${
              selectedMethod === "phone"
                ? "bg-white dark:bg-slate-700 shadow-sm"
                : ""
            }`}
          >
            <Text
              className={`text-sm font-bold text-center font-display ${
                selectedMethod === "phone"
                  ? "text-primary"
                  : "text-slate-600 dark:text-slate-400"
              }`}
            >
              Phone
            </Text>
          </TouchableOpacity>
        </View>

        {/* Input Field */}
        <View className="flex-col gap-4 mb-8">
          <View className="flex-col flex-1">
            <Text className="text-slate-900 dark:text-white text-sm font-semibold leading-normal pb-2 ml-1 font-display">
              {selectedMethod === "email" ? "Email Address" : "Phone Number"}
            </Text>
            <View className="relative">
              <View className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none z-10">
                <MaterialIcons
                  name={selectedMethod === "email" ? "mail" : "phone"}
                  size={24}
                  color={error ? "#EF4444" : isDark ? "#94A3B8" : "#0F172A"}
                />
              </View>
              <TextInput
                className={`flex w-full rounded-xl text-[#0F172A] dark:text-white border bg-white dark:bg-slate-800 h-14 pl-12 pr-4 text-base font-medium leading-normal ${
                  error
                    ? "border-red-500"
                    : "border-slate-200 dark:border-slate-700"
                }`}
                placeholder={
                  selectedMethod === "email"
                    ? "user@example.com"
                    : "+20 123 456 7890"
                }
                placeholderTextColor="#94A3B8"
                keyboardType={
                  selectedMethod === "email" ? "email-address" : "phone-pad"
                }
                onChangeText={(text) => {
                  setInputValue(text);
                  if (error) setError(null);
                }}
                value={inputValue}
                autoCapitalize="none"
                editable={!isLoading}
              />
            </View>
            {error && (
              <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
                {error}
              </Text>
            )}
          </View>
        </View>

        {/* Send Code Button */}
        <TouchableOpacity
          onPress={handleSendCode}
          disabled={isLoading}
          className={`w-full h-14 bg-primary active:scale-[0.98] rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-primary/20 ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-white font-bold text-lg font-display">
              Send Code
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-1" />

        {/* Footer */}
        <View className="w-full py-8 text-center">
          <Text className="text-slate-500 dark:text-slate-400 text-sm text-center font-display">
            Remember password?{" "}
            <Text
              onPress={() => router.back()}
              className="text-slate-900 dark:text-white font-bold font-display"
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}
