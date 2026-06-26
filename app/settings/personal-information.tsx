import React from "react";
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
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import {
  personalInfoSchema,
  type PersonalInfoFormData,
} from "@/utils/validation";

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PersonalInfoFormData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: {
      name: "Alex Traveller",
      email: "alex.traveller@example.com",
      phone: "+1 (555) 123-4567",
      dob: "1994-03-15",
    },
  });

  const onSubmit = async (_data: PersonalInfoFormData) => {};

  const FIELDS = [
    { label: "Full Name", name: "name" as const, icon: "person" as const, keyboardType: "default" as const },
    { label: "Email", name: "email" as const, icon: "mail" as const, keyboardType: "email-address" as const },
    { label: "Phone Number", name: "phone" as const, icon: "phone" as const, keyboardType: "phone-pad" as const },
    { label: "Date of Birth", name: "dob" as const, icon: "calendar-today" as const, keyboardType: "default" as const },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Personal Information</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="items-center py-8">
            <View className="relative">
              <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg">
                <View className="flex-1 bg-primary/20 items-center justify-center">
                  <Text className="text-3xl font-bold text-primary">AT</Text>
                </View>
              </View>
              <Pressable className="absolute bottom-1 right-1 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-md">
                <MaterialIcons name="photo-camera" size={18} color="white" />
              </Pressable>
            </View>
            <Pressable>
              <Text className="text-primary font-semibold text-sm mt-3">Change Photo</Text>
            </Pressable>
          </View>

          <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
            {FIELDS.map((field, i, arr) => (
              <View
                key={field.label}
                className={`px-4 py-4 ${
                  i !== arr.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
                }`}
              >
                <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">
                  {field.label}
                </Text>
                <Controller
                  control={control}
                  name={field.name}
                  render={({ field: { onChange, value } }) => (
                    <View className="flex-row items-center gap-2">
                      <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                        <MaterialIcons name={field.icon} size={18} color="#64748b" />
                      </View>
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        keyboardType={field.keyboardType}
                        className="flex-1 text-sm font-medium text-main-light dark:text-white p-0"
                        placeholderTextColor="#9ca3af"
                      />
                      <MaterialIcons name="edit" size={16} color="#64748b" />
                    </View>
                  )}
                />
                {errors[field.name] && (
                  <Text className="text-xs text-red-500 mt-1 ml-1">
                    {errors[field.name]?.message}
                  </Text>
                )}
              </View>
            ))}
          </View>

          <View className="mx-4 mb-8">
            <PrimaryButton
              title="Save Changes"
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
            />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}
