import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "nativewind";
import { Pressable } from "react-native";

type BackButtonProps = {
  onPress?: () => void;
  className?: string;
  iconSize?: number;
  iconName?: keyof typeof MaterialIcons.glyphMap;
};

export default function BackButton({
  onPress,
  className,
  iconSize = 24,
  iconName = "arrow-back-ios",
}: BackButtonProps) {
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
      className={`shrink-0 items-center justify-center rounded-full active:opacity-60 min-w-[44px] min-h-[44px] ${className ?? ""}`}
      accessibilityRole="button"
      accessibilityLabel="Go back"
      android_ripple={{ color: "rgba(0,0,0,0.1)", borderless: true }}
    >
      <MaterialIcons
        name={iconName}
        size={iconSize}
        color={isDark ? "#E2E8F0" : "#0F172A"}
      />
    </Pressable>
  );
}
