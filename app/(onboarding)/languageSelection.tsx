import { useProfileFormData } from "@/context/ProfileFormDataContext";
import { useOnboardingSelections } from "@/context/OnboardingSelectionsContext";
import BackButton from "@/components/BackButton";
import { MaterialIcons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const LANG_EMOJI_MAP: Record<string, string> = {
  en: "🇬🇧",
  es: "🇪🇸",
  fr: "🇫🇷",
  de: "🇩🇪",
  zh: "🇨🇳",
  ja: "🇯🇵",
  ko: "🇰🇷",
  pt: "🇵🇹",
  ru: "🇷🇺",
  ar: "🇸🇦",
};

function LangIcon({ code }: { code: string }) {
  const emoji = LANG_EMOJI_MAP[code];
  if (emoji) {
    return (
      <Text className="text-2xl">
        {emoji}
      </Text>
    );
  }
  return (
    <Text className="text-xs font-bold text-[#1A1A1A] dark:text-white uppercase">
      {code}
    </Text>
  );
}

const LanguageItem = React.memo(function LanguageItem({ lang, isSelected, onPress }: { lang: any, isSelected: boolean, onPress: (id: number) => void }) {
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
        className={`h-6 w-6 rounded-full border-2 items-center justify-center ${
          isSelected
            ? "border-primary"
            : "border-[#E0E0E0] dark:border-gray-600"
        }`}
      >
        {isSelected && (
          <View className="h-3 w-3 rounded-full bg-primary" />
        )}
      </View>
    </Pressable>
  );
});

export default function LanguageSelectionScreen() {
  const insets = useSafeAreaInsets();
  const { languages, isLoading, error } = useProfileFormData();
  const { languageId, setLanguageId } = useOnboardingSelections();
  const navigating = React.useRef(false);

  useFocusEffect(React.useCallback(() => { navigating.current = false; }, []));

  const handleSelect = React.useCallback((id: number) => {
    setLanguageId(id);
  }, [setLanguageId]);

  const handleContinue = React.useCallback(() => {
    if (!languageId || navigating.current) return;
    navigating.current = true;
    router.push("/(onboarding)/interestsSelection");
  }, [languageId]);

  // Auto-select English (code "en") when data loads and nothing is selected yet
  React.useEffect(() => {
    if (languages.length > 0 && languageId === null) {
      const english = languages.find((l) => l.code === "en");
      setLanguageId(english?.id ?? languages[0].id);
    }
  }, [languages, languageId, setLanguageId]);

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      {/* Header */}
      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4 items-start">
        <BackButton />
        <Text className="text-[#1A1A1A] dark:text-white text-2xl font-bold tracking-tight text-center px-4 pt-2">
          Select Your Language
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-5 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + 160 }}
      >
        {isLoading ? (
          <View className="flex-1 items-center justify-center py-20">
            <ActivityIndicator size="large" color="#359EFF" />
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center py-20 gap-3">
            <MaterialIcons name="error-outline" size={40} color="#ef4444" />
            <Text className="text-[#828282] dark:text-gray-400 text-sm text-center">
              Failed to load languages.{"\n"}Please try again.
            </Text>
          </View>
        ) : (
          <View className="gap-4 max-w-md mx-auto w-full">
            {languages.map((lang) => (
              <LanguageItem
                key={lang.id}
                lang={lang}
                isSelected={languageId === lang.id}
                onPress={handleSelect}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Footer */}
      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-white dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="max-w-md mx-auto w-full items-center">
          {/* Progress Dots */}
          <View className="flex-row justify-center items-center gap-2 mb-8">
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-6 rounded-full bg-primary" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
            <View className="h-2 w-2 rounded-full bg-neutral-light dark:bg-gray-700" />
          </View>

          <Pressable
            onPress={handleContinue}
            disabled={!languageId}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20 disabled:opacity-50"
          >
            <Text className="text-white text-[20px] font-bold">Continue</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
