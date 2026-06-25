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

const getStrengthLevel = (pw: string) => {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
};

const STRENGTH_LABELS = ["Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["#ef4444", "#f97316", "#eab308", "#22c55e"];

export default function ChangePasswordScreen() {
  const insets = useSafeAreaInsets();
  const [currentPw, setCurrentPw] = useState("");
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const strength = getStrengthLevel(newPw);

  const meetsLength = newPw.length >= 8;
  const meetsNumber = /[0-9]/.test(newPw);
  const meetsSpecial = /[^a-zA-Z0-9]/.test(newPw);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Change Password</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {/* Current Password */}
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-4">
          <View className="flex-row items-center px-4 py-4 gap-3">
            <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
              <MaterialIcons name="lock-outline" size={18} color="#4c9a9a" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-0.5">Current Password</Text>
              <TextInput
                value={currentPw}
                onChangeText={setCurrentPw}
                secureTextEntry={!showCurrent}
                placeholder="Enter current password"
                placeholderTextColor="#9ca3af"
                className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
              />
            </View>
            <Pressable onPress={() => setShowCurrent(!showCurrent)}>
              <MaterialIcons name={showCurrent ? "visibility-off" : "visibility"} size={20} color="#4c9a9a" />
            </Pressable>
          </View>
        </View>

        {/* New Password */}
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-3">
          <View className="flex-row items-center px-4 py-4 gap-3">
            <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
              <MaterialIcons name="lock" size={18} color="#4c9a9a" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-0.5">New Password</Text>
              <TextInput
                value={newPw}
                onChangeText={setNewPw}
                secureTextEntry={!showNew}
                placeholder="Enter new password"
                placeholderTextColor="#9ca3af"
                className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
              />
            </View>
            <Pressable onPress={() => setShowNew(!showNew)}>
              <MaterialIcons name={showNew ? "visibility-off" : "visibility"} size={20} color="#4c9a9a" />
            </Pressable>
          </View>
        </View>

        {/* Strength Bar */}
        <View className="flex-row gap-1 mb-4 px-1">
          {[0, 1, 2, 3].map((i) => (
            <View
              key={i}
              className="flex-1 h-1.5 rounded-full"
              style={{ backgroundColor: i < strength ? STRENGTH_COLORS[strength] : "#e5e7eb" }}
            />
          ))}
        </View>

        {/* Validation rules */}
        <View className="space-y-2 mb-4 px-1">
          <View className="flex-row items-center gap-2">
            <View className={`w-4 h-4 rounded-full border ${meetsLength ? "bg-green-500 border-green-500" : "border-[#4c9a9a]"}`}>
              {meetsLength && <MaterialIcons name="check" size={12} color="white" style={{ margin: 1 }} />}
            </View>
            <Text className="text-xs text-[#4c9a9a]">At least 8 characters</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className={`w-4 h-4 rounded-full border ${meetsNumber ? "bg-green-500 border-green-500" : "border-[#4c9a9a]"}`}>
              {meetsNumber && <MaterialIcons name="check" size={12} color="white" style={{ margin: 1 }} />}
            </View>
            <Text className="text-xs text-[#4c9a9a]">Contains a number</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className={`w-4 h-4 rounded-full border ${meetsSpecial ? "bg-green-500 border-green-500" : "border-[#4c9a9a]"}`}>
              {meetsSpecial && <MaterialIcons name="check" size={12} color="white" style={{ margin: 1 }} />}
            </View>
            <Text className="text-xs text-[#4c9a9a]">Contains a special character</Text>
          </View>
        </View>

        {/* Confirm Password */}
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm mb-6">
          <View className="flex-row items-center px-4 py-4 gap-3">
            <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
              <MaterialIcons name="lock" size={18} color="#4c9a9a" />
            </View>
            <View className="flex-1">
              <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-0.5">Confirm Password</Text>
              <TextInput
                value={confirmPw}
                onChangeText={setConfirmPw}
                secureTextEntry={!showConfirm}
                placeholder="Re-enter new password"
                placeholderTextColor="#9ca3af"
                className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
              />
            </View>
            <Pressable onPress={() => setShowConfirm(!showConfirm)}>
              <MaterialIcons name={showConfirm ? "visibility-off" : "visibility"} size={20} color="#4c9a9a" />
            </Pressable>
          </View>
        </View>

        {/* Submit */}
        <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
          <Text className="text-white font-bold text-base">Update Password</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}
