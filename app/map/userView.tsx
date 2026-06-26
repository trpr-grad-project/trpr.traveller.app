import React from "react";
import {
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LiveTripMapUserView() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  return (
    <View className="flex-1 bg-slate-200" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Mock map background */}
      <View className="absolute inset-0 bg-slate-100">
        {/* Simulated street grid */}
        {[0, 1, 2, 3, 4, 5, 6].map((row) => (
          <View
            key={`h${row}`}
            className="absolute left-0 right-0 h-px bg-slate-300"
            style={{ top: `${row * 15 + 8}%` }}
          />
        ))}
        {[0, 1, 2, 3, 4, 5, 6].map((col) => (
          <View
            key={`v${col}`}
            className="absolute top-0 bottom-0 w-px bg-slate-300"
            style={{ left: `${col * 16 + 4}%` }}
          />
        ))}
        {/* Green area */}
        <View className="absolute bg-green-200/60 rounded-2xl" style={{ top: "30%", left: "15%", width: 100, height: 80 }} />
        {/* Blue road */}
        <View className="absolute bg-primary/20 h-4 rounded w-[70%]" style={{ top: "45%", left: "15%" }} />
        {/* Your location pin */}
        <View className="absolute items-center" style={{ top: "40%", left: "40%" }}>
          <View className="w-10 h-10 bg-primary rounded-full items-center justify-center border-4 border-white shadow-xl">
            <MaterialIcons name="person" size={20} color="white" />
          </View>
          <View className="w-3 h-3 bg-primary/40 rounded-full mt-1" />
        </View>
        {/* Guide pin */}
        <View className="absolute items-center" style={{ top: "35%", left: "55%", zIndex: 10 }}>
          <View className="bg-white px-2 py-1 rounded-lg shadow-md mb-1">
            <Text className="text-[10px] font-bold text-slate-900">Guide</Text>
          </View>
          <View className="w-10 h-10 bg-orange-500 rounded-full items-center justify-center border-4 border-white shadow-xl">
            <MaterialIcons name="directions-walk" size={20} color="white" />
          </View>
        </View>
        {/* POI markers */}
        {[
          { top: "25%", left: "25%", icon: "account-balance", color: "#8b5cf6" },
          { top: "60%", left: "65%", icon: "local-cafe", color: "#f97316" },
          { top: "50%", left: "30%", icon: "museum", color: "#0ea5e9" },
        ].map((poi, i) => (
          <View
            key={i}
            className="absolute w-8 h-8 rounded-full bg-white items-center justify-center shadow-md border border-gray-100"
            style={{ top: poi.top as any, left: poi.left as any }}
          >
            <MaterialIcons name={poi.icon as any} size={18} color={poi.color} />
          </View>
        ))}
      </View>

      {/* Floating top controls */}
      <View className="absolute top-4 left-4 right-4 flex-row items-center justify-between" style={{ top: insets.top + 16 }}>
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <View className="flex-row items-center gap-2 bg-white px-4 py-2 rounded-full shadow-lg">
          <View className="w-2 h-2 rounded-full bg-green-500" />
          <Text className="text-sm font-bold text-slate-900">Live Trip</Text>
        </View>
        <Pressable className="w-10 h-10 bg-white rounded-full items-center justify-center shadow-lg">
          <MaterialIcons name="more-vert" size={22} color="#0f172a" />
        </Pressable>
      </View>

      {/* Bottom card */}
      <View
        className="absolute left-0 right-0 bottom-0 bg-white rounded-t-3xl shadow-2xl p-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="w-10 h-1 bg-gray-300 rounded-full self-center mb-4" />

        <View className="flex-row items-center justify-between mb-4">
          <View>
            <Text className="text-lg font-bold text-slate-900">Tokyo Temple Walk</Text>
            <Text className="text-sm text-slate-500">Day 4 of 9 • Ongoing</Text>
          </View>
          <Pressable className="flex-row items-center gap-1 bg-primary/10 px-3 py-1.5 rounded-full">
            <MaterialIcons name="chat" size={16} color="#359EFF" />
            <Text className="text-primary text-xs font-bold">Chat</Text>
          </Pressable>
        </View>

        {/* Guide status */}
        <View className="flex-row items-center gap-3 bg-slate-50 rounded-xl p-3">
          <View className="w-10 h-10 rounded-full bg-orange-100 items-center justify-center">
            <MaterialIcons name="directions-walk" size={22} color="#f97316" />
          </View>
          <View className="flex-1">
            <Text className="font-semibold text-slate-900 text-sm">Your guide Hiroshi</Text>
            <Text className="text-sub-light dark:text-white text-xs">~5 min walk from your location</Text>
          </View>
          <Pressable>
            <MaterialIcons name="phone" size={22} color="#359EFF" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
