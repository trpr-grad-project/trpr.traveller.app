import React, { useRef } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export default React.memo(function PrimaryButton({
  title,
  onPress,
  isLoading = false,
  disabled = false,
  className = "",
}: PrimaryButtonProps) {
  const lastPress = useRef(0);

  const handlePress = () => {
    const now = Date.now();
    if (now - lastPress.current < 500) return;
    lastPress.current = now;
    onPress();
  };

  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
      android_ripple={{ color: "rgba(0,0,0,0.12)" }}
    >
      {({ pressed }) => (
        <View
           className={`flex h-14 w-full items-center justify-center rounded-xl ${
             disabled || isLoading
               ? "bg-primary-dark opacity-50"
               : pressed
               ? "bg-primary-dark"
               : "bg-primary"
           } ${className}`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-semibold text-white">
              {title}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
});