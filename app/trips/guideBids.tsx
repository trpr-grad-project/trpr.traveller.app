import React from "react";
import {
  Image,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import BackButton from "@/components/BackButton";
import PrimaryButton from "@/components/PrimaryButton";
import { useColorScheme } from "nativewind";

const BIDS = [
  {
    id: "1",
    name: "Kenji Sato",
    specialty: "Local Culture Expert",
    rating: 5.0,
    reviews: 300,
    price: "$80",
    priceUnit: "/day",
    turnaround: "Responds within 1h",
    tags: ["Temples", "Zen Gardens", "History"],
    topPick: true,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuDSwDWki_QrSSWazjAkJ6UTImreG6lQmAbHdePKEPQYhrpwqiF52SpDqDxVP7ZOI4yxcNlyx1crJJtPRDsh6mV1px22SU483rv9xP94uTUejL0o6O9UGTWw32DrrqyhL3Snqgc-SHRcordg81i0EFWhLjK3TnJeXkg7Et37lgj0z1XFeXAEEx8vKV2lkphtgGDXKdc83bYiI2Y7HsGuLNPihBLtg7hg1SdWkio07_oH_q-hFpRo05qUKqd9J4pPz-87VzVsJa2Osn1a",
  },
  {
    id: "2",
    name: "Elena Rossi",
    specialty: "Art History Guide",
    rating: 4.9,
    reviews: 120,
    price: "$65",
    priceUnit: "/day",
    turnaround: "Responds within 3h",
    tags: ["Food Tours", "Hidden Gems", "Art"],
    topPick: false,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuACb46Av0L2s-4J3GGZ5eTEyTzsvF6ARkpcnfaVXFgOrSHRAvzS1NQrjZncBxV3YfcqqCv2c1whBd7PNhfRDCjFNVEzc3Bdu0OrHrfJvA8hGUohleTU4aLvI0zXLRe8IzLSvsoep_HiQCZX_dY_D7zzgXrQV1GJpLj19hL_zuTkphdyR43nLtKD5ftQGBk5SKvvVtgXhMVss-JDV5jkP0jS-fXXk89059MjiurS9Zknjs7FjAP8aFu6ihEiRbpVtvRLnghr4hpKpA0L",
  },
  {
    id: "3",
    name: "Sakura Tanaka",
    specialty: "Photography Guide",
    rating: 4.8,
    reviews: 85,
    price: "$55",
    priceUnit: "/day",
    turnaround: "Responds within 5h",
    tags: ["Photo Spots", "Night Walks"],
    topPick: false,
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD7uX8wte7e5VlsG_JE0PjrevwU75qqv5dpCg4u2ToslOcL-wMNkVciJycdD8jo3SOXaGWIhnBuzHj-hdc-I36Tn0QD1dg_YeDrLyJfDmC_T3AFvF6Gy4BZ1Bcs9D-8eDQWeg4EGMWdgwnKk9dEP0P67as-JmH_gf48S8yfBVFPhCtsxIQ1nmi-v-l1dAGtzYE0iz40KOse_22gOQ210hXTl4V9Bk40tC9kprObPrHJTDVbRA0BH5Kkp5zPtACfSHkZPqtUUAPIbu3X",
  },
];

export default function GuideBidsScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <View className="flex-1 ml-2">
          <Text className="text-lg font-bold text-slate-900 dark:text-white">Guide Bids</Text>
          <Text className="text-xs text-slate-500 dark:text-slate-400">Kyoto, Japan • {BIDS.length} bids received</Text>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, gap: 16, paddingBottom: 24 }}>
        {/* Info banner */}
        <View className="flex-row gap-3 items-center bg-primary/10 border border-primary/20 rounded-xl p-3">
          <MaterialIcons name="info" size={20} color="#359EFF" />
          <Text className="text-xs text-primary font-medium flex-1">
            These guides have reviewed your trip and are ready to guide you. Select the best fit!
          </Text>
        </View>

        {BIDS.map((bid) => (
          <View
            key={bid.id}
            className={`bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-sm border ${
              bid.topPick ? "border-primary/30 shadow-md" : "border-slate-100 dark:border-slate-700"
            }`}
          >
            {bid.topPick && (
              <View className="absolute -top-2.5 left-4 bg-primary px-3 py-1 rounded-full flex-row items-center gap-1">
                <MaterialIcons name="auto-awesome" size={12} color="white" />
                <Text className="text-white text-[10px] font-bold uppercase tracking-wide">AI Recommended</Text>
              </View>
            )}
            <View className="flex-row gap-3 mt-2">
              <View className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                <Image source={{ uri: bid.avatar }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="flex-1 min-w-0">
                <View className="flex-row justify-between items-start">
                  <View>
                    <Text className="font-bold text-slate-900 dark:text-white">{bid.name}</Text>
                    <Text className="text-xs text-primary font-semibold">{bid.specialty}</Text>
                  </View>
                  <View className="items-end">
                    <Text className="text-green-500 font-bold text-base">{bid.price}</Text>
                    <Text className="text-xs text-slate-500 dark:text-gray-400">{bid.priceUnit}</Text>
                  </View>
                </View>
                <View className="flex-row items-center gap-2 mt-1">
                  <MaterialIcons name="star" size={14} color="#eab308" />
                  <Text className="text-xs font-bold text-slate-700 dark:text-gray-200">{bid.rating}</Text>
                  <Text className="text-xs text-slate-400">•</Text>
                  <Text className="text-xs text-slate-500 dark:text-gray-400">{bid.reviews} reviews</Text>
                </View>
              </View>
            </View>

            {/* Tags */}
            <View className="flex-row flex-wrap gap-2 mt-3">
              {bid.tags.map((tag) => (
                <View key={tag} className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 rounded-full">
                  <Text className="text-xs font-medium text-slate-600 dark:text-slate-300">{tag}</Text>
                </View>
              ))}
            </View>

            <View className="flex-row items-center justify-between mt-3 pt-3 border-t border-slate-100 dark:border-slate-700">
              <View className="flex-row items-center gap-1">
                <MaterialIcons name="schedule" size={14} color="#94a3b8" />
                <Text className="text-xs text-slate-500 dark:text-gray-400">{bid.turnaround}</Text>
              </View>
              <PrimaryButton title="Select" onPress={() => router.push("/trips/confirmGuide")} className="px-4 py-2 h-auto min-h-0 rounded-lg" />
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
