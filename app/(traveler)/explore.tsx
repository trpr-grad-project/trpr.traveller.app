import React, { useMemo, useState } from "react";
import { ActivityIndicator, Image, Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useHomeTrips } from "@/hooks/useHomeTrips";
import { resolveImageUrl } from "@/utils/constants";
import type { MyTrip } from "@/types";

const CATEGORIES = ["All", "Adventure", "Culture", "Beach", "Nature", "Historical"];

const SORT_OPTIONS = [
  { label: "Popular", value: "popular" },
  { label: "Highest Rated", value: "rating" },
  { label: "Price: Low to High", value: "price_asc" },
  { label: "Price: High to Low", value: "price_desc" },
];

const TYPE_OPTIONS = [
  { label: "All Trips", value: "all" },
  { label: "Company Trips", value: "company" },
  { label: "Guide Trips", value: "guide" },
  { label: "Shared / Group Trips", value: "shared" },
];

type TripCardData = {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  category: string;
  type: string;
  typeValue: string;
  image: string;
  startDate: string;
};

type SectionKey = "byCompany" | "byGuide" | "shared";

function mapTrip(item: MyTrip, section: SectionKey): TripCardData {
  const typeMap: Record<SectionKey, { type: string; typeValue: string }> = {
    byCompany: { type: "BY COMPANY", typeValue: "company" },
    byGuide: { type: "BY GUIDE", typeValue: "guide" },
    shared: { type: "GROUP TRIP", typeValue: "shared" },
  };
  const { type, typeValue } = typeMap[section];
  return {
    id: item.tripId,
    title: item.title,
    location: item.segments?.[0]?.places?.[0]?.governorate?.name ?? "",
    duration: item.tripTime || "",
    price: item.price === 0 ? "Free" : `$${item.price}`,
    category: (item.theme ?? "").toUpperCase(),
    type,
    typeValue,
    image: resolveImageUrl(item.imagesUrls?.[0] ?? ""),
    startDate: item.startDate,
  };
}

