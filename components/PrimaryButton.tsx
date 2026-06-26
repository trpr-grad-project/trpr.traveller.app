import React from "react";
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
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {({ pressed }) => (
        <View
          className={`flex h-14 w-full items-center justify-center rounded-xl ${className} ${
            disabled || isLoading
              ? "bg-primary-dark opacity-50"
              : pressed
              ? "bg-primary-dark"
              : "bg-primary"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-bold text-white">
              {title}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
});