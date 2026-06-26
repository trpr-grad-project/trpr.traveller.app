import React from "react";
import {
  Image,
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
  editProfileSchema,
  type EditProfileFormData,
} from "@/utils/validation";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditProfileFormData>({
    resolver: zodResolver(editProfileSchema),
    defaultValues: {
      name: "Alex Traveller",
      email: "alex.travels@example.com",
      phone: "+1 (555) 123-4567",
      location: "San Francisco, CA",
      bio: "Exploring the world, one city at a time. Always looking for the best coffee spots.",
    },
  });

  const onSubmit = async (_data: EditProfileFormData) => {};

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-neutral-dark">
        <View className="w-10 h-10 items-center justify-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        </View>
        <Text className="text-lg font-bold text-main-light dark:text-white">Edit Profile</Text>
        <View className="w-10" />
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
          <View className="items-center py-8">
            <View className="relative">
              <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1Ny8NfxYlL2K2CAa03QmHEEhygawzlgk7zIY9l3hPUOYdk48MDEjEC4F3cT6xP9z_SwqoscM9EMw-QuvceAiSJ4UQZhf0XrzZMYG6QPZu8S0wiUosX9XOSKXmKv6VQPTkaopqyz-GGGi26uS6DjMK1Tz03RJwwMsyn51jsSBWaNg3SBel8agXN9jh4O1iy0RfJNeR2TiiD5dbZ6xBTkqUu28DcRZ-TbWsRZ7RLAK9fcPCjAkRUTeuVjTZc130tXWb7cuEnrfEFHK" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
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
            {[
              { label: "Full Name", name: "name" as const, icon: "person" as const },
              { label: "Email", name: "email" as const, icon: "mail" as const },
              { label: "Phone", name: "phone" as const, icon: "phone" as const },
              { label: "Location", name: "location" as const, icon: "location-on" as const },
            ].map((field, i, arr) => (
              <View
                key={field.name}
                className={`flex-row items-center px-4 py-4 gap-3 ${
                  i !== arr.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
                }`}
              >
                <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                  <MaterialIcons name={field.icon} size={18} color="#64748b" />
                </View>
                <View className="flex-1">
                  <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-0.5">{field.label}</Text>
                  <Controller
                    control={control}
                    name={field.name}
                    render={({ field: { onChange, value } }) => (
                      <TextInput
                        value={value}
                        onChangeText={onChange}
                        className="text-sm font-medium text-main-light dark:text-white p-0"
                      />
                    )}
                  />
                  {errors[field.name] && (
                    <Text className="text-xs text-red-500 mt-0.5">{errors[field.name]?.message}</Text>
                  )}
                </View>
                <MaterialIcons name="edit" size={16} color="#64748b" />
              </View>
            ))}
          </View>

          <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm p-4 mb-4">
            <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-2">Bio</Text>
            <Controller
              control={control}
              name="bio"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  multiline
                  numberOfLines={3}
                  textAlignVertical="top"
                  className="text-sm text-main-light dark:text-white leading-relaxed"
                  style={{ minHeight: 72 }}
                />
              )}
            />
            {errors.bio && (
              <Text className="text-xs text-red-500 mt-1">{errors.bio.message}</Text>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton
          title="Save Changes"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );
}
