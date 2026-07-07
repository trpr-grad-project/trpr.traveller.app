import { Pressable, Text, View } from "react-native";
import { router } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useTripHubStore } from "@/store/tripHubStore";

export default function TripsTodayFAB() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const tripsToday = useTripHubStore((s) => s.tripsToday);

  if (tripsToday.length === 0) return null;

  return (
    <View
      className="absolute bottom-4 left-0 right-0 items-end px-4"
      style={{ zIndex: 100, pointerEvents: "box-none" }}
    >
      <Pressable
        onPress={() => router.push("/trips-today")}
        className="flex-row items-center gap-2 px-5 py-3 rounded-full active:opacity-80"
        style={{
          backgroundColor: isDark ? "#1e3a5f" : "#359EFF",
          shadowColor: "#359EFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 6,
        }}
      >
        <MaterialIcons name="today" size={20} color="white" />
        <Text className="text-white font-bold text-sm tracking-wide flex-nowrap">
          {tripsToday.length} {tripsToday.length === 1 ? "Trip" : "Trips"} Today{'\u200B'}
        </Text>
        <View
          className="w-6 h-6 rounded-full items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <Text className="text-white text-xs font-bold">
            {tripsToday.length}
          </Text>
        </View>
      </Pressable>
    </View>
  );
}
