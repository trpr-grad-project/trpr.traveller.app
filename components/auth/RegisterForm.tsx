import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";
import { useAuth } from "@/context/AuthContext";
import { getErrorMessage } from "@/utils/errorHandler";
import { registerSchema, type RegisterFormData } from "@/utils/validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useCallback, useRef } from "react";
import { Controller, useForm } from "react-hook-form";
import { TextInput, View } from "react-native";
import Toast from "react-native-toast-message";

export default function RegisterForm() {
  const router = useRouter();
  const { register } = useAuth();

  const emailRef = useRef<TextInput>(null);
  const passwordRef = useRef<TextInput>(null);
  const confirmRef = useRef<TextInput>(null);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = useCallback(
    async (data: RegisterFormData) => {
      try {
        const [firstName, ...rest] = data.username.trim().split(/\s+/);
        const lastName = rest.join(" ") || "";

        const response = await register({
          identifier: data.email,
          firstName,
          lastName,
          password: data.password,
        });

        if (response.otpId) {
          router.push({
            pathname: "/(auth)/otpVerification",
            params: {
              action: "register",
              identifier: data.email,
              otpId: response.otpId,
            },
          });
        }
      } catch (error) {
        Toast.show({
          type: "error",
          text1: "Sign Up Failed",
          text2: getErrorMessage(error, "Something went wrong"),
        });
      }
    },
    [register, router],
  );

  return (
    <View className="flex flex-col gap-5">
      <Controller
        control={control}
        name="username"
        render={({ field: { onChange, value } }) => (
          <FormInput
            label="Username"
            icon="person-outline"
            value={value}
            onChangeText={onChange}
            error={errors.username?.message}
            placeholder="Choose a username"
            editable={!isSubmitting}
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => emailRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <FormInput
            ref={emailRef}
            label="Email"
            icon="mail-outline"
            value={value}
            onChangeText={onChange}
            error={errors.email?.message}
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
            returnKeyType="next"
            submitBehavior="submit"
            onSubmitEditing={() => confirmRef.current?.focus()}
          />
        )}
      />

      <Controller
        control={control}
        name="confirmPassword"
        render={({ field: { onChange, value } }) => (
          <FormInput
            ref={confirmRef}
            label="Confirm Password"
            icon="lock-outline"
            value={value}
            onChangeText={onChange}
            error={errors.confirmPassword?.message}
            placeholder="••••••••"
            secure
            editable={!isSubmitting}
            returnKeyType="done"
            onSubmitEditing={handleSubmit(onSubmit)}
          />
        )}
      />

      <PrimaryButton
        title="Sign Up"
        onPress={handleSubmit(onSubmit)}
        isLoading={isSubmitting}
      />
    </View>
  );
}
