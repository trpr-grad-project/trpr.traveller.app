import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { Pressable, Text, TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function LogIn() {
  const router = useRouter();
  const { login } = useAuth();

  const passwordRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const onSubmit = useCallback(
    async (data: LoginFormData) => {
      try {
        await login(data.identifier, data.password);
      } catch (error: any) {
        const errorMessage =
          error.response?.data?.code ||
          error.message ||
          "Something went wrong. Please try again.";

        Toast.show({
          type: "error",
          text1: "Sign In Failed",
          text2: errorMessage,
        });
      }
    },
    [login],
  );

  return (
    <View className="flex flex-col gap-5">
      <Controller
        control={control}
        name="identifier"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Email"
            icon="mail-outline"
            value={value}
            onChangeText={onChange}
            error={errors.identifier?.message}
            placeholder="Enter your email"
            keyboardType="email-address"
            editable={!isSubmitting}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => passwordRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, value } }) => (
          <FormInput
            ref={passwordRef}
            label="Password"
            icon="lock-outline"
            value={value}
            onChangeText={onChange}
            error={errors.password?.message}
            placeholder="••••••••"
            secure
            editable={!isSubmitting}
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      <PrimaryButton
        title="Log In"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      />

      <Pressable
        onPress={() => router.push("/(auth)/forgotPassword")}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        className="self-end px-1"
        accessibilityRole="link"
      >
        {({ pressed }) => (
          <Text
            className={`text-sm font-medium font-display ${
              pressed ? "text-primary" : "text-gray-custom"
            }`}
          >
            Forgot Password?
          </Text>
        )}
      </Pressable>
    </View>
  );
}