const TYPE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "BY COMPANY": { bg: "bg-primary/90", text: "text-white" },
  "GROUP TRIP": { bg: "bg-emerald-600/90", text: "text-white" },
  "BY GUIDE": { bg: "bg-primary/90", text: "text-white" },
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedType, setSelectedType] = useState("all");

  const { data, isLoading, isError, refetch } = useHomeTrips();

  const allTrips = useMemo<TripCardData[]>(() => {
    if (!data) return [];
    const result: TripCardData[] = [];
    data.byCompany.items.forEach((item) => result.push(mapTrip(item, "byCompany")));
    data.byGuide.items.forEach((item) => result.push(mapTrip(item, "byGuide")));
    data.shared.items.forEach((item) => result.push(mapTrip(item, "shared")));
    return result;
  }, [data]);

  const selectedTypeLabel = TYPE_OPTIONS.find((o) => o.value === selectedType)?.label ?? "All Trips";

  const today = new Date().toISOString().slice(0, 10);

  const filtered = allTrips.filter((t) => {
    if (t.startDate < today) return false;
    if (selectedCat !== "All" && t.category !== selectedCat.toUpperCase()) return false;
    if (selectedType === "company" && t.typeValue !== "company") return false;
    if (selectedType === "guide" && t.typeValue !== "guide") return false;
    if (selectedType === "shared" && t.typeValue !== "shared") return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  if (isLoading && !data) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (isError) {
    return (
      <View className="flex-1 bg-white dark:bg-background-dark items-center justify-center px-6" style={{ paddingTop: insets.top }}>
        <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />
        <MaterialIcons name="error-outline" size={48} color="#ef4444" />
        <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4 text-center">
          Failed to load trips.
        </Text>
        <Pressable
          onPress={() => refetch()}
          className="mt-6 bg-primary rounded-xl py-3 px-8"
        >
          {({ pressed }) => (
            <Text className="text-white font-bold text-sm" style={{ opacity: pressed ? 0.7 : 1 }}>
              Retry
            </Text>
          )}
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/90 dark:bg-background-dark/90 px-4">
        <View className="py-5 text-center">
          <Text className="text-2xl font-bold tracking-tight text-[#0c141d] dark:text-white text-center">
            Explore Trips
          </Text>
        </View>

        <View className="relative pb-4">
          <View className="absolute inset-y-0 left-0 pl-3 items-center justify-center z-10">
            <MaterialIcons name="search" size={20} color="#94a3b8" />
          </View>
          <View className="bg-slate-100 dark:bg-slate-800 rounded-xl">
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search trips or destinations"
              placeholderTextColor="#94a3b8"
              className="w-full pl-10 pr-4 py-3 text-sm text-slate-900 dark:text-white"
            />
          </View>
        </View>
      </View>

      <View className="bg-white/90 dark:bg-background-dark/90">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: "flex-start" }}
        >
          {CATEGORIES.map((cat) => (
            <Pressable
              key={cat}
              onPress={() => setSelectedCat(cat)}
              className={`shrink-0 px-6 py-2.5 rounded-xl ${selectedCat === cat ? "bg-primary" : "bg-slate-100 dark:bg-slate-800"}`}
            >
              <Text
                className={`text-sm font-semibold ${selectedCat === cat ? "text-white" : "text-slate-600 dark:text-slate-400"}`}
              >
                {cat}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <View className="relative z-20 flex-row items-center justify-between px-4 pt-2 pb-2">
        <Pressable
          onPress={() => { setSortOpen(!sortOpen); setTypeOpen(false); }}
          className="flex-row items-center gap-1"
        >
          <Text className="text-[#4F4F4F] dark:text-slate-300 text-sm font-medium">
            Sort by: <Text className="text-primary ml-1 tracking-wide">{SORT_OPTIONS.find((o) => o.value === selectedSort)?.label ?? "Popular"}</Text>
          </Text>
          <MaterialIcons name="expand-more" size={18} color="#359EFF" />
        </Pressable>
        <Pressable
          onPress={() => { setTypeOpen(!typeOpen); setSortOpen(false); }}
          className="flex-row items-center gap-1.5"
        >
          <MaterialIcons name="tune" size={20} color={selectedType !== "all" ? "#359EFF" : "#4F4F4F"} />
          <Text className={`text-sm font-bold tracking-wide ${selectedType !== "all" ? "text-primary" : "text-[#4F4F4F] dark:text-slate-300"}`}>
            {selectedType !== "all" ? `Type: ${selectedTypeLabel}` : "Type"}
          </Text>
        </Pressable>

        {sortOpen && (
          <View className="absolute left-4 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 }}
          >
            <View className="p-2 space-y-1">
              {SORT_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => { setSelectedSort(opt.value); setSortOpen(false); }}
                  className="flex-row items-center justify-between px-3 py-2.5 rounded-xl"
                >
                  <Text className={`text-sm tracking-wide ${selectedSort === opt.value ? "font-semibold text-primary" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                    {opt.label}
                  </Text>
                  {selectedSort === opt.value && (
                    <MaterialIcons name="check" size={18} color="#359EFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {typeOpen && (
          <View className="absolute right-4 top-full mt-2 w-56 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
            style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 }}
          >
            <View className="p-2 space-y-1">
              {TYPE_OPTIONS.map((opt) => (
                <Pressable
                  key={opt.value}
                  onPress={() => { setSelectedType(opt.value); setTypeOpen(false); }}
                  className={`flex-row items-center justify-between px-3 py-2.5 rounded-xl ${
                    selectedType === opt.value ? "bg-slate-50 dark:bg-slate-700/50" : ""
                  }`}
                >
                  <Text className={`text-sm ${selectedType === opt.value ? "font-semibold text-primary" : "font-medium text-slate-700 dark:text-slate-300"}`}>
                    {opt.label}
                  </Text>
                  {selectedType === opt.value && (
                    <MaterialIcons name="check" size={18} color="#359EFF" />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        )}
      </View>
      </View>

      <ScrollView
        className="flex-1 px-4 mt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 24, paddingBottom: 24 }}
      >
        {selectedType !== "all" && (
          <View className="flex-row items-center">
            <View className="flex-row items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
              <Text className="text-xs font-bold text-primary">
                {TYPE_OPTIONS.find((o) => o.value === selectedType)?.label.replace("Trips", "").replace("/ Group", "").trim()}
              </Text>
              <Pressable onPress={() => setSelectedType("all")}>
                <MaterialIcons name="close" size={16} color="#359EFF" />
              </Pressable>
            </View>
          </View>
        )}

        {filtered.length === 0 && (
          <View className="items-center py-12">
            <MaterialIcons name="search-off" size={48} color="#94a3b8" />
            <Text className="text-sm text-slate-400 dark:text-slate-500 mt-3 text-center">
              No trips match your filters.
            </Text>
          </View>
        )}

        {filtered.map((trip) => (
          <Pressable
            key={trip.id}
            onPress={() => router.push(`/trips/${trip.id}`)}
            className="gap-3"
          >
            <View className="relative rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: 16 / 10 }}>
              <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 dark:bg-black/70 backdrop-blur border border-primary/20">
                <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">{trip.category}</Text>
              </View>
              <View className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-full ${TYPE_BADGE_COLORS[trip.type]?.bg ?? "bg-primary/90"} backdrop-blur`}>
                <Text className={`text-[10px] font-bold ${TYPE_BADGE_COLORS[trip.type]?.text ?? "text-white"} tracking-wider uppercase`}>{trip.type}</Text>
              </View>
            </View>
            <View className="px-1 flex-row justify-between items-start">
              <View>
                <Text className="font-bold text-lg text-[#0c141d] dark:text-white leading-tight">{trip.title}</Text>
                <Text className="text-sm text-slate-500 font-medium">{trip.location ? `${trip.location} · ` : ""}{trip.duration}</Text>
              </View>
              <Text className="text-lg font-bold text-primary">{trip.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
