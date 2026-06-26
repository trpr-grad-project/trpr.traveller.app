import React from "react";
import { Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams } from "expo-router";

const REVIEWS = [
  { id: "1", name: "Alex Thompson", rating: 5, text: "Amazing guide! Noura made our felucca trip unforgettable with her deep knowledge of Nubian history and culture. She took us to the best photo spots and even arranged a traditional tea ceremony on the riverbank. Highly recommend for anyone visiting Aswan!", date: "2 weeks ago" },
  { id: "2", name: "Sarah Jenkins", rating: 4, text: "Wonderful experience! The sunset views from the Nile were absolutely breathtaking. Noura was incredibly friendly and knowledgeable. The only small issue was that we started a bit late, but overall it was a fantastic day.", date: "1 month ago" },
  { id: "3", name: "Marcus Brown", rating: 5, text: "Noura is the best guide in Aswan! She knows all the hidden gems and local spots that you won't find in any guidebook. Her English is excellent and she made sure everyone in our group was comfortable.", date: "2 months ago" },
  { id: "4", name: "Yuki Tanaka", rating: 5, text: "The Nubian village visit was the highlight of our Egypt trip. Noura's connections with the local community gave us an authentic experience we'll never forget.", date: "3 months ago" },
];

export default function GuideReviewsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [expanded, setExpanded] = React.useState<string | null>(null);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="bg-background-light/90 dark:bg-background-dark/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
          <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">Reviews</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 32 }}>
        {REVIEWS.map((review) => {
          const isExpanded = expanded === review.id;
          const needsTruncation = review.text.length > 120;
          return (
            <View key={review.id} className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700">
              <View className="flex-row items-center gap-3 mb-3">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                  <Text className="text-base font-bold text-primary">{review.name[0]}</Text>
                </View>
                <View className="flex-1">
                  <Text className="text-base font-bold text-[#0c141d] dark:text-white">{review.name}</Text>
                  <View className="flex-row gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialIcons key={i} name={i < review.rating ? "star" : "star-border"} size={16} color="#eab308" />
                    ))}
                  </View>
                </View>
                <Text className="text-xs text-slate-400">{review.date}</Text>
              </View>
              <Text className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                {isExpanded || !needsTruncation ? review.text : `${review.text.substring(0, 120)}...`}
              </Text>
              {needsTruncation && (
                <Pressable onPress={() => setExpanded(isExpanded ? null : review.id)}>
                  <Text className="text-sm font-semibold text-primary mt-2">{isExpanded ? "Show less" : "Read more"}</Text>
                </Pressable>
              )}
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}
