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

const CATEGORIES = ["All", "Adventure", "Culture", "Beach", "Nature", "Historical"];

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
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm",
  },
  {
    id: "2",
    title: "Red Sea Diving",
    location: "Hurghada",
    duration: "3 Days",
    price: "$210",
    rating: "4.9",
    category: "NATURE",
    type: "BY COMPANY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB5jyoWqrmp_gyaMrH5WOQ4YpjP532JE-wRwIvh2dRKcpl7Pg6eYGhLFw4mav2nyhikqRji9mQ9znrIPPjnB0Aj68HCBqKZbLwrSWa07UnpL4mgVzbKz2V_tk6nMHW7ChvHWUat1llcakEYPBMx9TUe2DybdzkQYzmu2AZDrZRzoYyrPEI2rz5iJhBfwiGXTRUuviEW8kT8W_CjtcxDUTEeCvQA0n8eMldIndNSDKWB7gaLEEz1GKL11QxGx2aMbi3AJ8SbS4Kf0BUO",
  },
];

export default function ExploreScreen() {
  const insets = useSafeAreaInsets();
  const [selectedCat, setSelectedCat] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Sticky header */}
      <View className="bg-white/90 dark:bg-background-dark/90 px-4">
        <View className="py-5 text-center">
          <Text className="text-2xl font-bold tracking-tight text-[#0c141d] dark:text-white text-center">
            Explore Trips
          </Text>
        </View>

        {/* Search */}
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-3 pb-4 gap-2">
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search trips or destinations"
            placeholderTextColor="#94a3b8"
            className="flex-1 py-3 text-sm text-slate-900 dark:text-white"
          />
        </View>
      </View>

      {/* Category pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 8, gap: 8 }}
        className="bg-white/90 dark:bg-background-dark/90"
      >
        {CATEGORIES.map((cat) => (
          <Pressable
            key={cat}
            onPress={() => setSelectedCat(cat)}
            className={`px-6 py-2.5 rounded-xl ${
              selectedCat === cat
                ? "bg-primary"
                : "bg-slate-100 dark:bg-slate-800"
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                selectedCat === cat ? "text-white" : "text-slate-600 dark:text-slate-400"
              }`}
            >
              {cat}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Sort row */}
      <View className="flex-row items-center justify-between px-4 py-2 bg-white/90 dark:bg-background-dark/90">
        <Pressable className="flex-row items-center gap-1">
          <Text className="text-gray-custom dark:text-slate-300 text-sm font-medium">
            Sort by: <Text className="text-primary">Popular</Text>
          </Text>
          <MaterialIcons name="expand-more" size={18} color="#359EFF" />
        </Pressable>
        <Pressable className="flex-row items-center gap-1.5">
          <MaterialIcons name="tune" size={20} color="#359EFF" />
          <Text className="text-primary text-sm font-bold">Type: Company</Text>
        </Pressable>
      </View>

      <ScrollView
        className="flex-1 px-4 mt-2"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 24, paddingBottom: 24 }}
      >
        {/* Active filter chip */}
        <View className="flex-row items-center">
          <View className="flex-row items-center gap-1 px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full">
            <Text className="text-xs font-bold text-primary">By Company</Text>
            <MaterialIcons name="close" size={16} color="#359EFF" />
          </View>
        </View>

        {TRIPS.map((trip) => (
          <Pressable
            key={trip.id}
            onPress={() => router.push(`/trips/${trip.id}`)}
            className="gap-3"
          >
            {/* Image */}
            <View className="relative rounded-2xl overflow-hidden" style={{ aspectRatio: 16 / 10 }}>
              <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
              {/* Badges */}
              <View className="absolute top-3 right-3 flex-row items-center gap-1 bg-white/95 px-2 py-1 rounded-lg">
                <MaterialIcons name="star" size={12} color="#eab308" />
                <Text className="text-[11px] font-bold">{trip.rating}</Text>
              </View>
              <View className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/95 border border-primary/20">
                <Text className="text-[10px] font-bold text-primary tracking-wider uppercase">{trip.category}</Text>
              </View>
              <View className="absolute bottom-3 left-3 px-2.5 py-1 rounded-full bg-primary/90">
                <Text className="text-[10px] font-bold text-white tracking-wider uppercase">{trip.type}</Text>
              </View>
            </View>
            {/* Info row */}
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
