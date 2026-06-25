import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

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

const TRIPS = [
  {
    id: "1",
    title: "Luxor Temples Discovery",
    location: "Upper Egypt",
    duration: "2 Days",
    price: "$150",
    rating: "4.8",
    category: "CULTURE",
    type: "BY COMPANY",
    typeValue: "company",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm",
  },
  {
    id: "2",
    title: "Giza Plateau Highlights",
    location: "Cairo, Egypt",
    duration: "3 Days",
    price: "Free",
    rating: "4.9",
    category: "HISTORICAL",
    type: "GROUP TRIP",
    typeValue: "shared",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuATlIyLdX0EzgB-ANyT3YzRHbzi5AAHhodUiHybWfcMYHJ2weJk1LNoLScSpGgq7lMHI5Ctz7c0HsPxU5pLIe547mXqVc-F1NeSkkMYbXTxlR4bOuKCWJvKjzh6KI7ZNjBImDiDLe1ogwzDCzCscW4JQ854MCbG34O7JJmC6ai9nV5aG-OakGRh2s9AyumPSC8ZcIJoCXJz23wBGq-8psvPormuFzaqwMNHbCy5JjCjZQqlYv0rVFWd0-qKymgT4KJJL_Kp5E7zQmMs",
  },
  {
    id: "3",
    title: "Siwa Oasis Desert Expedition",
    location: "Western Desert",
    duration: "5 Days",
    price: "Free",
    rating: "4.7",
    category: "ADVENTURE",
    type: "GROUP TRIP",
    typeValue: "shared",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf",
  },
  {
    id: "4",
    title: "Aswan Nile Felucca",
    location: "Aswan",
    duration: "1 Day",
    price: "$45",
    rating: "4.6",
    category: "ADVENTURE",
    type: "BY GUIDE",
    typeValue: "guide",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuANeO4WOrOcetZrYjzvqwfqCPkuEe_tG8D5wpwVgmKQn-3dZvZCTR2fSPc8yLEdaFGeALkWMyviuF4j5q2lNMndo-0bz0kO8fQ0JPOS82rUK-_e9i-yUu0p1MYjz68owfQkGDj8_H-f9EemeDh9kVLR87Dqb02blChGbAnGXJjeEjt50Gf4iA-fOLOcIf_vz4kKIF7iMbkCQ3mT211hn0MTwC6WZbXE75gHptCaq3zlbzFP6OAdJRc1gILY9en-99phSaLUl1Ex64n4",
  },
  {
    id: "5",
    title: "Red Sea Diving",
    location: "Hurghada",
    duration: "3 Days",
    price: "$210",
    rating: "4.9",
    category: "NATURE",
    type: "BY COMPANY",
    typeValue: "company",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5jyoWqrmp_gyaMrH5WOQ4YpjP532JE-wRwIvh2dRKcpl7Pg6eYGhLFw4mav2nyhikqRji9mQ9znrIPPjnB0Aj68HCBqKZbLwrSWa07UnpL4mgVzbKz2V_tk6nMHW7ChvHWUat1llcakEYPBMx9TUe2DybdzkQYzmu2AZDrZRzoYyrPEI2rz5iJhBfwiGXTRUuviEW8kT8W_CjtcxDUTEeCvQA0n8eMldIndNSDKWB7gaLEEz1GKL11QxGx2aMbi3AJ8SbS4Kf0BUO",
  },
];

const TYPE_BADGE_COLORS: Record<string, { bg: string; text: string }> = {
  "BY COMPANY": { bg: "bg-primary/90", text: "text-white" },
  "GROUP TRIP": { bg: "bg-emerald-600/90", text: "text-white" },
  "BY GUIDE": { bg: "bg-primary/90", text: "text-white" },
};

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");
  const [sortOpen, setSortOpen] = useState(false);
  const [typeOpen, setTypeOpen] = useState(false);
  const [selectedSort, setSelectedSort] = useState("popular");
  const [selectedType, setSelectedType] = useState("all");

  const selectedTypeLabel = TYPE_OPTIONS.find((o) => o.value === selectedType)?.label ?? "All Trips";

  const filtered = TRIPS.filter((t) => {
    if (selectedCat !== "All" && t.category !== selectedCat.toUpperCase()) return false;
    if (selectedType === "company" && t.typeValue !== "company") return false;
    if (selectedType === "guide" && t.typeValue !== "guide") return false;
    if (selectedType === "shared" && t.typeValue !== "shared") return false;
    if (search && !t.title.toLowerCase().includes(search.toLowerCase()) && !t.location.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const getPlanRoute = (trip: (typeof TRIPS)[number]) => {
    if (trip.typeValue === "company") return `/trips/plan-by-company/${trip.id}`;
    if (trip.typeValue === "guide") return `/trips/plan-by-guide/${trip.id}`;
    return `/trips/plan-by-user/${trip.id}`;
  };

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

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
            Sort by: <Text className="text-primary ml-1">{SORT_OPTIONS.find((o) => o.value === selectedSort)?.label ?? "Popular"}</Text>
          </Text>
          <MaterialIcons name="expand-more" size={18} color="#359EFF" />
        </Pressable>
        <Pressable
          onPress={() => { setTypeOpen(!typeOpen); setSortOpen(false); }}
          className="flex-row items-center gap-1.5"
        >
          <MaterialIcons name="tune" size={20} color={selectedType !== "all" ? "#359EFF" : "#4F4F4F"} />
          <Text className={`text-sm font-bold ${selectedType !== "all" ? "text-primary" : "text-[#4F4F4F] dark:text-slate-300"}`}>
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
                  <Text className={`text-sm ${selectedSort === opt.value ? "font-semibold text-primary" : "font-medium text-slate-700 dark:text-slate-300"}`}>
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

        {filtered.map((trip) => (
          <Pressable
            key={trip.id}
            onPress={() => router.push(getPlanRoute(trip) as any)}
            className="gap-3"
          >
            <View className="relative rounded-2xl overflow-hidden shadow-sm" style={{ aspectRatio: 16 / 10 }}>
              <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
              <View className="absolute top-3 right-3 flex-row items-center gap-1 bg-white/95 dark:bg-black/70 backdrop-blur px-2 py-1 rounded-lg">
                <MaterialIcons name="star" size={12} color="#eab308" />
                <Text className="text-[11px] font-bold text-slate-900 dark:text-white">{trip.rating}</Text>
              </View>
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
                <Text className="text-sm text-slate-500 font-medium">{trip.location} • {trip.duration}</Text>
              </View>
              <Text className="text-lg font-bold text-primary">{trip.price}</Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}
