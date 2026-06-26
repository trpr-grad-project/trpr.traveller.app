import React from "react";
import { ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import BackButton from "@/components/BackButton";

const REVIEWS = [
  {
    id: "1",
    name: "Sarah Johnson",
    initials: "SJ",
    rating: 5,
    text: "Alex was an incredible guide! His knowledge of ancient Egyptian history made the tour unforgettable. He took us to all the best spots and even shared hidden gems that weren't on the itinerary. Highly recommend for anyone visiting Luxor!",
    date: "Jun 12, 2026",
    tour: "Luxor Temple Discovery",
  },
  {
    id: "2",
    name: "Marcus Chen",
    initials: "MC",
    rating: 4,
    text: "Great experience overall. The Nile cruise was beautiful and the organization was flawless. Would have loved a bit more time at the Temple of Karnak, but everything else was perfect. The sunset view from the felucca was breathtaking.",
    date: "May 28, 2026",
    tour: "Nile Sunset Felucca Tour",
  },
  {
    id: "3",
    name: "Emily Rodriguez",
    initials: "ER",
    rating: 5,
    text: "Absolutely phenomenal! The Giza Pyramids tour exceeded all expectations. Alex arranged early access so we could watch the sunrise over the pyramids — a memory I'll cherish forever. The camel ride through the desert was the cherry on top!",
    date: "May 15, 2026",
    tour: "Giza Pyramids Guided Tour",
  },
];

function Stars({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <MaterialIcons
          key={star}
          name={star <= rating ? "star" : "star-outline"}
          size={16}
          color={star <= rating ? "#f59e0b" : "#cbd5e1"}
        />
      ))}
    </View>
  );
}

export default function ReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <BackButton iconSize={20} />
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Reviews About Me</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40 }}>
        {REVIEWS.map((review) => (
          <View
            key={review.id}
            className="bg-white dark:bg-neutral-dark rounded-2xl border border-slate-100 dark:border-slate-800 p-5 mb-4 shadow-sm"
          >
            <View className="flex-row items-center justify-between mb-3">
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                  <Text className="text-white font-bold text-sm">{review.initials}</Text>
                </View>
                <View>
                  <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{review.name}</Text>
                  <Stars rating={review.rating} />
                </View>
              </View>
              <Text className="text-[11px] text-slate-400 dark:text-slate-500 font-medium">{review.date}</Text>
            </View>
            <Text className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed mb-3">{review.text}</Text>
            <View className="flex-row items-center gap-1.5">
              <MaterialIcons name="tour" size={14} color="#359EFF" />
              <Text className="text-xs font-semibold text-primary">{review.tour}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
