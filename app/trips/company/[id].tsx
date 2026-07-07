import React from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const COMPANY_TRIPS = [
  { id: "1", title: "Luxor Temples Discovery", price: "$150", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" },
  { id: "2", title: "Valley of the Kings Private", price: "$210", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuATlIyLdX0EzgB-ANyT3YzRHbzi5AAHhodUiHybWfcMYHJ2weJk1LNoLScSpGgq7lMHI5Ctz7c0HsPxU5pLIe547mXqVc-F1NeSkkMYbXTxlR4bOuKCWJvKjzh6KI7ZNjBImDiDLe1ogwzDCzCscW4JQ854MCbG34O7JJmC6ai9nV5aG-OakGRh2s9AyumPSC8ZcIJoCXJz23wBGq-8psvPormuFzaqwMNHbCy5JjCjZQqlYv0rVFWd0-qKymgT4KJJL_Kp5E7zQmMs" },
  { id: "3", title: "Nile Sunset Felucca", price: "$85", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuANeO4WOrOcetZrYjzvqwfqCPkuEe_tG8D5wpwVgmKQn-3dZvZCTR2fSPc8yLEdaFGeALkWMyviuF4j5q2lNMndo-0bz0kO8fQ0JPOS82rUK-_e9i-yUu0p1MYjz68owfQkGDj8_H-f9EemeDh9kVLR87Dqb02blChGbAnGXJjeEjt50Gf4iA-fOLOcIf_vz4kKIF7iMbkCQ3mT211hn0MTwC6WZbXE75gHptCaq3zlbzFP6OAdJRc1gILY9en-99phSaLUl1Ex64n4" },
  { id: "4", title: "Aswan Cultural Tour", price: "$120", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCjkNX33Ui4_7LlmzgVcrTHCS3XXN6yfxSwclOXPAaOhllkcp4F-us6JFQeDLpRqN7QQDahqgYlYBx5KvLMt2n4brCspWnohknaYyvWtQwA5PJQ2v8ropSgdFCHQ-BZs22FAAven2iRoM_pnxSsMKbDVuWcqCUECqLAyFflTu_8wPwSSygX4I1Wj4BSZfUh8MYJ3OzbxqdnOZgFKSOEDYlj_p04incbF0f1FMYnivu8XYTC3HSmAzXOBFpdLL53LFQUdXDCByO2s7Wf" },
];

export default function CompanyProfileScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 32 }}>
        <View className="relative" style={{ aspectRatio: 16 / 9 }}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_A7ZqCz5E9As9AlEupTNdVkKAvpM7-G-IA1s8zX7_vLrgCHBGI9CtLoUs-S9Z_v0jftpicmexl1C3DGFWMEBmewfTQ_vWffFAW-GcnsEDCelrPtcnckFk985I5jcVcdRJUX2Om64wXJ7w4hYqkvUdA2VnqiPIct90Bx4QxAJsmTgzIJ3z-I1ZUR1sBiDo49ei-L4c27iTxIFp4yEtOeaezfTjqCevVBt08-xGka57j2nepZdriQveVoGpJunFxBXwusGUBKdJKKeB" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/40" />
          <View className="absolute top-0 left-0 right-0 px-4" style={{ paddingTop: insets.top + 16 }}>
            <BackButton iconSize={18} iconName="arrow-back-ios-new" />
          </View>
        </View>

        <View className="px-4 -mt-6">
          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-row items-center gap-3">
                <View className="w-16 h-16 rounded-2xl bg-primary/10 items-center justify-center">
                  <MaterialIcons name="business" size={32} color="#359EFF" />
                </View>
                <View>
                  <View className="flex-row items-center gap-1.5">
                    <Text className="text-xl font-bold text-[#0c141d] dark:text-white">Apex Travel</Text>
                    <MaterialIcons name="verified" size={18} color="#22c55e" />
                  </View>
                  <View className="flex-row items-center gap-1 mt-0.5">
                    <MaterialIcons name="star" size={14} color="#eab308" />
                    <Text className="text-xs font-bold text-slate-700">4.9 (124 reviews)</Text>
                  </View>
                  <Text className="text-xs text-primary font-semibold mt-0.5">12 Years Experience</Text>
                </View>
              </View>
              <Pressable className="px-4 py-2 rounded-lg border border-primary/30">
                <Text className="text-xs font-bold text-primary">Follow</Text>
              </Pressable>
            </View>

            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400 mb-4">
              Apex Travel has been providing premium tour experiences across Egypt for over a decade. We specialize in historical and cultural tours led by certified Egyptologists.
            </Text>

            <View className="flex-row flex-wrap gap-2 mb-4">
              {["Historical", "Adventure"].map((tag) => (
                <View key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 dark:bg-slate-700">
                  <Text className="text-xs font-semibold text-slate-600 dark:text-slate-300">{tag}</Text>
                </View>
              ))}
            </View>

            <View className="flex-row border-t border-slate-100 dark:border-slate-700 pt-4">
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-[#0c141d] dark:text-white">500+</Text>
                <Text className="text-xs text-slate-500 mt-1">Trips</Text>
              </View>
              <View className="w-px bg-slate-100 dark:bg-slate-700" />
              <View className="flex-1 items-center">
                <Text className="text-xl font-bold text-[#0c141d] dark:text-white">30+</Text>
                <Text className="text-xs text-slate-500 mt-1">Guides</Text>
              </View>
            </View>
          </View>
        </View>

        <View className="mt-8 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Trips by Apex</Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary">View all</Text>
            </Pressable>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
            {COMPANY_TRIPS.map((trip) => (
              <Pressable
                key={trip.id}
                onPress={() => router.push(`/trips/plan-by-company/${trip.id}`)}
                className="w-40 gap-2"
              >
                <View className="w-40 h-32 rounded-2xl overflow-hidden">
                  <Image source={{ uri: trip.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white leading-tight">{trip.title}</Text>
                <Text className="text-sm font-bold text-green-500">{trip.price}</Text>
              </Pressable>
            ))}
          </ScrollView>
        </View>

        <View className="mt-8 px-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white">Reviews</Text>
            <Pressable>
              <Text className="text-sm font-semibold text-primary">View all</Text>
            </Pressable>
          </View>
          <View className="gap-4">
            {[
              { name: "James Wilson", rating: 5, text: "Absolutely incredible experience! The guide was knowledgeable and the itinerary was perfect.", date: "2 weeks ago" },
              { name: "Sarah Chen", rating: 5, text: "Well-organized tour. Everything was seamless from pickup to drop-off.", date: "1 month ago" },
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
