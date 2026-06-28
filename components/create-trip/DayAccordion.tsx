import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  LayoutAnimation,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface DayAccordionProps {
  dayCount: number;
  days: { duration: number; placeIds: number[] }[];
  onDurationChange: (dayIndex: number, hours: number) => void;
  onRemovePlace: (dayIndex: number, placeId: number) => void;
  onAddPlace: (dayIndex: number) => void;
}

export default function DayAccordion({
  dayCount,
  days,
  onDurationChange,
  onRemovePlace,
  onAddPlace,
}: DayAccordionProps) {
  const [expandedIndex, setExpandedIndex] = useState(0);

  const toggle = (idx: number) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedIndex(expandedIndex === idx ? -1 : idx);
  };

  const dayLabels = [
    "First",
    "Second",
    "Third",
    "Fourth",
    "Fifth",
    "Sixth",
    "Seventh",
    "Eighth",
    "Ninth",
    "Tenth",
  ];

  return (
    <View className="rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-700">
      {Array.from({ length: dayCount }, (_, i) => {
        const isExpanded = expandedIndex === i;
        const day = days[i] ?? { duration: 12, placeIds: [] };
        const label = dayLabels[i] ?? `Day ${i + 1}`;

        return (
          <View
            key={i}
            className="border-b border-slate-100 dark:border-slate-700 last:border-b-0"
          >
            <Pressable
              onPress={() => toggle(i)}
              className="flex-row items-center px-4 py-4 bg-white dark:bg-slate-800 active:bg-slate-50 dark:active:bg-slate-700"
            >
              <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center mr-3">
                <Text className="text-xs font-bold text-primary">{i + 1}</Text>
              </View>
              <Text className="flex-1 text-sm font-bold text-[#0c141d] dark:text-white">
                {label} Day
              </Text>
              <Text className="text-xs text-slate-500 mr-2">
                {day.placeIds.length} places
              </Text>
              <MaterialIcons
                name={isExpanded ? "expand-less" : "expand-more"}
                size={20}
                color="#94a3b8"
              />
            </Pressable>

            {isExpanded && (
              <View className="px-4 pb-4 bg-white dark:bg-slate-800">
                <View className="mb-3">
                  <Text className="text-xs font-semibold text-slate-500 mb-1">
                    Hours planned
                  </Text>
                  <View className="flex-row items-center">
                    <TextInput
                      value={String(day.duration)}
                      onChangeText={(t) => {
                        const h = parseInt(t, 10);
                        if (!isNaN(h) && h > 0) onDurationChange(i, h);
                      }}
                      keyboardType="number-pad"
                      className="w-20 h-10 bg-slate-50 dark:bg-slate-900 rounded-xl px-3 text-sm font-medium text-[#0c141d] dark:text-white"
                    />
                    <Text className="ml-2 text-sm text-slate-500">hours</Text>
                  </View>
                </View>

                <View>
                  <Text className="text-xs font-semibold text-slate-500 mb-2">
                    Places
                  </Text>
                  {day.placeIds.length === 0 && (
                    <Text className="text-xs text-slate-400 italic mb-2">
                      No places added yet
                    </Text>
                  )}
                  {day.placeIds.map((placeId) => (
                    <View
                      key={placeId}
                      className="flex-row items-center bg-slate-50 dark:bg-slate-900 rounded-xl px-3 py-2.5 mb-1"
                    >
                      <MaterialIcons
                        name="place"
                        size={16}
                        color="#359EFF"
                      />
                      <Text className="flex-1 text-xs font-medium text-[#0c141d] dark:text-white ml-2">
                        Place #{placeId}
                      </Text>
                      <Pressable
                        onPress={() => onRemovePlace(i, placeId)}
                        hitSlop={8}
                      >
                        <MaterialIcons
                          name="close"
                          size={16}
                          color="#94a3b8"
                        />
                      </Pressable>
                    </View>
                  ))}
                  <Pressable
                    onPress={() => onAddPlace(i)}
                    className="flex-row items-center justify-center h-10 rounded-xl border border-dashed border-primary/30 mt-2"
                  >
                    <MaterialIcons name="add" size={18} color="#359EFF" />
                    <Text className="text-xs font-bold text-primary ml-1">
                      Add Place
                    </Text>
                  </Pressable>
                </View>
              </View>
            )}
          </View>
        );
      })}
    </View>
  );
}
