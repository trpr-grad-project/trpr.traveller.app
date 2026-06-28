import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

interface LocationFilterProps {
  governorateName: string | null;
  isMapSelected: boolean;
  onSelectGovernorate: () => void;
  onSelectMap: () => void;
}

export default function LocationFilter({
  governorateName,
  isMapSelected,
  onSelectGovernorate,
  onSelectMap,
}: LocationFilterProps) {

  return (
    <View>
      <Text className="text-xs font-semibold text-slate-500 mb-2">
        Location Filter
      </Text>

      <View className="flex-row gap-3">
        <Pressable
          onPress={onSelectGovernorate}
          className={`flex-1 flex-row items-center gap-2 h-14 rounded-xl border px-4 ${
            governorateName
              ? "bg-primary/10 border-primary/20"
              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
          }`}
        >
          <MaterialIcons
            name="business"
            size={20}
            color={governorateName ? "#359EFF" : "#94a3b8"}
          />
          <View className="flex-1">
            <Text
              className={`text-xs ${
                governorateName
                  ? "text-primary font-bold"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              Governorate
            </Text>
            <Text
              className={`text-sm font-bold ${
                governorateName
                  ? "text-[#0c141d] dark:text-white"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {governorateName ?? "Select"}
            </Text>
          </View>
        </Pressable>

        <Pressable
          onPress={onSelectMap}
          className={`flex-1 flex-row items-center gap-2 h-14 rounded-xl border px-4 ${
            isMapSelected
              ? "bg-primary/10 border-primary/20"
              : "bg-white dark:bg-slate-800 border-slate-100 dark:border-slate-700"
          }`}
        >
          <MaterialIcons
            name="map"
            size={20}
            color={isMapSelected ? "#359EFF" : "#94a3b8"}
          />
          <View className="flex-1">
            <Text
              className={`text-xs ${
                isMapSelected
                  ? "text-primary font-bold"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              Map Pin
            </Text>
            <Text
              className={`text-sm font-bold ${
                isMapSelected
                  ? "text-[#0c141d] dark:text-white"
                  : "text-slate-400 dark:text-slate-500"
              }`}
            >
              {isMapSelected ? "Pinned" : "Select"}
            </Text>
          </View>
        </Pressable>
      </View>
    </View>
  );
}
