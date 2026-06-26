import React, { useState } from "react";
import { Image, KeyboardAvoidingView, Platform, Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";

const THEMES = ["Adventure", "Culture", "Relax", "Historical", "Food", "Nature"];

const LANGUAGES = ["English", "Arabic", "French", "Spanish", "German"];

export default function CreatePlanScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [visibility, setVisibility] = useState<"private" | "public">("private");
  const [planName, setPlanName] = useState("Luxor Ancient Wonders");
  const [description, setDescription] = useState("A journey through the ancient wonders of Luxor, exploring temples and tombs.");
  const [location, setLocation] = useState("Luxor, Egypt");
  const [theme, setTheme] = useState("Historical");
  const [maxParticipants, setMaxParticipants] = useState(5);
  const [languages, setLanguages] = useState<string[]>(["English", "Arabic"]);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [showPublicOptions, setShowPublicOptions] = useState(false);

  const toggleLanguage = (lang: string) => {
    setLanguages((prev) =>
      prev.includes(lang) ? prev.filter((l) => l !== lang) : [...prev, lang]
    );
  };

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center bg-white/80 dark:bg-background-dark/80 border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-4">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" className="-ml-2" />
        <Text className="flex-1 text-center mr-8 text-lg font-bold text-[#0c141d] dark:text-white">Create Your Plan</Text>
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} className="flex-1">
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 100 }}>
        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 gap-4">
          <Text className="text-sm font-bold text-[#0c141d] dark:text-white uppercase tracking-wider opacity-70">General Info</Text>

          <View className="relative w-full h-40 rounded-xl overflow-hidden bg-slate-200">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" }}
              className="w-full h-full"
              resizeMode="cover"
            />
            <Pressable className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 items-center justify-center">
              <MaterialIcons name="close" size={18} color="white" />
            </Pressable>
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-500 mb-1.5">Plan Name</Text>
            <TextInput
              value={planName}
              onChangeText={setPlanName}
              className="w-full h-12 px-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-[#0c141d] dark:text-white"
            />
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-500 mb-1.5">Description</Text>
            <TextInput
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              className="w-full p-4 bg-slate-50 dark:bg-slate-900 rounded-xl text-sm font-medium text-[#0c141d] dark:text-white"
              style={{ minHeight: 72 }}
            />
          </View>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
          <Text className="text-sm font-bold text-[#0c141d] dark:text-white uppercase tracking-wider opacity-70 mb-3">Visibility</Text>

          <Pressable
            onPress={() => { setVisibility("private"); setShowPublicOptions(false); }}
            className={`flex-row items-center gap-3 p-3 rounded-xl mb-2 ${visibility === "private" ? "bg-primary/10 border border-primary/20" : "bg-white dark:bg-slate-800"}`}
          >
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${visibility === "private" ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-600"}`}>
              {visibility === "private" && <View className="w-2 h-2 rounded-full bg-white" />}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Private</Text>
              <Text className="text-xs text-slate-500">Only people you invite can see this plan</Text>
            </View>
            <MaterialIcons name="lock" size={20} color={visibility === "private" ? "#359EFF" : "#94a3b8"} />
          </Pressable>

          <Pressable
            onPress={() => { setVisibility("public"); setShowPublicOptions(true); }}
            className={`flex-row items-center gap-3 p-3 rounded-xl ${visibility === "public" ? "bg-primary/10 border border-primary/20" : "bg-white dark:bg-slate-800"}`}
          >
            <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${visibility === "public" ? "border-primary bg-primary" : "border-slate-200 dark:border-slate-600"}`}>
              {visibility === "public" && <View className="w-2 h-2 rounded-full bg-white" />}
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Public</Text>
              <Text className="text-xs text-slate-500">Make this plan visible to the community</Text>
            </View>
            <MaterialIcons name="public" size={20} color={visibility === "public" ? "#359EFF" : "#94a3b8"} />
          </Pressable>
        </View>

        <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 gap-4">
          <Text className="text-sm font-bold text-[#0c141d] dark:text-white uppercase tracking-wider opacity-70">Destination & Vibe</Text>

          <View>
            <Text className="text-xs font-semibold text-slate-500 mb-1.5">Location</Text>
            <View className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-xl px-4 gap-2 h-12">
              <MaterialIcons name="location-on" size={18} color="#359EFF" />
              <TextInput
                value={location}
                onChangeText={setLocation}
                className="flex-1 text-sm font-medium text-[#0c141d] dark:text-white"
              />
            </View>
          </View>

          <View>
            <Text className="text-xs font-semibold text-slate-500 mb-1.5">Theme</Text>
            <View className="flex-row flex-wrap gap-2">
              {THEMES.map((t) => (
                <Pressable
                  key={t}
                  onPress={() => setTheme(t)}
                  className={`px-4 py-2 rounded-full ${theme === t ? "bg-primary border-primary" : "bg-slate-50 dark:bg-slate-700 border border-slate-100 dark:border-slate-600"}`}
                >
                  <Text className={`text-xs font-bold ${theme === t ? "text-white" : "text-slate-600 dark:text-slate-300"}`}>{t}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>

        {showPublicOptions && (
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 gap-4">
            <Text className="text-sm font-bold text-[#0c141d] dark:text-white uppercase tracking-wider opacity-70">Group Options</Text>

            <View>
              <Text className="text-xs font-semibold text-slate-500 mb-1.5">Max Participants</Text>
              <View className="flex-row items-center justify-between bg-slate-50 dark:bg-slate-800/50 rounded-2xl px-4 py-3 border border-slate-100 dark:border-slate-700">
                <Pressable
                  onPress={() => setMaxParticipants(Math.max(2, maxParticipants - 1))}
                  className="w-10 h-10 rounded-full border-2 border-slate-200 dark:border-slate-600 items-center justify-center"
                >
                  <MaterialIcons name="remove" size={20} color="#64748b" />
                </Pressable>
                <Text className="text-xl font-bold text-[#0c141d] dark:text-white">{maxParticipants}</Text>
                <Pressable
                  onPress={() => setMaxParticipants(Math.min(50, maxParticipants + 1))}
                  className="w-10 h-10 rounded-full bg-primary items-center justify-center"
                >
                  <MaterialIcons name="add" size={20} color="white" />
                </Pressable>
              </View>
            </View>

            <View>
              <View className="flex-row items-center justify-between mb-1.5">
                <Text className="text-xs font-semibold text-slate-500">Language Preference</Text>
                <Pressable onPress={() => setLanguageOpen(!languageOpen)}>
                  <MaterialIcons name={languageOpen ? "expand-less" : "expand-more"} size={20} color="#359EFF" />
                </Pressable>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {languages.map((lang) => (
                  <View key={lang} className="flex-row items-center gap-1 px-3 py-1.5 bg-primary/10 rounded-full">
                    <Text className="text-xs font-semibold text-primary">{lang}</Text>
                    <Pressable onPress={() => toggleLanguage(lang)}>
                      <MaterialIcons name="close" size={14} color="#359EFF" />
                    </Pressable>
                  </View>
                ))}
                <Pressable
                  onPress={() => setLanguageOpen(!languageOpen)}
                  className="px-3 py-1.5 rounded-full border border-primary/30"
                >
                  <MaterialIcons name="add" size={16} color="#359EFF" />
                </Pressable>
              </View>
              {languageOpen && (
                <View className="mt-2 bg-slate-50 dark:bg-slate-700 rounded-xl overflow-hidden">
                  {LANGUAGES.filter((l) => !languages.includes(l)).map((lang) => (
                    <Pressable
                      key={lang}
                      onPress={() => { toggleLanguage(lang); setLanguageOpen(false); }}
                      className="px-4 py-3 border-b border-slate-100 dark:border-slate-600 last:border-b-0"
                    >
                      <Text className="text-sm font-medium text-[#0c141d] dark:text-white">{lang}</Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton
          title="Create Plan"
          onPress={() => router.push("/trips/planCreated/1")}
        />
      </View>
    </View>
  );
}
