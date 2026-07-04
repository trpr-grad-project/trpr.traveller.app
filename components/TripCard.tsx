import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";

export const SOFT_SHADOW = {
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.05,
  shadowRadius: 20,
  elevation: 2,
};

type BadgeVariant = "company" | "group";

type TripCardProps = {
  image: string;
  title: string;
  info: string;
  rating: string;
  badgeLabel: string;
  badgeVariant?: BadgeVariant;
  onPress?: () => void;
  price?: string;
};

export default function TripCard({
  image,
  title,
  info,
  rating,
  badgeLabel,
  badgeVariant = "company",
  onPress,
  price,
}: TripCardProps) {
  const isGroup = badgeVariant === "group";

  return (
    <Pressable
      onPress={onPress}
      style={[SOFT_SHADOW, { width: 280, borderRadius: 12 }]}
    >
      <View className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden border border-slate-50 dark:border-slate-800">
        <View className="relative w-full" style={{ width: "100%", aspectRatio: 4 / 3 }}>
          <Image
            source={{ uri: image }}
            style={{ width: "100%", height: "100%" }}
            resizeMode="cover"
          />
          <View
            className={`absolute top-3 left-3 bg-white/95 dark:bg-black/80 px-2.5 py-1 rounded-full border ${
              isGroup ? "border-emerald-600/20" : "border-primary/20"
            }`}
          >
            <Text
              className={`text-[10px] font-bold tracking-wide ${
                isGroup ? "text-emerald-600 uppercase" : "text-primary"
              }`}
            >
              {badgeLabel}
            </Text>
          </View>
          <View className="absolute top-3 right-3 bg-white/90 dark:bg-black/50 px-2 py-1 rounded-lg flex-row items-center gap-1">
            <MaterialIcons name="star" size={14} color="#eab308" />
            <Text className="text-xs font-bold text-[#0c141d] dark:text-slate-100">
              {rating}
            </Text>
          </View>
        </View>
        <View className="p-3">
          <Text className="text-[#0c141d] dark:text-white text-base font-bold">
            {title}
          </Text>
          <Text className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {info}
          </Text>
          {price && (
            <Text className="text-primary font-bold text-sm mt-1">
              {price}
            </Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}
