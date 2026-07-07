import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import { useProfile } from "@/context/ProfileContext";
import { profileService } from "@/services";
import { ProfileLanguage } from "@/types";

const LANG_EMOJI_MAP: Record<string, string> = {
  en: "\uD83C\uDDEC\uD83C\uDDE7",
  es: "\uD83C\uDDEA\uD83C\uDDF8",
  fr: "\uD83C\uDDEB\uD83C\uDDF7",
  de: "\uD83C\uDDE9\uD83C\uDDEA",
  zh: "\uD83C\uDDE8\uD83C\uDDF3",
  ja: "\uD83C\uDDEF\uD83C\uDDF5",
  ko: "\uD83C\uDDF0\uD83C\uDDF7",
  pt: "\uD83C\uDDF5\uD83C\uDDF9",
  ru: "\uD83C\uDDF7\uD83C\uDDFA",
  ar: "\uD83C\uDDF8\uD83C\uDDE6",
};

function LangIcon({ code }: { code: string }) {
  const emoji = LANG_EMOJI_MAP[code];
  if (emoji) {
    return <Text className="text-2xl">{emoji}</Text>;
  }
  return (
    <Text className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase">
      {code}
    </Text>
  );
}

function sortLanguages(languages: ProfileLanguage[]) {
  return [...languages].sort((a, b) => {
    if (a.code === "en") return -1;
    if (b.code === "en") return 1;
    if (a.code === "ar") return -1;
    if (b.code === "ar") return 1;
    return 0;
  });
}

const LanguageItem = React.memo(function LanguageItem({
  lang,
  isSelected,
  onPress,
}: {
  lang: ProfileLanguage;
  isSelected: boolean;
  onPress: (id: number) => void;
}) {
  return (
    <Pressable
      onPress={() => onPress(lang.id)}
      className={`flex-row items-center gap-4 rounded-xl border-2 p-4 active:scale-[0.98] ${
        isSelected
          ? "border-primary bg-white dark:bg-neutral-dark"
          : "border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark"
      }`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 12,
        elevation: 2,
      }}
    >
      <View className="size-12 items-center justify-center rounded-full bg-gray-50 dark:bg-gray-800">
        <LangIcon code={lang.code} />
      </View>

      <View className="flex-1">
        <Text className="text-[#1A1A1A] dark:text-white text-base font-semibold">
          {lang.name}
        </Text>
        <Text className="text-[#828282] dark:text-gray-400 text-xs font-normal">
          {lang.nativeName}
        </Text>
      </View>

      <View
        className={`h-6 w-6 rounded-md border-2 items-center justify-center ${
          isSelected
            ? "border-primary bg-primary"
            : "border-[#E0E0E0] dark:border-gray-600"
        }`}
      >
        {isSelected && <MaterialIcons name="check" size={16} color="white" />}
      </View>
    </Pressable>
  );
});

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const { languages: selectedLanguages, updateProfile } = useProfile();
  const [availableLanguages, setAvailableLanguages] = useState<ProfileLanguage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState<number[]>(
    selectedLanguages.map((l) => l.id),
  );
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    profileService
      .getProfileSetupData()
      .then((data) => setAvailableLanguages(data.languages ?? []))
      .catch(() => Toast.show({ type: "error", text1: "Failed to load languages" }))
      .finally(() => setIsLoading(false));
  }, []);

  const handleSelect = useCallback((id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id)
        ? prev.filter((v) => v !== id)
        : [...prev, id],
    );
  }, []);

  const handleSave = async () => {
    if (selectedIds.length === 0) return;
    setIsSaving(true);
    try {
      await updateProfile({ languageIds: selectedIds.map(String) });
      Toast.show({ type: "success", text1: "Languages updated" });
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Failed to update languages" });
    } finally {
      setIsSaving(false);
    }
  };

  const sortedLanguages = useMemo(
    () => sortLanguages(availableLanguages),
    [availableLanguages],
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4 items-start">
        <BackButton />
        <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight text-center px-4 pt-2">
          Select Your Languages
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
      >
        <View className="gap-4 max-w-md mx-auto w-full">
          {sortedLanguages.map((lang) => (
            <LanguageItem
              key={lang.id}
              lang={lang}
              isSelected={selectedIds.includes(lang.id)}
              onPress={handleSelect}
            />
          ))}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="max-w-md mx-auto w-full">
          <Pressable
            onPress={handleSave}
            disabled={selectedIds.length === 0 || isSaving}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            {isSaving ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text className="text-white text-[20px] font-bold">Save ({selectedIds.length} selected)</Text>
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
}
