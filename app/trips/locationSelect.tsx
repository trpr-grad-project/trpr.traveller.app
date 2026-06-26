import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, TextInput, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";

const POPULAR = ["Luxor Temple", "Valley of the Kings", "Karnak", "Giza Plateau", "Aswan", "Hurghada"];

export default function LocationSelectScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [search, setSearch] = useState("");
  const [recentSearches] = useState(["Luxor Temple", "Valley of the Kings", "Karnak"]);

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="px-4 pt-4 pb-2 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center gap-3 mb-4">
          <BackButton iconSize={20} iconName="arrow-back-ios-new" className="-ml-2" />
          <Text className="text-xl font-bold text-[#0c141d] dark:text-white">Search Destination</Text>
        </View>

        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-12 gap-2">
          <MaterialIcons name="search" size={22} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search cities, areas, or landmarks"
            placeholderTextColor="#94a3b8"
            autoFocus
            className="flex-1 text-base text-[#0c141d] dark:text-white"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 32 }}>
        <View className="flex-row gap-3">
          <Pressable className="flex-1 flex-row items-center justify-center gap-2 h-14 rounded-xl bg-primary/10 border border-primary/20">
            <MaterialIcons name="my-location" size={20} color="#359EFF" />
            <Text className="text-sm font-bold text-primary">Use current location</Text>
          </Pressable>
          <Pressable
            onPress={() => router.push("/trips/map/1/day/1")}
            className="flex-row items-center justify-center gap-2 h-14 rounded-xl bg-primary/10 border border-primary/20 px-4"
          >
            <MaterialIcons name="map" size={20} color="#359EFF" />
            <Text className="text-sm font-bold text-primary">Pick from map</Text>
          </Pressable>
        </View>

        {recentSearches.length > 0 && (
          <View>
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent Searches</Text>
            <View className="bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              {recentSearches.map((loc, i) => (
                <Pressable
                  key={loc}
                  onPress={() => setSearch(loc)}
                  className={`flex-row items-center gap-3 px-4 py-3.5 ${
                    i < recentSearches.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""
                  }`}
                >
                  <MaterialIcons name="location-on" size={18} color="#359EFF" />
                  <Text className="flex-1 text-sm font-medium text-[#0c141d] dark:text-white">{loc}</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#94a3b8" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        <View>
          <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Popular Destinations</Text>
          <View className="flex-row flex-wrap gap-3">
            {POPULAR.map((dest) => (
              <Pressable
                key={dest}
                onPress={() => setSearch(dest)}
                className="flex-row items-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <MaterialIcons name="location-on" size={16} color="#359EFF" />
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dest}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <Pressable
          onPress={() => router.push("/chat/ai")}
          className="flex-row items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl"
        >
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
            <MaterialIcons name="auto-awesome" size={22} color="#359EFF" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-[#0c141d] dark:text-white text-sm">Not sure where to go?</Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">Ask our AI for personalized recommendations</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#359EFF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
