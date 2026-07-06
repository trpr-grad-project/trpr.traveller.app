import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useColorScheme } from "nativewind";
import Toast from "react-native-toast-message";

import BackButton from "@/components/BackButton";
import { placesService } from "@/services/places";
import { usePlaceDraftStore } from "@/store/placeDraft";

interface PlaceItem {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  governorateId: number;
  latitude: number;
  longitude: number;
  governorate: { id: number; name: string };
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
}

interface PlacesResponse {
  items: PlaceItem[];
  nextCursor: number;
  hasNextPage: boolean;
}

export default function MyPlacesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const draft = usePlaceDraftStore();

  const [places, setPlaces] = useState<PlaceItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      loadPlaces();
    }, []),
  );

  const loadPlaces = async () => {
    setIsLoading(true);
    try {
      const data: PlacesResponse = await placesService.getMyPlaces();
      setPlaces(data.items ?? []);
    } catch {
      Toast.show({ type: "error", text1: "Failed to load places" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAdd = () => {
    draft.reset();
    router.push("/settings/add-place");
  };

  const renderItem = ({ item }: { item: PlaceItem }) => (
    <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-4 mb-3">
      <View className="flex-row items-start gap-2 mb-2">
        <MaterialIcons name="place" size={18} color="#359EFF" style={{ marginTop: 2 }} />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white">
          {item.title}
        </Text>
      </View>

      {item.description ? (
        <Text className="text-sm text-sub-dark dark:text-gray-400 mb-4 ml-7" numberOfLines={2}>
          {item.description}
        </Text>
      ) : null}

      <View className="flex-row gap-2 mb-3">
        <View className="flex-row items-center gap-1 bg-teal-50 dark:bg-teal-900/30 rounded-full px-3 py-1.5">
          <MaterialIcons name="business" size={13} color="#0d9488" />
          <Text className="text-xs font-semibold text-teal-600 dark:text-teal-400">
            {item.governorate.name}
          </Text>
        </View>
        <View className="flex-row items-center gap-1 bg-violet-50 dark:bg-violet-900/30 rounded-full px-3 py-1.5">
          <MaterialIcons name="category" size={13} color="#7c3aed" />
          <Text className="text-xs font-semibold text-violet-600 dark:text-violet-400">
            {item.category.name}
          </Text>
        </View>
      </View>

      {item.tags.length > 0 && (
        <View className="flex-row flex-wrap items-center gap-1.5">
          <Text className="text-xs font-medium text-slate-400 dark:text-slate-500 mr-0.5">Tags</Text>
          {item.tags.slice(0, 4).map((tag) => (
            <View key={tag.id} className="bg-slate-100 dark:bg-slate-800 rounded-md px-2 py-0.5">
              <Text className="text-xs text-slate-500 dark:text-slate-400">
                {tag.name}
              </Text>
            </View>
          ))}
          {item.tags.length > 4 && (
            <Text className="text-xs text-slate-400">+{item.tags.length - 4}</Text>
          )}
        </View>
      )}
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 bg-background-light dark:bg-background-dark items-center justify-center">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white text-center mr-10">
          My Places
        </Text>
      </View>

      <FlatList
        data={places}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="items-center justify-center pt-20">
            <MaterialIcons name="place" size={64} color="#94a3b8" />
            <Text className="text-base font-semibold text-sub-dark dark:text-gray-400 mt-4">
              No places yet
            </Text>
            <Text className="text-sm text-sub-dark dark:text-gray-500 mt-1">
              Tap + to add your first place
            </Text>
          </View>
        }
      />

      <Pressable
        onPress={handleAdd}
        className="absolute bottom-8 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg shadow-primary/40 active:opacity-90"
        style={{ elevation: 8 }}
      >
        <MaterialIcons name="add" size={28} color="white" />
      </Pressable>
    </View>
  );
}
