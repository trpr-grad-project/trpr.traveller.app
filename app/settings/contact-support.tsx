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
  contactSupportSchema,
  type ContactSupportFormData,
} from "@/utils/validation";

export default function ContactSupportScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ContactSupportFormData>({
    resolver: zodResolver(contactSupportSchema),
    defaultValues: { subject: "", message: "" },
  });

  const onSubmit = async (_data: ContactSupportFormData) => {};

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Contact Support</Text>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
          <Pressable className="flex-row items-center justify-center gap-2 h-12 rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark mb-6">
            <MaterialIcons name="mail-outline" size={18} color="#359EFF" />
            <Text className="text-sm font-bold text-primary">Email Us</Text>
          </Pressable>

          <Text className="text-xs font-bold text-sub-light uppercase tracking-widest mb-3 ml-1">Send a Message</Text>

          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-3">
            <View className="px-4 py-4">
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">Subject</Text>
              <Controller
                control={control}
                name="subject"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="What is this about?"
                    placeholderTextColor="#9ca3af"
                    className="text-sm font-medium text-main-light dark:text-white p-0"
                  />
                )}
              />
              {errors.subject && (
                <Text className="text-xs text-red-500 mt-1">{errors.subject.message}</Text>
              )}
            </View>
          </View>

          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-3">
            <View className="px-4 py-4">
              <Text className="text-[10px] font-bold text-sub-light uppercase tracking-wider mb-1">Message</Text>
              <Controller
                control={control}
                name="message"
                render={({ field: { onChange, value } }) => (
                  <TextInput
                    value={value}
                    onChangeText={onChange}
                    placeholder="Describe your issue in detail..."
                    placeholderTextColor="#9ca3af"
                    multiline
                    numberOfLines={5}
                    textAlignVertical="top"
                    className="text-sm font-medium text-main-light dark:text-white p-0"
                    style={{ minHeight: 100 }}
                  />
                )}
              />
              {errors.message && (
                <Text className="text-xs text-red-500 mt-1">{errors.message.message}</Text>
              )}
            </View>
          </View>

          <View className="flex-row items-center gap-2 opacity-60">
            <MaterialIcons name="access-time" size={14} color="#64748b" />
            <Text className="text-xs text-sub-light">Average response time: 2 hours</Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton
          title="Submit Message"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </View>
  );
}
