import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";

const GUIDE_TRIPS = [
  { id: "1", title: "Nile Sunset Felucca", price: "$45", duration: "3hrs", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANeO4WOrOcetZrYjzvqwfqCPkuEe_tG8D5wpwVgmKQn-3dZvZCTR2fSPc8yLEdaFGeALkWMyviuF4j5q2lNMndo-0bz0kO8fQ0JPOS82rUK-_e9i-yUu0p1MYjz68owfQkGDj8_H-f9EemeDh9kVLR87Dqb02blChGbAnGXJjeEjt50Gf4iA-fOLOcIf_vz4kKIF7iMbkCQ3mT211hn0MTwC6WZbXE75gHptCaq3zlbzFP6OAdJRc1gILY9en-99phSaLUl1Ex64n4" },
  { id: "2", title: "Elephantine Island Discovery", price: "$35", duration: "4hrs", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf" },
];

export default function GuideProfileScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="flex-row items-center justify-between px-4 py-3">
          <BackButton iconSize={20} iconName="arrow-back-ios-new" />
          <Text className="text-lg font-bold text-[#0c141d] dark:text-white flex-1 text-center" />
          <View className="relative">
            <Pressable
              onPress={() => setMenuOpen(!menuOpen)}
              className={`w-10 h-10 items-center justify-center rounded-full ${menuOpen ? "bg-slate-100 dark:bg-slate-700" : ""}`}
            >
              <MaterialIcons name="more-vert" size={22} color="#64748b" />
            </Pressable>
            {menuOpen && (
              <View className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 z-50 overflow-hidden"
                style={{ shadowColor: "#000", shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 }}
              >
                <Pressable className="flex-row items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700">
                  <MaterialIcons name="ios-share" size={20} color="#64748b" />
                  <Text className="text-sm font-medium text-slate-700 dark:text-slate-200">Share Profile</Text>
                </Pressable>
                <View className="h-px bg-slate-100 dark:bg-slate-700" />
                <Pressable className="flex-row items-center gap-3 px-4 py-3">
                  <MaterialIcons name="block" size={20} color="#ef4444" />
                  <Text className="text-sm font-medium text-red-500">Block</Text>
                </Pressable>
                <Pressable className="flex-row items-center gap-3 px-4 py-3">
                  <MaterialIcons name="flag" size={20} color="#ef4444" />
                  <Text className="text-sm font-medium text-red-500">Report</Text>
                </Pressable>
              </View>
            )}
          </View>
        </View>

        <View className="items-center px-6 pb-6">
          <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-slate-800 shadow-xl mb-4">
            <Image
              source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXRoVjBVWbDU44_1uomE99h_eCRFBzvkWREFuBLAzPWn3geroTnaF2T42Mh4XoUXUNkFYI5uLgKPQcEfpRHzbFQI9cTnE7URgs7g57Xlc6eERlVukkxKQ9ebxRMcdXAdjhBcSIhP42_fY3BZ2ENO2hrLKt3L9ffYvPV6v_nYy6xUMsEjEYmZVO0VQO198CiZ7Uv9m5KNF3w6KzugouRsodXT0gRGyLuHqhW_WolGBhGIMcYviRov_HXZvvgj7BxbiOPk6oOrhcKJK" }}
              className="w-full h-full"
              resizeMode="cover"
            />
          </View>
          <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">Noura Mohamed</Text>
          <Text className="text-sm font-semibold text-primary mt-1">Local Guide</Text>

          <View className="flex-row bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 gap-8 mt-4 w-full">
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-[#0c141d] dark:text-white">4.8</Text>
              <View className="flex-row gap-0.5 mt-1">
                <MaterialIcons name="star" size={14} color="#eab308" />
              </View>
              <Text className="text-[10px] text-slate-500 mt-1 font-medium">Rating</Text>
            </View>
            <View className="w-px bg-slate-100 dark:bg-slate-700" />
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-[#0c141d] dark:text-white">85</Text>
              <Text className="text-[10px] text-slate-500 mt-1 font-medium">Reviews</Text>
            </View>
            <View className="w-px bg-slate-100 dark:bg-slate-700" />
            <View className="flex-1 items-center">
              <Text className="text-lg font-bold text-[#0c141d] dark:text-white">12</Text>
              <Text className="text-[10px] text-slate-500 mt-1 font-medium">Trips</Text>
            </View>
          </View>

          <View className="flex-row gap-3 mt-4 w-full">
            <Pressable className="flex-1 flex-row items-center justify-center gap-2 h-12 rounded-xl border border-primary/30">
              <MaterialIcons name="person-add" size={18} color="#359EFF" />
              <Text className="text-sm font-bold text-primary">Follow</Text>
            </Pressable>
          </View>
        </View>

        <View className="px-4 mb-8">
          <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">About Me</Text>
          <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
            Born and raised in Aswan, I&apos;ve been guiding travelers along the Nile for over 8 years. I specialize in Nubian culture, traditional felucca sailing, and finding the best local food spots. Let me show you the real Egypt!
          </Text>
        </View>

        <View className="px-4 mb-8">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Trips by Noura</Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary">View all</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {GUIDE_TRIPS.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => router.push(`/trips/plan-by-guide/${trip.id}`)}
                className="w-40 gap-2"
              >
                <View className="w-40 h-32 rounded-2xl overflow-hidden">
                  <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white leading-tight">{trip.title}</Text>
                <View className="flex-row items-center justify-between">
                  <Text className="text-sm font-bold text-primary">{trip.price}</Text>
                  <Text className="text-[10px] text-slate-400">{trip.duration}</Text>
                </View>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Recent Reviews</Text>
            <Pressable onPress={() => router.push(`/trips/guide/${id}/reviews`)}>
              <Text className="text-sm font-semibold text-primary">Read More Reviews</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {[
              { name: "Alex Thompson", rating: 5, text: "Amazing guide! Noura made our felucca trip unforgettable with her knowledge of Nubian history.", date: "2 weeks ago" },
              { name: "Sarah Jenkins", rating: 4, text: "Wonderful experience. The sunset views were breathtaking and Noura was so friendly!", date: "1 month ago" },
            ].map((review) => (
              <View key={review.name} className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700">
                <View className="flex-row items-center gap-3 mb-2">
                  <View className="w-10 h-10 rounded-full bg-primary/10 items-center justify-center">
                    <Text className="text-sm font-bold text-primary">{review.name[0]}</Text>
                  </View>
                  <View className="flex-1">
                    <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{review.name}</Text>
                    <View className="flex-row gap-0.5">
                      {Array.from({ length: review.rating }).map((_, i) => (
                        <MaterialIcons key={i} name="star" size={14} color="#eab308" />
                      ))}
                    </View>
                  </View>
                  <Text className="text-xs text-slate-400">{review.date}</Text>
                </View>
                <Text className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">{review.text}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
