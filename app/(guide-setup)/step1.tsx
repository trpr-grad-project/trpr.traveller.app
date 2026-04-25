import React, { useState } from "react";
import {
  Image,
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

const LANGUAGES = ["English", "Arabic", "Spanish", "French", "German", "Italian", "Japanese"];

export default function GuideProfileStep1() {
  const insets = useSafeAreaInsets();
  const [selectedLangs, setSelectedLangs] = useState<string[]>(["English", "Arabic"]);
  const [name, setName] = useState("Ahmed Ali");
  const [bio, setBio] = useState("");

  const toggleLanguage = (lang: string) => {
    setSelectedLangs((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-slate-900" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 pt-2 pb-0">
        <Pressable
          onPress={() => router.back()}
          className="w-10 h-10 rounded-full items-center justify-center"
        >
          <MaterialIcons name="chevron-left" size={28} color="#0f172a" />
        </Pressable>
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center">
          Complete Profile
        </Text>
        <View className="w-10" />
      </View>

      <ScrollView
        className="flex-1 px-6 pt-8"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* Title */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2 text-center">
            Build your guide profile
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed text-center">
            Complete your profile to start receiving booking requests from travelers around the world.
          </Text>
        </View>

        {/* Profile picture */}
        <View className="items-center mb-10">
          <View className="relative group">
            <View className="w-32 h-32 rounded-full border-4 border-slate-50 dark:border-slate-800 bg-slate-100 overflow-hidden items-center justify-center">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBDfih114tNHkV3CEshQybM7b6MZZuy_Zgj13iRrECuEeQyguIt-50CmwAb0y_BJz_mn4vTA5hQ7gBsE8QbuvaUieQ26FmHGpPuq1MwqlJQ-28TkcdZGjVlYV28mNOy-N6RnVFY_Zl21mXADzIobD8Nq_m92_lfsnR8KRlx-V0BCwLB6wURneyDC-euqVA5mKkCPsDzpEuvNg78ADl1JQu05ZHljuxoYj47gKsW0lccyrTP2LcK3GdlCggEEd3_f9KqOWt2i_13hePM" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Pressable className="absolute bottom-0 right-0 w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-white dark:border-slate-900 shadow-lg">
              <MaterialIcons name="photo-camera" size={20} color="white" />
            </Pressable>
          </View>
        </View>

        {/* Form fields */}
        <View className="gap-6">
          {/* Full name */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Full Name</Text>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your full name"
              placeholderTextColor="#94a3b8"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-base"
            />
          </View>

          {/* Bio */}
          <View className="gap-2">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Short Description</Text>
            <TextInput
              value={bio}
              onChangeText={setBio}
              placeholder="Tell travelers a bit about your expertise and passion for guiding..."
              placeholderTextColor="#94a3b8"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-xl text-slate-900 dark:text-slate-100 text-base"
              style={{ minHeight: 100 }}
            />
          </View>

          {/* Languages */}
          <View className="gap-3">
            <Text className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1">Languages</Text>
            <View className="flex-row flex-wrap gap-2">
              {LANGUAGES.map((lang) => {
                const selected = selectedLangs.includes(lang);
                return (
                  <Pressable
                    key={lang}
                    onPress={() => toggleLanguage(lang)}
                    className={`px-4 py-2 rounded-full border ${
                      selected
                        ? "bg-primary border-primary"
                        : "bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700"
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        selected ? "text-white" : "text-slate-600 dark:text-slate-400"
                      }`}
                    >
                      {lang}
                    </Text>
                  </Pressable>
                );
              })}
              <Pressable className="flex-row items-center gap-1 px-4 py-2 rounded-full bg-slate-100 dark:bg-slate-700 border border-dashed border-slate-300 dark:border-slate-600">
                <MaterialIcons name="add" size={16} color="#64748b" />
                <Text className="text-sm font-medium text-slate-500 dark:text-slate-300">Add</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* CTA Footer */}
      <View
        className="px-6 py-4 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.push("/(guide-setup)/step2")}
          className="w-full bg-primary py-4 rounded-xl items-center justify-center shadow-lg active:opacity-90"
          style={{ shadowColor: "#359EFF", shadowOpacity: 0.2 }}
        >
          <Text className="text-white font-bold text-base">Continue</Text>
        </Pressable>
      </View>
    </View>
  );
}
