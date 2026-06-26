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
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const PARTICIPANTS = [
  { name: "Alex", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuCf7B_ubau9QraQCtQAHSEmUEoYkWtQnmu7lmJSQMp_TRC5pwzjDvY7FRH0WKoyWvq7RPqpiHat_dOw8s7fLdBg4_Pv5yQs68x-FUlfFpNqab5-zWKUvlcvU5p1OV0MZWtqyhBXpPwM6fnPTIg5b3F25pPJMtuhZoAe5rvkiI3hxwqItYt4m8xo7lWTRVrHsId61x71qyWxJrJS2SzvG7nqccyTehv1lgTW4a-Nw9eonniI7MSsdvKRNkNrWoerSD0gcikLO1_wAyUw" },
  { name: "Sara", avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD08lVoan8JB_tWKncwWGbr5BwasPlqL-zEmYJxYLHHdvtNWv2IHqa40dZj4E0X9TPaKTjGhLD_3QKz_EdYkZ8D7C1dbjKAsa77fNynWQ-0OoFL4Btki3iQlR03JUZxwE0BmtCj7i24qAA1NjmxENSrH3uuTaLJ58pErS-0HTCMC4w5rrb7fZerWyRXHr6lwsw1aqsq2t94QHfTt8ds2KINiMOjkIoOOZpe5HvaA6qhhOGp6RF42rRY1fKcQ45JSjRGHpo0Xa9xIy1U" },
];

export default function LiveTripMapGuideView() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-slate-200" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Map background */}
      <View className="absolute inset-0 bg-slate-100">
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <View key={`h${row}`} className="absolute left-0 right-0 h-px bg-slate-300" style={{ top: `${row * 15 + 8}%` }} />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((col) => (
          <View key={`v${col}`} className="absolute top-0 bottom-0 w-px bg-slate-300" style={{ left: `${col * 16 + 4}%` }} />
        ))}
        <View className="absolute bg-green-200/60 rounded-2xl" style={{ top: "30%", left: "15%", width: 100, height: 80 }} />
        <View className="absolute bg-primary/20 h-4 rounded w-[70%]" style={{ top: "45%", left: "15%" }} />

        {/* Guide location pin (prominent) */}
        <View className="absolute items-center" style={{ top: "38%", left: "45%" }}>
          <View className="bg-white px-2 py-1 rounded-lg shadow-md mb-1">
            <Text className="text-[10px] font-bold text-primary">You (Guide)</Text>
          </View>
          <View className="w-14 h-14 bg-primary rounded-full items-center justify-center border-4 border-white shadow-xl">
            <MaterialIcons name="person-pin" size={30} color="white" />
          </View>
        </View>

        {/* Participant pins */}
        {PARTICIPANTS.map((p, i) => (
          <View
            key={p.name}
            className="absolute items-center"
            style={{ top: `${40 + i * 8}%`, left: `${25 + i * 20}%` }}
          >
            <View className="w-10 h-10 rounded-full overflow-hidden border-3 border-white shadow-md">
              <Image source={{ uri: p.avatar }} className="w-full h-full" resizeMode="cover" />
            </View>
          </View>
        ))}

        {/* Route line */}
        <View
          className="absolute bg-primary/40 w-1 rounded"
          style={{ top: "25%", bottom: "40%", left: "48%" }}
        />
      </View>

      {/* Top bar */}
      <View
        className="absolute left-4 right-4 flex-row items-center justify-between"
        style={{ top: insets.top + 16 }}
      >
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <View className="flex-row items-center gap-2 bg-primary px-4 py-2 rounded-full shadow-lg">
          <View className="w-2 h-2 rounded-full bg-white" />
          <Text className="text-white text-sm font-bold">Guide Active</Text>
        </View>
        <Pressable className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="people" size={22} color="#0f172a" />
        </Pressable>
      </View>

      {/* Bottom sheet */}
      <View
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl p-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-lg font-bold text-slate-900">Tokyo Temple Walk</Text>
            <Text className="text-sm text-slate-500">{PARTICIPANTS.length} Participants • 2h left</Text>
          </View>
          <Pressable
            onPress={() => router.push("/chat/group/1")}
            className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full"
          >
            <MaterialIcons name="chat" size={16} color="#359EFF" />
            <Text className="text-primary text-xs font-bold">Group Chat</Text>
          </Pressable>
        </View>

        <View className="flex-row gap-2 mt-2">
          <Pressable className="flex-1 h-12 bg-primary rounded-xl items-center justify-center flex-row gap-2">
            <MaterialIcons name="navigation" size={18} color="white" />
            <Text className="text-white font-bold text-sm">Navigate to Next Spot</Text>
          </Pressable>
          <Pressable className="w-12 h-12 bg-slate-100 rounded-xl items-center justify-center">
            <MaterialIcons name="camera-alt" size={22} color="#64748b" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
