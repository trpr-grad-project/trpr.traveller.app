import React from "react";
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

const WEEKEND_PLANS = [
  {
    id: "1",
    title: "Paris Bakery Tour",
    info: "3 Days • Cultural • Nov 14",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBESOiTTzA6Ih5VtferSnB1vV9Xpx8MSxeOvUBkCTnMZ2t5Wb_uy0tVOQghEWh9jkuijm1p7FfbRtV_5E0b-qvuCuZBlAajEPUqKTrWV86grduqPKCo0Xdj4LJkOABUNYC1QCQ26sYnTpNctZ17rmkW3s-TeIaNpFutemYHAH3f6WGRRIofOIkzVB2zHMsVfag_RfJCx64LYjvtNfJTNoHt2wsmrotghZiIp1XS8-SIYmOlbg_gLHuZDifI61BCiGS2_BbuxiMy0fIi",
  },
  {
    id: "2",
    title: "Kyoto Temple Walk",
    info: "5 Days • Historical • Dec 02",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuBFJA_ikOUuhCFPPFljI2WOlaI19HclBzh8wJQcDvyZ5GqVY3t9154YESPMwdVwvwhhJJRLA2OnNrQnx6TGMAPkl5i155pe7CeY8xm_Eoc7JGf0_sZLPazx7s5FSUsySboQo12xOBAkJsk75PLe-5L3y6W6cMxeLTOKPyjKTW4Jpi4BSIpQvJAZKkQghBHcmoYBrFxRGycTNFcOCaCOHRrhLwqqj19AKIFNcGaj2ow1WN0yQOgbp2S9_BVoa09SmrttWrDOZk7FV6U0",
  },
];

