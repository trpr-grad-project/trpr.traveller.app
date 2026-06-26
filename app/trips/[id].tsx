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
import { router, useLocalSearchParams } from "expo-router";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";

const ACTION_BUTTONS = [
  { icon: "auto-awesome" as const, label: "AI Chat", primary: true },
  { icon: "near-me" as const, label: "Directions" },
  { icon: "cloud" as const, label: "Weather" },
  { icon: "camera-enhance" as const, label: "AI Scan" },
];

const GUIDES = [
  { name: "Hiroshi", specialty: "History", active: true, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWp6muKsHer3B746DB4Gw7TKeZwxiFsHAIlxHngFZp0p6920v8izAzcrI0kgg7Sr8J7MkcdDGkyta6aN5RyiT3ZWWjY4GNBx7a_9LZuah-3pkRbBAYN6kMz7XKCUoA6TXLNnZmT3lXoyDpABUlaggEsdJvQ1UiGVRVMFXTwhlZMzhP4zQWRR1CW8aMRJ-IM6cJsfu_4q9ugKCCo9MQOH8Rb6Z3xRj3aqPGKLrK_Q9374HGa-q_ZIuyJFCuMa1Oz_06J_TZUMzJpL3T" },
  { name: "Yumi", specialty: "Foodie", active: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBhnfKxIa3b0GI99-MVJL7x6e0uqmCL99iuEM-RGFMG9qQqs6klMWY14P7eXXvIQtIgnab92VDnFRvCZx6GtQvoxzmcsYu1PEJIB9JcE7l4lAOOYQzf1lBFwpEbI9xgyevAuNxrFFNRPFwfc07NeaemCs4cAhtYf726wN8IhJgZpzksMOLS8eiYR4uA_RQs35S7DtgPGe0MCexY2EnDPT_FUCoFr5AqMB2p7K_pnPPrcTYlnSw4HImWQ0S6VQmlM6Xt8jWB-e6G5F4F" },
  { name: "Kenji", specialty: "Nature", active: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuClIu0mck1l-r6ixA8ZthE9w706dqpYArYU1EcxCafFuj9KB5-wrPaX8RiyncsO0wt2JNWveS36iPeBcK8u6iOPRWUeY72QnxvMlNUTz-rbLRwsTUFouWq-gUgWaSOmrsFwWLsR9KLbkyZc0wxZDec0ZufCpbw12fWJzZ0nXFuvAXGHUnC_-jGJUe3FVJn5hctYTCfkvaEFQIUsSxo__kbem4M6Jp0zIhFhrIyMohoNXGQ6Z26lgwaufYZ-KF1i0Lmd8haegckxFyMl" },
  { name: "Sakura", specialty: "Art", active: false, avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCso2-LRCqrCUZYwt8IFl3SESh4bm0b6B5v2jKqHRTJ_3qyIfobl62A9wCIDAcafUMZepl_zISKE_0EJxSIGcugg2G9WudlhA6weJJthFu1jR0buNgyUgVSO0BYzV4X_8fuelQzncyjbZ_gqAv3B-gMliBb0cf_bj_ajbpXJwvzNVOe8jA613WL0sdNcVsky1J0Wv3fKBvnynei9VTK_pfYDOnMlh3-qnt9F4PbP0aDaHwnLqxlbF2r9d-PV6tYcj-jsgsc-fIPn9qS" },
];

const PLANS = [
  { title: "Ancient Temples", type: "Historical • Walking", duration: "3 hrs", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuD1nmHH070ExQeLXMq4sk8jDW5Wjz-QC_pgEPD66vTnKSrfcHpQsqNz1bqBKCbchNCNq51ts-YD8HAQHqr3wZjQXoSq5uQ6zSTdPZ1d-dRBRNEc4dGkyorSGshps16v4fkHm1pEifMJ5_HLHdiYxyFahQX1Ilu-b3opQtAfRtbyn0ctaEcWHg5-yLY9k5M5IfoTpmJXwIebZxXLv2PFEpAMdbg6OFvPNLdUU9I74JyMTszmTqrNePf_biXtDBxaGrrOlMvME0pnVYav" },
  { title: "Street Food Walk", type: "Food • Culture", duration: "2 hrs", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuDxgxRii_OpzVnlwevplAqeBo95FDx_pGX4Vju82pWnMCnnqzJ9q4rXCM9jF9YTSBA2XhlcJQd6dPOdefz2bDzUMqmZqxKa5-s647rwxph-Wxi2gaauX_qmd1YWue4a-9Ia9W7sCF9X2N3-hbHUtwDPP_1Kg4ptrDwTWBXeaZ_jaOgiC5KcTs-pjt0UanMPpUJexVgKIqeiR1G36zInp-cvnQzk4qnq_72h-NOexpcYw3rjy_ejvUrBkR2fKsoPk4kQGqT8z68w6m2t" },
  { title: "Zen Gardens", type: "Relaxation • Nature", duration: "4 hrs", image: "https://lh3.googleusercontent.com/aida-public/AB6AXuAn3S50r7o9aBJPZaeC-iQTPmxdfEeNkZPhlnkiujlDykgwwcA-YzmWdzdmBnpxeh9bf4AqB9vVuJIGXxOp7hqa6h9Ns37gRoYh7XekncGWb-8pyghwrP7pUSg8NB-ICZWQiFzu-eFebaNpu2cRj2GqzUpl5vGhIRu554_R95MREUK1o5aHQExeN3fbmE0J5pblyw6E71wFNf0iEhdfUDyCrIks-dRJ14wy29RKKb5mqWOLDHGlsdQCHixfF1arhD976TV-uUD5lR5-" },
];

export default function TripDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("Overview");
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingBottom: insets.bottom }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Hero image */}
        <View className="relative h-[45vh]">
          <Image
            source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuD_A7ZqCz5E9As9AlEupTNdVkKAvpM7-G-IA1s8zX7_vLrgCHBGI9CtLoUs-S9Z_v0jftpicmexl1C3DGFWMEBmewfTQ_vWffFAW-GcnsEDCelrPtcnckFk985I5jcVcdRJUX2Om64wXJ7w4hYqkvUdA2VnqiPIct90Bx4QxAJsmTgzIJ3z-I1ZUR1sBiDo49ei-L4c27iTxIFp4yEtOeaezfTjqCevVBt08-xGka57j2nepZdriQveVoGpJunFxBXwusGUBKdJKKeB" }}
            className="absolute inset-0 w-full h-full"
            resizeMode="cover"
          />
          {/* Dark gradient overlay */}
          <View className="absolute inset-0 bg-black/50" />

          {/* Top controls */}
          <View
            className="absolute top-0 left-0 right-0 flex-row items-center justify-between px-4 pt-4"
            style={{ paddingTop: insets.top + 16 }}
          >
            <BackButton iconSize={18} iconName="arrow-back-ios-new" className="w-10 h-10 bg-white/20" />
            <View className="flex-row gap-3">
              <Pressable className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <MaterialIcons name="share" size={22} color="white" />
              </Pressable>
              <Pressable className="w-10 h-10 rounded-full bg-white/20 items-center justify-center">
                <MaterialIcons name="favorite" size={22} color="#359EFF" />
              </Pressable>
            </View>
          </View>

          {/* Bottom hero text */}
          <View className="absolute bottom-6 left-4 right-4">
            <View className="flex-row items-center gap-2 mb-2">
              <View className="flex-row items-center gap-1.5 bg-primary/20 border border-primary/30 px-2.5 py-1 rounded-full">
                <View className="w-1.5 h-1.5 rounded-full bg-primary" />
                <Text className="text-xs font-bold text-primary">LIVE STATUS: BUSY</Text>
              </View>
              <View className="flex-row items-center gap-1 bg-black/40 px-2.5 py-1 rounded-full">
                <MaterialIcons name="star" size={14} color="#eab308" />
                <Text className="text-xs font-medium text-white">4.9 (2k Reviews)</Text>
              </View>
            </View>
            <Text className="text-4xl font-bold text-white drop-shadow-md">Kyoto, Japan</Text>
          </View>
        </View>

        {/* Content card */}
        <View className="-mt-4 rounded-t-3xl bg-background-light dark:bg-background-dark pt-8">
          {/* Action buttons */}
          <View className="flex-row justify-between px-6 mb-8">
            {ACTION_BUTTONS.map((btn) => (
              <Pressable
                key={btn.label}
                onPress={() => btn.label === "AI Chat" && router.push("/chat/ai")}
                className="items-center gap-2"
              >
                <View className={`w-14 h-14 rounded-2xl items-center justify-center ${
                  btn.primary ? "bg-primary/10" : "bg-gray-100 dark:bg-gray-800"
                }`}>
                  <MaterialIcons name={btn.icon} size={28} color={btn.primary ? "#359EFF" : "#64748b"} />
                </View>
                <Text className="text-xs font-semibold text-gray-600 dark:text-gray-300">{btn.label}</Text>
              </Pressable>
            ))}
          </View>

          {/* Tab switcher */}
          <View className="px-4 mb-6">
            <View className="flex-row bg-gray-200 dark:bg-gray-800 rounded-xl p-1">
              {["Overview", "Attractions", "Plans"].map((tab) => (
                <Pressable
                  key={tab}
                  onPress={() => setActiveTab(tab)}
                  className={`flex-1 py-2 rounded-lg ${
                    activeTab === tab ? "bg-white dark:bg-gray-700 shadow-sm" : "bg-transparent"
                  }`}
                >
                  <Text className={`text-sm font-bold text-center ${
                    activeTab === tab ? "text-gray-900 dark:text-white" : "text-gray-500 dark:text-gray-400"
                  }`}>
                    {tab}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View className="flex-col gap-8 px-4">
            {/* About */}
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">About</Text>
              <Text className="text-base leading-relaxed text-gray-600 dark:text-gray-300">
                The cultural capital of Japan, famous for its classical Buddhist temples, as well as gardens, imperial palaces, Shinto shrines and traditional wooden houses.
              </Text>
            </View>

            {/* Location map placeholder */}
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">Location</Text>
              <View className="relative h-48 w-full overflow-hidden rounded-2xl bg-slate-200 shadow-sm">
                {/* Simulated map */}
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={`h${i}`} className="absolute left-0 right-0 h-px bg-slate-300" style={{ top: `${i * 25}%` }} />
                ))}
                {[0, 1, 2, 3, 4].map((i) => (
                  <View key={`v${i}`} className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: `${i * 25}%` }} />
                ))}
                <View className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 items-center">
                  <View className="w-12 h-12 rounded-full bg-primary/20 items-center justify-center">
                    <View className="w-4 h-4 rounded-full bg-primary shadow-lg" />
                  </View>
                  <View className="mt-1 bg-white dark:bg-gray-800 px-2 py-1 rounded-md">
                    <Text className="text-[10px] font-bold dark:text-white">You are here</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Top Guides */}
            <View>
              <View className="flex-row justify-between items-center mb-3">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">Top Guides</Text>
                <Pressable onPress={() => router.push("/trips/guides")}>
                  <Text className="text-sm font-bold text-primary">View All</Text>
                </Pressable>
              </View>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
                {GUIDES.map((guide) => (
                  <Pressable key={guide.name} className="items-center gap-2">
                    <View className={`relative w-16 h-16 rounded-full p-0.5 ${guide.active ? "border-2 border-primary" : ""}`}>
                      <View className={`w-full h-full rounded-full overflow-hidden ${!guide.active ? "opacity-60" : ""}`}>
                        <Image source={{ uri: guide.avatar }} className="w-full h-full" resizeMode="cover" />
                      </View>
                      {guide.active && (
                        <View className="absolute bottom-0 right-0 w-5 h-5 bg-white dark:bg-gray-800 rounded-full items-center justify-center">
                          <Text className="text-xs">⭐</Text>
                        </View>
                      )}
                    </View>
                    <View className="items-center">
                      <Text className="text-sm font-bold text-gray-900 dark:text-white">{guide.name}</Text>
                      <Text className="text-[10px] text-gray-500 dark:text-gray-400">{guide.specialty}</Text>
                    </View>
                  </Pressable>
                ))}
              </ScrollView>
            </View>

            {/* Featured Plans */}
            <View>
              <Text className="text-lg font-bold text-gray-900 dark:text-white mb-3">Featured Plans</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16, paddingBottom: 8 }}>
                {PLANS.map((plan) => (
                  <View key={plan.title} className="w-40 gap-2">
                    <View className="relative rounded-xl overflow-hidden" style={{ aspectRatio: 3 / 4 }}>
                      <Image source={{ uri: plan.image }} className="w-full h-full" resizeMode="cover" />
                      <View className="absolute bottom-2 left-2 bg-black/50 px-1.5 py-0.5 rounded">
                        <Text className="text-[10px] font-bold text-white">{plan.duration}</Text>
                      </View>
                    </View>
                    <View>
                      <Text className="text-sm font-bold text-gray-900 dark:text-white leading-tight">{plan.title}</Text>
                      <Text className="text-xs text-gray-500 dark:text-gray-400">{plan.type}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            </View>

            {/* Rating card */}
            <View className="bg-white dark:bg-gray-800 rounded-2xl p-5 shadow-sm mb-4">
              <View className="flex-row gap-8 flex-wrap">
                <View className="gap-1">
                  <Text className="text-4xl font-black text-gray-900 dark:text-white leading-tight">4.9</Text>
                  <View className="flex-row gap-0.5">
                    {[1,2,3,4].map((i) => (
                      <MaterialIcons key={i} name="star" size={18} color="#359EFF" />
                    ))}
                    <MaterialIcons name="star-half" size={18} color="#359EFF" />
                  </View>
                  <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">2,341 reviews</Text>
                </View>
                <View className="flex-1 gap-2 min-w-[180px]">
                  {[
                    { stars: 5, pct: 80 }, { stars: 4, pct: 15 },
                    { stars: 3, pct: 3 }, { stars: 2, pct: 1 }, { stars: 1, pct: 1 },
                  ].map((row) => (
                    <View key={row.stars} className="flex-row items-center gap-3">
                      <Text className="text-xs font-medium text-gray-900 dark:text-gray-300 w-2">{row.stars}</Text>
                      <View className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <View className="h-full bg-primary rounded-full" style={{ width: `${row.pct}%` }} />
                      </View>
                      <Text className="text-xs font-medium text-primary w-7 text-right">{row.pct}%</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-3 items-center">
                <Pressable>
                  <Text className="text-sm font-bold text-gray-900 dark:text-white">Read all reviews</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Sticky footer */}
      <View
        className="absolute bottom-0 left-0 right-0 flex-row items-center justify-between border-t border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-background-dark/90 px-6 py-4"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View>
          <Text className="text-xs font-medium text-gray-500 dark:text-gray-400">Est. cost</Text>
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            $120<Text className="text-sm font-normal text-gray-500 dark:text-gray-400">/day</Text>
          </Text>
        </View>
        <Pressable
          onPress={() => router.push("/trips/guides")}
          className="flex-row items-center gap-2 bg-primary px-8 py-3 rounded-xl shadow-lg"
          style={{ shadowColor: "#359EFF", shadowOpacity: 0.25 }}
        >
          <Text className="text-white text-base font-bold">Start Plan</Text>
          <MaterialIcons name="arrow-forward" size={20} color="white" />
        </Pressable>
      </View>
    </View>
  );
}
