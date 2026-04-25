import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = ["Upcoming Trips", "Pending Requests"];

const UPCOMING = [
  {
    id: "1",
    title: "Alpine Trekking",
    location: "Interlaken, Switzerland",
    dates: "Oct 12 - Oct 18, 2023",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDegqYn-H5J9ROUWMAt2xK8RXGzFqiARtfzyW3nE6obNVyAt4pbd5j1gjVJs6jkXI_RutZgh_aHCEkq2lfTgvwM5p2ZmIeuWSadcJbbW1lTqM9LKwq4YDrmvc1wtmec0uNaCN5F-ANkVkR2szSWkttOYuCal6kRPzlo1Cpml9mbdUGNcK6sfZEM7jdYgNK6Oip5jmHy9Kg658FcAn7T7lUxNSFFMmQCgLWYILocyLoZlEzensye3mfO4SiPYY2ANODL1pg3AGOlrI0w",
  },
  {
    id: "2",
    title: "Island Hopping Tour",
    location: "Palawan, Philippines",
    dates: "Nov 02 - Nov 08, 2023",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAGBPDrGUvgHjZW8SpevryYlb43XZCajE31yU3oJqFtM21dX7ptgye6c1HN8XtJR1aLxt9jzAcXOFKFfE39vrwSwXkgbhjpKY1LQG6Li1D2OXqwTEJT-J0Yt_21YnbMNs_Fm5S_f5cyu8CV1LQWLLuCvyuCDyr2KdjbbdCU7YcBHUHId9kxdF4-BRsGJhUbG7iIlG7UsXgXq6iA9sxkgn2y0YlV1beYURtzKRGu_IPQBsAyEhlBdiCmbjBk87LNIiE3yabBMCeEKByQ",
  },
];

const PENDING = [
  { id: "1", title: "Midnight Sun Kayaking", location: "Lofoten, Norway", dates: "July 15 - July 17, 2024", isNew: true },
  { id: "2", title: "Cherry Blossom Walk", location: "Kyoto, Japan", dates: "Apr 05 - Apr 10, 2024", isNew: false },
];

export default function GuideSchedule() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center bg-white/80 dark:bg-background-dark/80 px-4 py-4 justify-between border-b border-slate-100 dark:border-slate-800">
        <View className="w-10" />
        <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold flex-1 text-center">Schedule</Text>
        <Pressable className="w-10 items-end">
          <MaterialIcons name="calendar-month" size={24} color="#64748b" />
        </Pressable>
      </View>

      {/* Tabs */}
      <View className="px-4 pt-4">
        <View className="flex-row border-b border-slate-100 dark:border-slate-800 gap-8">
          {TABS.map((tab, i) => (
            <Pressable key={tab} onPress={() => setActiveTab(i)} className="flex-col items-center pb-3 pt-2">
              <Text
                className={`text-sm font-bold ${
                  activeTab === i
                    ? "text-slate-900 dark:text-slate-100"
                    : "text-slate-500 dark:text-slate-400"
                }`}
              >
                {tab}
              </Text>
              {activeTab === i && (
                <View className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t" />
              )}
            </Pressable>
          ))}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {activeTab === 0 ? (
          <View className="p-4 gap-4">
            <Text className="text-slate-900 dark:text-slate-100 text-base font-bold py-2">Upcoming Trips</Text>
            {UPCOMING.map((trip) => (
              <View key={trip.id} className="flex-col rounded-xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <View style={{ aspectRatio: 21 / 9 }}>
                  <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="p-4">
                  <Text className="text-primary text-[10px] font-extrabold tracking-widest uppercase mb-1">ASSIGNED TO YOU</Text>
                  <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold">{trip.title}</Text>
                  <View className="flex-row items-center gap-1 mt-1">
                    <MaterialIcons name="location-on" size={14} color="#94a3b8" />
                    <Text className="text-slate-500 dark:text-slate-400 text-sm">{trip.location}</Text>
                  </View>
                  <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-slate-50 dark:border-slate-800">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="event" size={16} color="#94a3b8" />
                      <Text className="text-slate-600 dark:text-slate-400 text-sm font-medium">{trip.dates}</Text>
                    </View>
                    <Pressable className="bg-primary px-4 py-2 rounded-lg">
                      <Text className="text-white text-sm font-bold">View Details</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View className="p-4 gap-4">
            <Text className="text-slate-900 dark:text-slate-100 text-base font-bold py-2">Pending Requests</Text>
            {PENDING.map((req) => (
              <View key={req.id} className="p-4 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
                <View className="flex-row justify-between items-start mb-2">
                  <View>
                    <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">{req.title}</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-sm mt-1">{req.location}</Text>
                  </View>
                  {req.isNew && (
                    <View className="bg-primary/10 px-2 py-1 rounded-full">
                      <Text className="text-primary text-[10px] font-bold">NEW</Text>
                    </View>
                  )}
                </View>
                <View className="flex-row items-center gap-2 mb-4">
                  <MaterialIcons name="event" size={16} color="#94a3b8" />
                  <Text className="text-slate-600 dark:text-slate-400 text-sm">{req.dates}</Text>
                </View>
                <View className="flex-row gap-3">
                  <Pressable className="flex-1 bg-primary items-center justify-center py-2.5 rounded-lg">
                    <Text className="text-white text-sm font-bold">Accept</Text>
                  </Pressable>
                  <Pressable className="flex-1 bg-slate-100 dark:bg-slate-800 items-center justify-center py-2.5 rounded-lg">
                    <Text className="text-slate-600 dark:text-slate-300 text-sm font-bold">Reject</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
