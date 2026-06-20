import { saveColorScheme } from "@/utils/storage";
import { MaterialIcons } from "@expo/vector-icons";
import React from "react";
import { Appearance, Pressable, useColorScheme } from "react-native";

export default function DarkModeToggle() {
  const colorScheme = useColorScheme();

  return (
    <Pressable
      onPress={() => {
        const next = colorScheme === "dark" ? "light" : "dark";
        Appearance.setColorScheme(next);
        saveColorScheme(next);
      }}
      className={`h-10 w-10 items-center justify-center rounded-full border active:opacity-70 ${
        colorScheme === "dark"
          ? "border-neutral-700 bg-neutral-800"
          : "border-gray-200 bg-white"
      }`}
    >
      <MaterialIcons
        name={colorScheme === "dark" ? "light-mode" : "dark-mode"}
        size={20}
        color={colorScheme === "dark" ? "#FDB813" : "#4F4F4F"}
      />
    </Pressable>
  );
}
