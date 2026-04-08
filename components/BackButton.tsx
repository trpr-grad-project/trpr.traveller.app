import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

type BackButtonProps = {
  onPress?: () => void;
  className?: string;
};

export default function BackButton({ onPress, className }: BackButtonProps) {
  const { colorScheme } = useColorScheme();
  const router = useRouter();
  const isDark = colorScheme === "dark";

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    }
  };

  return (
    <Pressable
      onPress={handlePress}
      className={`flex size-12 shrink-0 items-center justify-center rounded-full active:opacity-60 ${className ?? ""}`}
      accessibilityRole="button"
      accessibilityLabel="Go back"
    >
      <MaterialIcons
        name="arrow-back-ios"
        size={24}
        color={isDark ? "#E2E8F0" : "#0F172A"}
      />
    </Pressable>
  );
}
