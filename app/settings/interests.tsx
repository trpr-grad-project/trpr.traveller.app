import React, { useState } from "react";
import {
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";

const ALL_TAGS = [
  { emoji: "🏰", label: "History Buff" },
  { emoji: "🍜", label: "Foodie" },
  { emoji: "📸", label: "Photography" },
  { emoji: "🧘", label: "Wellness" },
  { emoji: "🏄", label: "Adventure" },
  { emoji: "🎭", label: "Culture" },
  { emoji: "🌿", label: "Nature" },
  { emoji: "🎨", label: "Art" },
  { emoji: "🎵", label: "Music" },
  { emoji: "🏊", label: "Water Sports" },
  { emoji: "🎒", label: "Backpacking" },
  { emoji: "🌍", label: "Eco Travel" },
  { emoji: "🍷", label: "Wine & Dine" },
  { emoji: "💃", label: "Nightlife" },
  { emoji: "🧗", label: "Climbing" },
];

export default function InterestsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selected, setSelected] = useState(["History Buff", "Foodie", "Photography", "Wellness"]);

  const toggle = (label: string) => {
    setSelected((prev) =>
      prev.includes(label) ? prev.filter((t) => t !== label) : [...prev, label]
    );
  };

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-main-light dark:text-white ml-2">Interests & Tags</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text className="text-sm text-sub-light mb-6 leading-relaxed">
          Pick the tags that describe your travel personality. These help us match you with the right guides and trips.
        </Text>

        <View className="flex-row flex-wrap gap-3">
          {ALL_TAGS.map((tag) => {
            const active = selected.includes(tag.label);
            return (
              <Pressable
                key={tag.label}
                onPress={() => toggle(tag.label)}
                className={`flex-row items-center gap-2 px-4 py-2.5 rounded-full border ${
                  active
                    ? "bg-primary border-primary"
                    : "bg-white dark:bg-neutral-dark border-neutral-light dark:border-neutral-dark"
                }`}
              >
                <Text className="text-base">{tag.emoji}</Text>
                <Text className={`text-sm font-semibold ${active ? "text-white" : "text-main-light dark:text-white"}`}>
                  {tag.label}
                </Text>
                {active && <MaterialIcons name="check" size={16} color="white" />}
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View className="p-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <PrimaryButton title={`Save Interests (${selected.length} selected)`} onPress={() => {}} />
      </View>
    </View>
  );
}
