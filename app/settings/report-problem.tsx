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

const ISSUE_TYPES = [
  "Technical Issue",
  "Account Access",
  "Trip Request Issue",
  "Client Issue",
  "Payout Issue",
  "Verification Issue",
  "General Feedback",
  "Other",
];

export default function ReportProblemScreen() {
  const insets = useSafeAreaInsets();
  const [issueType, setIssueType] = useState("");
  const [showOptions, setShowOptions] = useState(false);
  const [description, setDescription] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Report a Problem</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 120 }}>
        {/* Issue Type Dropdown */}
        <Text className="text-xs font-semibold text-[#4c9a9a] uppercase tracking-widest mb-3 ml-1">Issue Type</Text>
        <Pressable
          onPress={() => setShowOptions(!showOptions)}
          className="flex-row items-center bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark px-4 h-14 shadow-sm mb-2"
        >
          <Text className={`flex-1 text-sm font-medium ${issueType ? "text-[#0d1b1b] dark:text-white" : "text-[#9ca3af]"}`}>
            {issueType || "Select issue type"}
          </Text>
          <MaterialIcons name={showOptions ? "expand-less" : "expand-more"} size={20} color="#4c9a9a" />
        </Pressable>

        {showOptions && (
          <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
            {ISSUE_TYPES.map((type, i) => (
              <Pressable
                key={type}
                onPress={() => {
                  setIssueType(type);
                  setShowOptions(false);
                }}
                className={`px-4 py-3.5 ${
                  i !== ISSUE_TYPES.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
                } ${issueType === type ? "bg-primary/5" : ""}`}
              >
                <Text
                  className={`text-sm font-medium ${
                    issueType === type ? "text-primary" : "text-[#0d1b1b] dark:text-white"
                  }`}
                >
                  {type}
                </Text>
              </Pressable>
            ))}
          </View>
        )}

        {/* Description */}
        <Text className="text-xs font-semibold text-[#4c9a9a] uppercase tracking-widest mb-3 ml-1 mt-2">Description</Text>
        <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
          <View className="px-4 py-4">
            <TextInput
              value={description}
              onChangeText={setDescription}
              placeholder="Describe the issue you're experiencing..."
              placeholderTextColor="#9ca3af"
              multiline
              numberOfLines={5}
              textAlignVertical="top"
              className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
              style={{ minHeight: 120 }}
            />
          </View>
        </View>

        {/* Add Screenshot */}
        <Pressable className="border-2 border-dashed border-neutral-light dark:border-neutral-dark rounded-2xl h-28 items-center justify-center bg-white/50 dark:bg-neutral-dark/50">
          <MaterialIcons name="camera-alt" size={28} color="#4c9a9a" />
          <Text className="text-xs font-semibold text-[#4c9a9a] mt-2">Add Screenshot (Optional)</Text>
        </Pressable>
      </ScrollView>

      {/* Submit */}
      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
          <Text className="text-white font-bold text-base">Submit Report</Text>
        </Pressable>
      </View>
    </View>
  );
}
