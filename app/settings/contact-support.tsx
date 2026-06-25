import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function ContactSupportScreen() {
  const insets = useSafeAreaInsets();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Contact Support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Email Us */}
        <Pressable className="flex-row items-center justify-center gap-2 h-12 rounded-xl border border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark mb-6">
          <MaterialIcons name="mail-outline" size={18} color="#359EFF" />
          <Text className="text-sm font-bold text-primary">Email Us</Text>
        </Pressable>

        {/* Send a Message */}
        <Text className="text-xs font-semibold text-[#4c9a9a] uppercase tracking-widest mb-3 ml-1">Send a Message</Text>

        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-3">
          <View className="px-4 py-4">
            <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-1">Subject</Text>
            <TextInput
              value={subject}
              onChangeText={setSubject}
              placeholder="What is this about?"
              placeholderTextColor="#9ca3af"
              className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
            />
          </View>
        </View>

        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-3">
          <View className="px-4 py-4">
            <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-1">Message</Text>
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Describe your issue in detail..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
              style={{ minHeight: 100 }}
            />
          </View>
        </View>

        {/* Response time */}
        <View className="flex-row items-center gap-2 opacity-60">
          <MaterialIcons name="access-time" size={14} color="#4c9a9a" />
          <Text className="text-xs text-[#4c9a9a]">Average response time: 2 hours</Text>
        </View>
      </ScrollView>

      {/* Submit */}
      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
          <Text className="text-white font-bold text-base">Submit Message</Text>
        </Pressable>
      </View>
    </View>
  );
}
