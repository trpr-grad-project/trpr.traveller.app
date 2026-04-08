import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import React from "react";
import { Pressable } from "react-native";

export default function DarkModeToggle() {
  const { colorScheme, toggleColorScheme } = useColorScheme();

  return (
    <Pressable
      onPress={toggleColorScheme}
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
