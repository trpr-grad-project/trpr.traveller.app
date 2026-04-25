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
import { router } from "expo-router";

const REQUESTS = [
  {
    id: "1",
    title: "Mountain Hiking Expedition",
    location: "Rocky Mountains, CO",
    dates: "Oct 15-20",
    participants: 4,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAQgxoBGRCYo56H8agH1lx0NkoaNHA2VSfB_BH5DlxVxfvRsBi_sb22TE3QNJuqndKo4rSnjWZnJEbTjV4KBsr9GyhU1rO9waqdTuhmAYF51CivtdnMENEmSlXWTHurJwn_4lYrItNnCRQLBYr_EDd-kiBUN03VblWdyWfoUyYqTI3TL5DvddnhrSDdqwB_Xa7q5Htj8tQ8tpPlVBHBuYfFCgbmmO1JjUhlmSTtV8pScWsKYuvpPYwkXPfjpSZcWN5Cw09ky0-e2R0L",
  },
  {
    id: "2",
    title: "Coastal Photography Tour",
    location: "Big Sur, CA",
    dates: "Nov 02-05",
    participants: 2,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBUf2rjRa4djuRJq0fxOGZyGJxuJWDlWfr7bYZYmsTYgQcs_CI_IyeHInRS-0jze5qYRvJicK3GJ0b23KePMdD5K5buA4nkRPOQhQ2lPYqovnyl32mo1E0xNns8a5fJFlaM2M0L-_K69zgRqScEH8E_BqXOmFpYqE2kzUidy-_IeacnlTAe1S6hBYDkfF80dUiz-Z9bMZoHFmgnxem9QTigZfKc2SK-Q_QfQCzrN1wbyyAZqQHszjFhteAtanDA-CZQj6RXTIlvJ4y9",
  },
];

const ASSIGNED_TRIPS = [
  {
    id: "1",
    title: "Swiss Alps Peak Climbing",
    location: "Zermatt, Switzerland",
    dates: "Sept 28 - Oct 04",
    avatarCount: 6,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDkk2fgZ5r_Ysp6Og1CglPLdEnnyK89b1_h1g6pNKaiUJXRZPiQpqctzxPh1EMJynw64JKJLgAkYPrptSIgrVjrJ9F4KzPNYcaM23eVtN2AibNeJqT-PKuGNWbqdTMN0-LhrjZrOzb6N-7NTREjZXLRAwGqiH3vN47oFxgv27z7eKjozyoLN-bd6kXHQvQNOEsk1FKFBfcmFTOCYDbFrebPvx_BndM-x65Zq6RIOelygE8DbWjE3dO6YFSPwjGa9_b_mr7Ahha6VFpz",
  },
  {
    id: "2",
    title: "Bali Spiritual Retreat Guide",
    location: "Ubud, Indonesia",
    dates: "Oct 10 - Oct 17",
    avatarCount: 3,
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBAWmUOAnGOxbEeT-F0GRCHn2r6RYazH-wh0Rbpp5Lh6CZxcwJwHEnIwmYS3QsNvB5_YzCV1vZYU7VXkalyO8fIazntCxYciGqJGs9SWUBi2SurUa7BokTXMYpTAdHniljE6zg7pJarfFBIxL1nHDONybXqpau-RYk4qtRtsjVe0keUNQIzmKCvTEmb8zzWGk80Gg3C6BRp8vfhlrDDUd6vLhtTnyypHDhCxWfFHyVsAdsT6NPekhtlD9ycuA9AiP-E6dfGN",
  },
];

