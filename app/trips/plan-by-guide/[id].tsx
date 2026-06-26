import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";
import { useColorScheme } from "nativewind";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";

export default function PlanByGuideScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative h-[315px]">
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuANeO4WOrOcetZrYjzvqwfqCPkuEe_tG8D5wpwVgmKQn-3dZvZCTR2fSPc8yLEdaFGeALkWMyviuF4j5q2lNMndo-0bz0kO8fQ0JPOS82rUK-_e9i-yUu0p1MYjz68owfQkGDj8_H-f9EemeDh9kVLR87Dqb02blChGbAnGXJjeEjt50Gf4iA-fOLOcIf_vz4kKIF7iMbkCQ3mT211hn0MTwC6WZbXE75gHptCaq3zlbzFP6OAdJRc1gILY9en-99phSaLUl1Ex64n4" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4" style={{ paddingTop: insets.top + 16 }}>
            <BackButton iconSize={24} iconName="arrow-back" className="bg-white/20" />
          </View>
          <View className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur">
            <Text className="text-[10px] font-bold text-white tracking-wider uppercase">By Guide</Text>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background-light dark:bg-background-dark pt-6 px-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">Aswan Nile Felucca</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Aswan • 1 Day</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">$45</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-6">
            <View className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Text className="text-[10px] font-bold text-primary tracking-wide uppercase">Adventure</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <View className="flex-row items-center gap-4">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuBwXRoVjBVWbDU44_1uomE99h_eCRFBzvkWREFuBLAzPWn3geroTnaF2T42Mh4XoUXUNkFYI5uLgKPQcEfpRHzbFQI9cTnE7URgs7g57Xlc6eERlVukkxKQ9ebxRMcdXAdjhBcSIhP42_fY3BZ2ENO2hrLKt3L9ffYvPV6v_nYy6xUMsEjEYmZVO0VQO198CiZ7Uv9m5KNF3w6KzugouRsodXT0gRGyLuHqhW_WolGBhGIMcYviRov_HXZvvgj7BxbiOPk6oOrhcKJK" }}
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-[#0c141d] dark:text-white">Noura Mohamed</Text>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MaterialIcons name="star" size={14} color="#eab308" />
                  <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">4.8</Text>
                  <Text className="text-xs text-slate-400">Local Guide</Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push(`/trips/guide/${id}`)}
                className="px-4 py-2 rounded-lg border border-primary/30"
              >
                <Text className="text-xs font-bold text-primary">View Profile</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">About this trip</Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Sail the Nile on a traditional felucca with an experienced local guide. Enjoy breathtaking sunset views, visit botanical gardens, and explore the peaceful islands around Aswan. A perfect day trip for nature lovers and photographers.
              <Text className="text-primary font-semibold"> Read more</Text>
            </Text>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-4">What&apos;s included</Text>
            <View className="gap-3">
              {[
                { label: "Guided tour", included: true },
                { label: "Local insights", included: true },
                { label: "Flexible schedule", included: true },
                { label: "Meals", included: false },
              ].map((item) => (
                <View key={item.label} className="flex-row items-center gap-3">
                  <MaterialIcons
                    name={item.included ? "check-circle" : "cancel"}
                    size={20}
                    color={item.included ? "#22c55e" : "#94a3b8"}
                  />
                  <Text className={`text-sm font-medium ${item.included ? "text-[#0c141d] dark:text-white" : "text-slate-400"}`}>
                    {item.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-50 dark:border-slate-700 overflow-hidden mb-6">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white p-5 pb-3">Itinerary</Text>
            <Pressable
              onPress={() => setExpandedDay(expandedDay === 1 ? null : 1)}
              className="flex-row items-center justify-between p-4 border-t border-slate-50 dark:border-slate-700"
            >
              <View className="flex-row items-center gap-3">
                <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                  <Text className="text-white font-bold">1</Text>
                </View>
                <Text className="text-sm font-bold text-[#0c141d] dark:text-white">Island Hopping & Sunset Sail</Text>
              </View>
              <MaterialIcons name={expandedDay === 1 ? "expand-less" : "expand-more"} size={20} color="#94a3b8" />
            </Pressable>
            {expandedDay === 1 && (
              <View className="px-5 pb-4 gap-3 border-t border-slate-50 dark:border-slate-700 pt-3">
                {[
                  { time: "10:00", title: "Felucca Boarding", duration: "30min" },
                  { time: "11:00", title: "Kitchener's Island", duration: "2h" },
                  { time: "15:00", title: "Sunset Sail", duration: "2h" },
                ].map((stop, i) => (
                  <View key={stop.title} className="flex-row gap-3">
                    <View className="items-center">
                      <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                        <Text className="text-xs font-bold text-primary">{i + 1}</Text>
                      </View>
                      {i < 2 && <View className="flex-1 w-px bg-primary/20 my-1" />}
                    </View>
                    <View className="flex-1 pb-3">
                      <View className="flex-row justify-between">
                        <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{stop.title}</Text>
                        <Text className="text-xs font-medium text-primary">{stop.duration}</Text>
                      </View>
                      <Text className="text-xs text-slate-500 mt-0.5">{stop.time}</Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <PrimaryButton
          title="Book Trip"
          onPress={() => router.push(`/trips/booking/${id}`)}
        />
      </View>
    </View>
  );
}
