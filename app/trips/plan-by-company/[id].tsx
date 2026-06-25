import React, { useState } from "react";
import { Image, Pressable, ScrollView, StatusBar, Text, View } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

export default function PlanByCompanyScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        <View className="relative" style={{ aspectRatio: 4 / 3 }}>
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDGxYJqtmpl3VOiV7lH0QE5KD4mh8HTmMLkahkhYLZ6Of1qQ1hxahPjUKcLJCjTXhLJWMybJYe3Ogq4Za0QcrBztbPiUsDnD0ul2MVY-XLtLnb5uGMblpVwBvrXH5qGMXJaPPO3o4QEIWIEK0NxFuO0bVWv69zkLzkphFFSsxI67kQ4lQd1jdRt6HJLYLcqZiEKv9L3WMzG2dXsOFdwnAJ7-1WAjw-rjWM9C6dDcXQAJtssjtdMG1sPo4UPEEMMoyVhGmGdB9_B-nXm" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4" style={{ paddingTop: insets.top + 16 }}>
            <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
              <MaterialIcons name="arrow-back" size={24} color="white" />
            </Pressable>
          </View>
          <View className="absolute bottom-4 left-4 px-3 py-1.5 rounded-full bg-primary/90 backdrop-blur">
            <View className="flex-row items-center gap-1">
              <MaterialIcons name="verified" size={14} color="white" />
              <Text className="text-[10px] font-bold text-white tracking-wider uppercase">By Company</Text>
            </View>
          </View>
        </View>

        <View className="-mt-4 rounded-t-3xl bg-background-light dark:bg-background-dark pt-6 px-4">
          <View className="flex-row justify-between items-start mb-2">
            <View className="flex-1 mr-4">
              <Text className="text-2xl font-bold text-[#0c141d] dark:text-white">Luxor Temples Discovery</Text>
              <Text className="text-sm text-slate-500 dark:text-slate-400 font-medium mt-1">Upper Egypt • 2 Days</Text>
            </View>
            <Text className="text-2xl font-bold text-primary">$150</Text>
          </View>

          <View className="flex-row items-center gap-2 mb-6">
            <View className="px-2.5 py-1 rounded-full bg-primary/10 border border-primary/20">
              <Text className="text-[10px] font-bold text-primary tracking-wide uppercase">Culture</Text>
            </View>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <View className="flex-row items-center gap-4">
              <View className="w-14 h-14 rounded-xl bg-primary/10 items-center justify-center">
                <MaterialIcons name="business" size={28} color="#359EFF" />
              </View>
              <View className="flex-1">
                <View className="flex-row items-center gap-1.5">
                  <Text className="text-base font-bold text-[#0c141d] dark:text-white">Apex Travel</Text>
                  <MaterialIcons name="verified" size={16} color="#22c55e" />
                </View>
                <View className="flex-row items-center gap-1 mt-0.5">
                  <MaterialIcons name="star" size={14} color="#eab308" />
                  <Text className="text-xs font-bold text-slate-600 dark:text-slate-400">4.9</Text>
                  <Text className="text-xs text-slate-400">(124 reviews)</Text>
                </View>
              </View>
              <Pressable
                onPress={() => router.push(`/trips/company/${id}`)}
                className="px-4 py-2 rounded-lg border border-primary/30"
              >
                <Text className="text-xs font-bold text-primary">View Profile</Text>
              </Pressable>
            </View>
          </View>

          <View className="mb-6">
            <Text className="text-lg font-bold text-[#0c141d] dark:text-white mb-2">About this trip</Text>
            <Text className="text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              Discover the wonders of Luxor with our expert-guided tour. Visit the magnificent Karnak Temple, explore the Valley of the Kings, and experience the rich history of ancient Egypt. This comprehensive tour includes all transportation, entry fees, and a professional Egyptologist guide.
              <Text className="text-primary font-semibold"> Read more</Text>
            </Text>
          </View>

          <View className="bg-white dark:bg-slate-800 rounded-2xl p-5 shadow-sm border border-slate-50 dark:border-slate-700 mb-6">
            <Text className="text-base font-bold text-[#0c141d] dark:text-white mb-4">What&apos;s included</Text>
            <View className="gap-3">
              {[
                { label: "AC Transport", included: true },
                { label: "Expert Guide", included: true },
                { label: "Entry Tickets", included: true },
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

            {[
              { day: 1, title: "Arrival & Karnak Temple", stops: 3 },
              { day: 2, title: "Valley of the Kings", stops: 2 },
            ].map((day) => (
              <View key={day.day}>
                <Pressable
                  onPress={() => setExpandedDay(expandedDay === day.day ? null : day.day)}
                  className="flex-row items-center justify-between p-4 border-t border-slate-50 dark:border-slate-700"
                >
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-xl bg-primary items-center justify-center">
                      <Text className="text-white font-bold">{day.day}</Text>
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-[#0c141d] dark:text-white">{day.title}</Text>
                    </View>
                  </View>
                  <MaterialIcons
                    name={expandedDay === day.day ? "expand-less" : "expand-more"}
                    size={20}
                    color="#94a3b8"
                  />
                </Pressable>
                {expandedDay === day.day && (
                  <View className="px-5 pb-4 gap-3 border-t border-slate-50 dark:border-slate-700 pt-3">
                    {[
                      { time: "09:00", title: "Karnak Temple", duration: "3h" },
                      { time: "14:00", title: "Luxor Temple", duration: "2h" },
                      { time: "17:00", title: "Local Market Walk", duration: "1.5h" },
                    ].slice(0, day.stops).map((stop, i) => (
                      <View key={stop.title} className="flex-row gap-3">
                        <View className="items-center">
                          <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center">
                            <Text className="text-xs font-bold text-primary">{i + 1}</Text>
                          </View>
                          {i < day.stops - 1 && <View className="flex-1 w-px bg-primary/20 my-1" />}
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
            ))}
          </View>
        </View>
      </ScrollView>

      <View
        className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-background-dark/95 border-t border-slate-100 dark:border-slate-800 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <Pressable
          onPress={() => router.push(`/trips/booking/${id}`)}
          className="w-full h-14 bg-primary rounded-xl items-center justify-center shadow-lg"
          style={{ shadowColor: "#359EFF", shadowOpacity: 0.2 }}
        >
          <Text className="text-white font-bold text-base">Book Trip</Text>
        </Pressable>
      </View>
    </View>
  );
}
