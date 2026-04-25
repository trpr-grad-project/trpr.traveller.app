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

const POPULAR = ["Kyoto", "Tokyo", "Cairo", "Paris", "Bali", "Rome", "NYC", "Dubai", "Bangkok", "Lisbon"];
const RECENT = ["Giza, Egypt", "Luxor, Egypt"];

export default function LocationSelectScreen() {
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="px-4 pt-6 pb-4 border-b border-slate-100 dark:border-slate-800">
        <View className="flex-row items-center gap-3 mb-4">
          <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
            <MaterialIcons name="arrow-back-ios-new" size={18} color="#0f172a" />
          </Pressable>
          <Text className="text-xl font-bold text-slate-900 dark:text-white">Where to?</Text>
        </View>

        {/* Search box */}
        <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-12 gap-2">
          <MaterialIcons name="search" size={22} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search destinations..."
            placeholderTextColor="#94a3b8"
            autoFocus
            className="flex-1 text-base text-slate-900 dark:text-white"
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <MaterialIcons name="close" size={20} color="#94a3b8" />
            </Pressable>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 24, paddingBottom: 32 }}>
        {/* Recent */}
        {RECENT.length > 0 && (
          <View>
            <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Recent</Text>
            <View className="gap-0 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 overflow-hidden">
              {RECENT.map((loc, i) => (
                <Pressable
                  key={loc}
                  onPress={() => router.push("/trips/1")}
                  className={`flex-row items-center gap-3 px-4 py-3 ${
                    i < RECENT.length - 1 ? "border-b border-slate-100 dark:border-slate-700" : ""
                  }`}
                >
                  <View className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 items-center justify-center">
                    <MaterialIcons name="history" size={18} color="#94a3b8" />
                  </View>
                  <Text className="flex-1 text-sm font-medium text-slate-900 dark:text-white">{loc}</Text>
                  <MaterialIcons name="arrow-forward-ios" size={14} color="#94a3b8" />
                </Pressable>
              ))}
            </View>
          </View>
        )}

        {/* Popular destinations */}
        <View>
          <Text className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Popular Destinations</Text>
          <View className="flex-row flex-wrap gap-3">
            {POPULAR.map((dest) => (
              <Pressable
                key={dest}
                onPress={() => router.push("/trips/1")}
                className="flex-row items-center gap-1.5 px-4 py-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700"
              >
                <MaterialIcons name="location-on" size={16} color="#359EFF" />
                <Text className="text-sm font-semibold text-slate-700 dark:text-slate-200">{dest}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* AI suggestion */}
        <Pressable
          onPress={() => router.push("/chat/ai")}
          className="flex-row items-center gap-3 p-4 bg-primary/10 border border-primary/20 rounded-xl"
        >
          <View className="w-10 h-10 rounded-full bg-primary/20 items-center justify-center">
            <MaterialIcons name="auto-awesome" size={22} color="#359EFF" />
          </View>
          <View className="flex-1">
            <Text className="font-bold text-slate-900 dark:text-white text-sm">Not sure where to go?</Text>
            <Text className="text-xs text-slate-500 dark:text-slate-400">Ask our AI for personalized recommendations</Text>
          </View>
          <MaterialIcons name="arrow-forward-ios" size={14} color="#359EFF" />
        </Pressable>
      </ScrollView>
    </View>
  );
}
