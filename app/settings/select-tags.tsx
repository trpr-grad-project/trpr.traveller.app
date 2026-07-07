import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";
import { placesService } from "@/services/places";
import { usePlaceDraftStore } from "@/store/placeDraft";

interface Tag {
  id: number;
  name: string;
}

export default function SelectTagsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { tagIds, setTagIds } = usePlaceDraftStore();

  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([...tagIds]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    placesService
      .getFormData()
      .then((data) => setTags(data.tags ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const toggle = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const handleSave = () => {
    setTagIds(selectedIds);
    router.back();
  };

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={{ paddingTop: insets.top + 8 }} className="px-2 pb-4 items-start">
        <BackButton />
        <Text className="text-xl font-bold text-main-light dark:text-white px-4 pt-2">
          Select Tags
        </Text>
        <Text className="text-sm text-sub-dark dark:text-gray-400 px-4 pt-1">
          Choose one or more tags for your place
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-6 pt-2"
        contentContainerStyle={{ paddingBottom: insets.bottom + 120 }}
      >
        <View className="flex-row flex-wrap gap-3">
          {tags.map((tag) => {
            const isSelected = selectedIds.includes(tag.id);
            return (
              <Pressable
                key={tag.id}
                onPress={() => toggle(tag.id)}
                className={`rounded-xl border-2 px-4 py-3 active:scale-[0.98] ${
                  isSelected
                    ? "border-primary bg-primary/10"
                    : "border-neutral-light dark:border-neutral-dark bg-white dark:bg-neutral-dark"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${
                    isSelected ? "text-primary" : "text-main-light dark:text-white"
                  }`}
                >
                  {tag.name}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 p-6 bg-background-light dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={handleSave}
          className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
        >
          <Text className="text-white text-lg font-semibold">
            Save ({selectedIds.length} selected)
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
