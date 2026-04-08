import React, { useCallback } from "react";
import { Pressable } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

import { AppleIcon } from "./icons/AppleIcon";
import { FacebookIcon } from "./icons/FacebookIcon";
import { GoogleIcon } from "./icons/GoogleIcon";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type Provider = "google" | "apple" | "facebook";

const icons = {
  google: GoogleIcon,
  apple: AppleIcon,
  facebook: FacebookIcon,
};

const providerLabels: Record<Provider, string> = {
  google: "Continue with Google",
  apple: "Continue with Apple",
  facebook: "Continue with Facebook",
};

export default React.memo(function SocialButton({
  provider,
  onPress,
  color,
}: {
  provider: Provider;
  onPress?: () => void;
  color?: string;
}) {
  const scale = useSharedValue(1);
  const Icon = icons[provider];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = useCallback(() => {
    scale.value = withSpring(0.94, {
      damping: 18,
      stiffness: 220,
    });
  }, [scale]);

  const handlePressOut = useCallback(() => {
    scale.value = withSpring(1, {
      damping: 18,
      stiffness: 220,
    });
  }, [scale]);

  return (
    <AnimatedPressable
      style={[{ flex: 1 }, animatedStyle]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      accessibilityRole="button"
      accessibilityLabel={providerLabels[provider]}
      className="
        h-16
        items-center
        justify-center
        rounded-xl
        border
        border-neutral-light
        bg-white
        dark:border-neutral-dark/50
        dark:bg-neutral-dark
      "
    >
      <Icon size={24} color={color} />
    </AnimatedPressable>
  );
});
