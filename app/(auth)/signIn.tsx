import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Svg, { Path } from "react-native-svg";

export default function SignIn() {
  const router = useRouter();
  const { colorScheme } = useColorScheme();
  const { signIn } = useAuth();
  const isDark = colorScheme === "dark";

  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
  }>({});

  const validate = () => {
    const newErrors: { identifier?: string; password?: string } = {};

    if (!identifier.trim()) {
      newErrors.identifier = "Email or phone is required";
    } else if (
      !/^\S+@\S+\.\S+$/.test(identifier) && // Email check
      !/^\+?[0-9]{10,15}$/.test(identifier.replace(/\s/g, "")) // Phone check (basic)
    ) {
      newErrors.identifier = "Please enter a valid email or phone number";
    }

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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validate()) return;

    setIsLoading(true);
    try {
      await signIn(identifier, password);
      // Redirection is handled by _layout.tsx
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Something went wrong. Please try again.";
      Alert.alert("Sign In Failed", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="flex flex-col gap-5 pb-8">
        {/* Identifier Field */}
        <View className="flex w-full flex-col">
          <Text className="mb-2 ml-1 text-sm font-semibold text-gray-custom font-display">
            Email or Phone
          </Text>
          <View className="relative flex w-full flex-col">
            <View className="relative flex w-full flex-row items-center">
              <TextInput
                placeholder="Enter your email or phone"
                placeholderTextColor="#BDBDBD"
                onChangeText={(text) => {
                  setIdentifier(text);
                  if (errors.identifier)
                    setErrors({ ...errors, identifier: undefined });
                }}
                value={identifier}
                editable={!isLoading}
                className={`h-14 w-full rounded-xl border-2 bg-white dark:bg-neutral-dark px-4 pl-12 text-base text-text-main-light dark:text-text-main-dark focus:border-primary ${
                  errors.identifier
                    ? "border-red-500"
                    : "border-neutral-light dark:border-neutral-dark"
                }`}
              />
              <MaterialIcons
                name="person"
                size={24}
                color={errors.identifier ? "#EF4444" : "#4F4F4F"}
                style={{ position: "absolute", left: 16 }}
              />
            </View>
            {errors.identifier && (
              <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
                {errors.identifier}
              </Text>
            )}
          </View>
        </View>

        {/* Password Field */}
        <View className="flex w-full flex-col">
          <Text className="mb-2 ml-1 text-sm font-semibold text-gray-custom font-display">
            Password
          </Text>
          <View className="relative flex w-full flex-col">
            <View className="relative flex w-full flex-row items-center">
              <TextInput
                placeholder="••••••••"
                placeholderTextColor="#BDBDBD"
                secureTextEntry={!showPassword}
                onChangeText={(text) => {
                  setPassword(text);
                  if (errors.password)
                    setErrors({ ...errors, password: undefined });
                }}
                value={password}
                editable={!isLoading}
                className={`h-14 w-full rounded-xl border-2 bg-white dark:bg-neutral-dark px-4 pl-12 pr-12 text-base text-text-main-light dark:text-text-main-dark focus:border-primary ${
                  errors.password
                    ? "border-red-500"
                    : "border-neutral-light dark:border-neutral-dark"
                }`}
              />
              <MaterialIcons
                name="lock"
                size={24}
                color={errors.password ? "#EF4444" : "#4F4F4F"}
                style={{ position: "absolute", left: 16 }}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={{ position: "absolute", right: 16 }}
                disabled={isLoading}
              >
                <MaterialIcons
                  name={showPassword ? "visibility" : "visibility-off"}
                  size={24}
                  color="#4F4F4F"
                />
              </TouchableOpacity>
            </View>
            {errors.password && (
              <Text className="ml-1 mt-1 text-xs text-red-500 font-display">
                {errors.password}
              </Text>
            )}
          </View>
        </View>

        {/* Login Button */}
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={isLoading}
          className={`mt-2 flex h-14 w-full items-center justify-center rounded-xl bg-primary shadow-sm active:opacity-90 ${
            isLoading ? "opacity-70" : ""
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-lg font-bold text-white font-display">
              Log In
            </Text>
          )}
        </TouchableOpacity>

        {/* Remember Me & Forgot Password */}
        <View className="flex flex-row items-center justify-between px-1">
          <TouchableOpacity className="flex flex-row items-center gap-2">
            <View className="h-5 w-5 rounded border border-neutral-light items-center justify-center bg-primary">
              <MaterialIcons name="check" size={16} color="white" />
            </View>
            <Text className="text-sm font-medium text-gray-custom font-display">
              Remember me
            </Text>
          </TouchableOpacity>
          <Pressable onPress={() => router.push("/(auth)/forgotPassword")}>
            <Text className="text-sm font-medium text-gray-custom pressed:text-primary font-display">
              Forgot Password?
            </Text>
          </Pressable>
        </View>

        {/* Dividend */}
        <View className="relative flex flex-row items-center py-6">
          <View className="flex-grow border-t border-neutral-light dark:border-neutral-dark/50" />
          <Text className="mx-4 flex-shrink text-sm font-medium text-[#4F4F4F] font-display">
            Or continue with
          </Text>
          <View className="flex-grow border-t border-neutral-light dark:border-neutral-dark/50" />
        </View>

        {/* Social Buttons */}
        <View className="mb-8 flex flex-row justify-between gap-4">
          {/* Google */}
          <TouchableOpacity className="flex h-14 flex-1 items-center justify-center rounded-xl border border-neutral-light dark:border-neutral-dark/50 bg-white dark:bg-neutral-dark hover:bg-neutral-light">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M23.7663 12.2764C23.7663 11.4607 23.7001 10.6406 23.5882 9.83804H12.2402V14.459H18.722C18.4331 15.9494 17.5888 17.2678 16.3233 18.1056V21.1039H20.1903C22.4611 19.0139 23.7663 15.9273 23.7663 12.2764Z"
                fill="#4285F4"
              />
              <Path
                d="M12.2399 24.0008C15.4764 24.0008 18.2057 22.9382 20.1943 21.1039L16.3273 18.1055C15.2515 18.8375 13.8625 19.252 12.2443 19.252C9.11366 19.252 6.45924 17.1399 5.50683 14.3003H1.51636V17.3912C3.55349 21.4434 7.70268 24.0008 12.2399 24.0008Z"
                fill="#34A853"
              />
              <Path
                d="M5.50277 14.3003C5.00209 12.8099 5.00209 11.1961 5.50277 9.70575V6.61481H1.51649C-0.185283 10.0056 -0.185283 14.0004 1.51649 17.3912L5.50277 14.3003Z"
                fill="#FBBC05"
              />
              <Path
                d="M12.2399 4.74966C13.9507 4.7232 15.6042 5.36697 16.8437 6.54867L20.2693 3.12262C18.0999 1.0855 15.2206 -0.0344664 12.2399 0.000808666C7.70268 0.000808666 3.55349 2.55822 1.51636 6.61481L5.50264 9.70575C6.45042 6.86173 9.10924 4.74966 12.2399 4.74966Z"
                fill="#EA4335"
              />
            </Svg>
          </TouchableOpacity>

          {/* Apple */}
          <TouchableOpacity className="flex h-14 flex-1 items-center justify-center rounded-xl border border-neutral-light dark:border-neutral-dark/50 bg-white dark:bg-neutral-dark hover:bg-neutral-light">
            <Svg
              width={24}
              height={24}
              viewBox="0 0 24 24"
              fill={isDark ? "white" : "black"}
            >
              <Path d="M17.0506 12.6075C17.0673 10.6358 18.7262 9.53974 18.8117 9.48974C17.7656 7.96224 16.1439 7.75557 15.5898 7.73057C14.1989 7.58891 12.8681 8.54891 12.1648 8.54891C11.4506 8.54891 10.3348 7.74224 9.17228 7.76474C7.66978 7.78474 6.29478 8.63641 5.52228 9.98057C3.93144 12.7364 5.11894 16.8281 6.66644 19.0681C7.42561 20.1656 8.31811 21.3656 9.52811 21.3197C10.6864 21.2722 11.1323 20.5972 12.5698 20.5972C14.0048 20.5972 14.4164 21.3197 15.6556 21.2972C16.9231 21.2722 17.7114 20.1364 18.4598 19.0431C19.0464 18.1881 19.2848 17.7531 19.5648 17.2031C19.4939 17.1706 17.0273 16.2256 17.0506 12.6075ZM12.9806 6.01474C13.6339 5.22307 14.0723 4.12057 13.9514 3.01891C13.0189 3.12307 11.8906 3.63974 11.2189 4.41724C10.6273 5.09307 10.1081 6.20807 10.2506 7.28391C11.2889 7.36474 12.3398 6.80474 12.9806 6.01474Z" />
            </Svg>
          </TouchableOpacity>

          {/* Facebook */}
          <TouchableOpacity className="flex h-14 flex-1 items-center justify-center rounded-xl border border-neutral-light dark:border-neutral-dark/50 bg-white dark:bg-neutral-dark hover:bg-neutral-light">
            <Svg width={24} height={24} viewBox="0 0 24 24" fill="none">
              <Path
                d="M24 12.073C24 5.40562 18.6274 0 12 0C5.37258 0 0 5.40562 0 12.073C0 18.1001 4.38823 23.0957 10.125 24V15.5619H7.07813V12.073H10.125V9.41215C10.125 6.38627 11.9165 4.71536 14.6576 4.71536C15.9705 4.71536 17.3438 4.9515 17.3438 4.9515V7.92215H15.8306C14.3399 7.92215 13.875 8.85292 13.875 9.80802V12.073H17.2031L16.6711 15.5619H13.875V24C19.6118 23.0957 24 18.1001 24 12.073Z"
                fill="#1877F2"
              />
            </Svg>
          </TouchableOpacity>
        </View>

        {/* Continue as Guest */}
        <View className="mt-auto flex justify-center">
          <TouchableOpacity className="group flex flex-row items-center justify-center gap-1">
            <Text className="text-sm font-semibold text-primary font-display">
              Continue as Guest
            </Text>
            <MaterialIcons name="chevron-right" size={20} color="#359EFF" />
          </TouchableOpacity>
        </View>

        {/* Footer Text */}
        <Text className="mt-6 text-center text-xs leading-relaxed text-[#4F4F4F] font-display">
          By logging in, you agree to our{" "}
          <Text className="text-[#4F4F4F] underline">Terms of Service</Text> and{" "}
          <Text className="text-[#4F4F4F] underline">Privacy Policy</Text>.
        </Text>
      </View>
    </ScrollView>
  );
}