export default function GuideDashboard() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center bg-white dark:bg-slate-900 px-4 py-3 border-b border-slate-200 dark:border-slate-800 justify-between">
        <View className="flex-row items-center">
          <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCkotMnX1hNRR7lZ-fWZ1XirWQwdNNFDhTSwNfjzmZMO3SMF-ET-C-Bqf-5JsYGw6ju_6wSD9wlU9MA1bqMe1VV7J7w_84rZB7w7J4tn6jz_0GwhQmuVJd75_owYJpjYqkX0SWLJEpeIPN5iktlttnekmqpVm3e_Xoqvj4LgjFiixyAWaxtfOuDrZ5v6ZmkES564ONcNGtseEUdB_uHGTEmzw1UbMwNwF3vfrIelkpK0uFH5a3A-t_CKVICBMr1wMiQ_OfLNTULQgkg" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <View className="ml-3">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold leading-tight">Welcome, Alex</Text>
          </View>
        </View>
        <View className="relative">
          <Pressable className="w-10 h-10 items-center justify-center rounded-lg">
            <MaterialIcons name="notifications" size={24} color="#0f172a" />
          </Pressable>
          <View className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white dark:border-slate-900" />
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Trip Requests */}
        <View className="px-4 py-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">
              Trip Requests ({REQUESTS.length})
            </Text>
          </View>
          <View className="gap-4">
            {REQUESTS.map((req) => (
              <View
                key={req.id}
                className="flex-col gap-4 rounded-xl bg-white dark:bg-slate-900 p-4 border border-slate-200 dark:border-slate-800 shadow-sm"
              >
                <View className="flex-row justify-between items-start gap-4">
                  <View className="flex-col gap-1 flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <MaterialIcons name="group" size={14} color="#359EFF" />
                      <Text className="text-primary text-xs font-bold uppercase tracking-wide">{req.participants} Participants</Text>
                    </View>
                    <Text className="text-slate-900 dark:text-slate-100 text-base font-bold leading-tight">{req.title}</Text>
                    <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">{req.location} • {req.dates}</Text>
                  </View>
                  <View className="w-20 h-20 rounded-lg overflow-hidden">
                    <Image source={{ uri: req.image }} className="w-full h-full" resizeMode="cover" />
                  </View>
                </View>
                <View className="flex-row gap-2">
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-lg bg-primary h-9">
                    <MaterialIcons name="check" size={16} color="white" />
                    <Text className="text-white text-sm font-bold">Accept</Text>
                  </Pressable>
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 rounded-lg border border-slate-300 dark:border-slate-600 h-9">
                    <MaterialIcons name="close" size={16} color="#64748b" />
                    <Text className="text-slate-700 dark:text-slate-300 text-sm font-bold">Reject</Text>
                  </Pressable>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* My Assigned Trips */}
        <View className="px-4 py-2">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-slate-900 dark:text-slate-100 text-lg font-bold tracking-tight">My Assigned Trips</Text>
            <Pressable onPress={() => router.push("/(guide)/schedule")}>
              <Text className="text-primary text-sm font-bold">View Calendar</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {ASSIGNED_TRIPS.map((trip) => (
              <View
                key={trip.id}
                className="relative flex-col gap-3 rounded-xl bg-white dark:bg-slate-900 p-3 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden"
              >
                <View className="absolute top-3 right-3 z-10">
                  <View className="bg-primary px-2 py-1 rounded">
                    <Text className="text-white text-[10px] font-black uppercase tracking-tighter">Assigned to you</Text>
                  </View>
                </View>
                <View className="w-full rounded-lg overflow-hidden" style={{ aspectRatio: 16 / 7 }}>
                  <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="px-1 pb-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <MaterialIcons name="calendar-today" size={12} color="#94a3b8" />
                    <Text className="text-slate-500 dark:text-slate-400 text-xs font-semibold uppercase tracking-tight">{trip.dates}</Text>
                  </View>
                  <Text className="text-slate-900 dark:text-slate-100 text-base font-bold">{trip.title}</Text>
                  <View className="flex-row items-center justify-between mt-2">
                    <View className="flex-row items-center gap-2">
                      <MaterialIcons name="location-on" size={14} color="#94a3b8" />
                      <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">{trip.location}</Text>
                    </View>
                    <Pressable>
                      <Text className="text-primary text-xs font-bold">View Details</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