export default function TravelerHome() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-white dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <View className="flex-row items-center gap-3">
          {/* Avatar */}
          <View className="relative">
            <View className="w-10 h-10 rounded-full overflow-hidden border-2 border-primary/20">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7B_ubau9QraQCtQAHSEmUEoYkWtQnmu7lmJSQMp_TRC5pwzjDvY7FRH0WKoyWvq7RPqpiHat_dOw8s7fLdBg4_Pv5yQs68x-FUlfFpNqab5-zWKUvlcvU5p1OV0MZWtqyhBXpPwM6fnPTIg5b3F25pPJMtuhZoAe5rvkiI3hxwqItYt4m8xo7lWTRVrHsId61x71qyWxJrJS2SzvG7nqccyTehv1lgTW4a-Nw9eonniI7MSsdvKRNkNrWoerSD0gcikLO1_wAyUw" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <View className="absolute bottom-0 right-0 w-3 h-3 bg-primary rounded-full border-2 border-white dark:border-background-dark" />
          </View>
          <View>
            <Text className="text-slate-900 dark:text-white text-lg font-bold leading-tight">Good morning, Alex</Text>
            <Text className="text-slate-500 dark:text-slate-400 text-xs font-medium">Ready for your next adventure?</Text>
          </View>
        </View>
        <View className="flex-row gap-2">
          <Pressable className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
            <MaterialIcons name="search" size={22} color="#0f172a" />
          </Pressable>
          <Pressable className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
            <MaterialIcons name="notifications" size={22} color="#0f172a" />
          </Pressable>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
        {/* Active Trip Hero */}
        <View className="px-4 mb-6">
          <View className="flex-row justify-between items-end px-1 mb-3">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Current Trip</Text>
            <Pressable onPress={() => router.push("/trips/1")}>
              <Text className="text-primary text-sm font-bold">See Details →</Text>
            </Pressable>
          </View>

          <View className="rounded-2xl overflow-hidden shadow-lg">
            <View className="relative" style={{ aspectRatio: 4 / 3 }}>
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuC48GdCWM63ydkd4g2zIjVXbDFUSva7KHtej776OgXwZydES5sctGcxJpIgFmI4q5zpXf-Frlkcif7SKBglOV2ERcDM4uB-VNzBaUX3wxp_vedEQ3p1c_2vNMhum2B52Ae128ZtZAaCTKgrMTDPRHy-7A7_HR31eP5XLfAO8awGOMJQ6t8ESEmqwZXBlaJP7zXKwbTNxP3cCOXsYRQQGV1wRAbIITPFrwLTqJHJUpPvVahgDJQa0U9OMhOwSA26DxXWXGTd2Q59i8Xt" }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Dark overlay */}
              <View className="absolute inset-0 bg-slate-900/60" />

              {/* Status badge */}
              <View className="absolute top-4 left-4 flex-row items-center gap-2 bg-white/90 px-3 py-1 rounded-full">
                <View className="w-2 h-2 rounded-full bg-primary" />
                <Text className="text-xs font-bold text-slate-900 uppercase tracking-wider">Ongoing</Text>
              </View>

              {/* Map button */}
              <Pressable className="absolute top-4 right-4 bg-white/90 p-2 rounded-full">
                <MaterialIcons name="map" size={20} color="#0f172a" />
              </Pressable>

              {/* Content overlay */}
              <View className="absolute bottom-0 left-0 right-0 p-5">
                <Text className="text-white text-2xl font-bold leading-tight mb-1">
                  Tokyo Tech & Tradition
                </Text>
                <View className="flex-row items-center gap-1 mb-4">
                  <MaterialIcons name="calendar-month" size={14} color="#cbd5e1" />
                  <Text className="text-slate-200 text-sm font-medium">Oct 12 - Oct 20 • Foodie Tour</Text>
                </View>

                {/* Progress bar */}
                <View className="gap-2 mb-4">
                  <View className="flex-row justify-between">
                    <Text className="text-slate-300 text-xs font-medium">Trip Progress</Text>
                    <Text className="text-slate-300 text-xs font-medium">Day 4 of 9</Text>
                  </View>
                  <View className="h-1.5 bg-white/20 rounded-full overflow-hidden">
                    <View className="h-full bg-primary rounded-full" style={{ width: "45%" }} />
                  </View>
                </View>

                {/* Action grid */}
                <View className="flex-row gap-3">
                  <Pressable className="flex-1 flex-row items-center justify-center gap-2 h-10 px-4 rounded-lg bg-primary">
                    <MaterialIcons name="assistant-navigation" size={18} color="white" />
                    <Text className="text-white text-sm font-bold">View Route</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push("/chat/ai")}
                    className="flex-1 flex-row items-center justify-center gap-2 h-10 px-4 rounded-lg bg-white/10 border border-white/20"
                  >
                    <MaterialIcons name="auto-awesome" size={18} color="white" />
                    <Text className="text-white text-sm font-bold">Ask AI</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Guide request widget */}
        <View className="mx-4 mb-6 rounded-xl p-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <View className="flex-row items-start gap-4">
            <View className="relative">
              <View className="w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-slate-700 shadow-md">
                <Image
                  source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuCrHEdUPGTX39r1gsrCUYc2oCbiBFmYi-8gk0BBisi8QztMlqzvQ8rFdmWFvfWcvlZF-WAdJ26MuGqBydnjZYPXFjCzikSDWtqkusZ2IuKmLl4IXTCEAbl3WcXb9Dfuosli3Bv7C0VmIlxzOQ6ZZIujp6mkPKa_CAXlzrPgDY-Im6w0rsCqVGhb87jG21JxpKZKrmtenOsZ0vpwjEpA8hOJIOAOE8RY9RKn8dYQ--V55SMueWaTmom2ZwLJxDAS3JVsSVst30fM_WDG" }}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>
              <View className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800" />
            </View>
            <View className="flex-1">
              <Text className="text-sm font-bold text-slate-900 dark:text-white mb-1">Need a local expert?</Text>
              <Text className="text-xs text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
                Hiroshi is nearby and ready to show you the hidden gems of Shinjuku.
              </Text>
              <Pressable
                onPress={() => router.push("/trips/requestGuide")}
                className="flex-row items-center justify-center gap-2 h-9 px-4 rounded-lg bg-slate-900 dark:bg-white"
              >
                <Text className="text-white dark:text-slate-900 text-xs font-bold">Request Guide</Text>
                <MaterialIcons name="arrow-forward" size={14} color="white" />
              </Pressable>
            </View>
          </View>
        </View>

        {/* Weekend Getaways */}
        <View className="px-4">
          <View className="flex-row justify-between items-center px-1 mb-3">
            <Text className="text-xl font-bold text-slate-900 dark:text-white">Weekend Getaways</Text>
            <Pressable className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 items-center justify-center">
              <MaterialIcons name="add" size={18} color="#64748b" />
            </Pressable>
          </View>

          <View className="gap-4">
            {WEEKEND_PLANS.map((plan) => (
              <View
                key={plan.id}
                className="flex-row bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700/50"
              >
                <View className="w-24 h-24 rounded-lg overflow-hidden bg-gray-100">
                  <Image source={{ uri: plan.image }} className="w-full h-full" resizeMode="cover" />
                </View>
                <View className="flex-1 ml-4 justify-between py-1">
                  <View>
                    <View className="flex-row justify-between items-start">
                      <Text className="font-bold text-slate-900 dark:text-white text-base">{plan.title}</Text>
                      <Pressable>
                        <MaterialIcons name="more-horiz" size={20} color="#94a3b8" />
                      </Pressable>
                    </View>
                    <Text className="text-xs text-slate-500 dark:text-slate-400 mt-1">{plan.info}</Text>
                  </View>
                  <View className="flex-row gap-2 mt-2">
                    <Pressable className="flex-1 flex-row items-center justify-center gap-1 py-1.5 rounded bg-slate-50 dark:bg-slate-700/50">
                      <MaterialIcons name="refresh" size={14} color="#64748b" />
                      <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Regenerate</Text>
                    </Pressable>
                    <Pressable className="flex-1 flex-row items-center justify-center gap-1 py-1.5 rounded bg-slate-50 dark:bg-slate-700/50">
                      <MaterialIcons name="edit" size={14} color="#64748b" />
                      <Text className="text-xs font-semibold text-slate-700 dark:text-slate-200">Edit</Text>
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
