import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";

const SEGMENTS = ["Current", "Upcoming", "Past"];

type TripItem = {
  id: string;
  image: string;
  title: string;
  location: string;
  dates: string;
  status: string;
  statusColor: string;
  statusBg: string;
};

const TRIPS_DATA: Record<string, TripItem[]> = {
  Current: [
    {
      id: "c1",
      image: "https://images.unsplash.com/photo-1539768942893-daf02e6f2d85?w=800&q=80",
      title: "Nile Sunset Felucca",
      location: "Cairo, Egypt",
      dates: "Jun 20 - Jun 23, 2026",
      status: "IN PROGRESS",
      statusColor: "#359EFF",
      statusBg: "bg-blue-100 dark:bg-blue-900/30",
    },
    {
      id: "c2",
      image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      title: "Luxor Temple Discovery",
      location: "Luxor, Egypt",
      dates: "Jun 22 - Jun 24, 2026",
      status: "IN PROGRESS",
      statusColor: "#359EFF",
      statusBg: "bg-blue-100 dark:bg-blue-900/30",
    },
  ],
  Upcoming: [
    {
      id: "u1",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80",
      title: "Red Sea Snorkeling",
      location: "Hurghada, Egypt",
      dates: "Jul 5 - Jul 8, 2026",
      status: "CONFIRMED",
      statusColor: "#22c55e",
      statusBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "u2",
      image: "https://images.unsplash.com/photo-1580674285054-bed31e145f59?w=800&q=80",
      title: "Alexandria Day Trip",
      location: "Alexandria, Egypt",
      dates: "Jul 12, 2026",
      status: "CONFIRMED",
      statusColor: "#22c55e",
      statusBg: "bg-green-100 dark:bg-green-900/30",
    },
    {
      id: "u3",
      image: "https://images.unsplash.com/photo-1539650116574-8efeb43e2750?w=800&q=80",
      title: "Siwa Oasis Weekend",
      location: "Siwa, Egypt",
      dates: "Aug 2 - Aug 5, 2026",
      status: "CONFIRMED",
      statusColor: "#22c55e",
      statusBg: "bg-green-100 dark:bg-green-900/30",
    },
  ],
  Past: [
    {
      id: "p1",
      image: "https://images.unsplash.com/photo-1555400038-63f5ba517a47?w=800&q=80",
      title: "Giza Pyramids Tour",
      location: "Giza, Egypt",
      dates: "May 10 - May 12, 2026",
      status: "COMPLETED",
      statusColor: "#64748b",
      statusBg: "bg-slate-100 dark:bg-slate-800",
    },
    {
      id: "p2",
      image: "https://images.unsplash.com/photo-1539768942893-daf02e6f2d85?w=800&q=80",
      title: "Egyptian Museum Visit",
      location: "Cairo, Egypt",
      dates: "Apr 28, 2026",
      status: "COMPLETED",
      statusColor: "#64748b",
      statusBg: "bg-slate-100 dark:bg-slate-800",
    },
  ],
};

export default function TripsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [segmentIndex, setSegmentIndex] = useState(0);
  const activeSegment = SEGMENTS[segmentIndex];
  const trips = TRIPS_DATA[activeSegment] || [];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 pt-4 pb-0">
        <View className="flex-row items-center mb-4">
          <BackButton iconSize={20} />
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">My Trips</Text>
        </View>
        <SegmentedControl
          values={SEGMENTS}
          selectedIndex={segmentIndex}
          onChange={(e) => setSegmentIndex(e.nativeEvent.selectedSegmentIndex)}
          backgroundColor={isDark ? "#1a2c30" : "#e8edee"}
          tintColor="#359EFF"
          fontStyle={{
            fontSize: 13,
            fontWeight: "600",
            color: isDark ? "#94a3b8" : "#64748b",
            fontFamily: "PlusJakartaSans-SemiBold",
          }}
          activeFontStyle={{
            fontSize: 13,
            fontWeight: "600",
            color: "#ffffff",
            fontFamily: "PlusJakartaSans-SemiBold",
          }}
          style={{ marginHorizontal: 16, height: 36 }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {trips.length === 0 ? (
          <View className="items-center py-20">
            <MaterialIcons name="flight-takeoff" size={48} color="#64748b" />
            <Text className="text-base font-semibold text-slate-500 dark:text-slate-400 mt-4">No {activeSegment.toLowerCase()} trips</Text>
          </View>
        ) : (
          trips.map((trip) => (
            <View
              key={trip.id}
              className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-100 dark:border-slate-800 mb-5 overflow-hidden shadow-sm"
            >
              <View className="relative">
                <Image source={{ uri: trip.image }} className="w-full h-44" resizeMode="cover" />
                <View className="absolute top-3 left-3">
                  <View className={`px-3 py-1 rounded-full ${trip.statusBg}`}>
                    <Text className="text-[11px] font-bold" style={{ color: trip.statusColor }}>{trip.status}</Text>
                  </View>
                </View>
              </View>
              <View className="p-4">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-1">{trip.title}</Text>
                <View className="flex-row items-center gap-1 mb-1">
                  <MaterialIcons name="location-on" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">{trip.location}</Text>
                </View>
                <View className="flex-row items-center gap-1 mb-4">
                  <MaterialIcons name="calendar-today" size={14} color="#64748b" />
                  <Text className="text-xs text-slate-500 dark:text-slate-400 font-medium">{trip.dates}</Text>
                </View>
                <Pressable className="bg-primary rounded-xl py-3 items-center justify-center active:opacity-80">
                  <Text className="text-white font-bold text-sm">View Trip Details</Text>
                </Pressable>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
