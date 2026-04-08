import React from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";

interface PrimaryButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
}

export default React.memo(function PrimaryButton({
  title,
  onPress,
  isLoading = false,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={isLoading}
      accessibilityRole="button"
      accessibilityLabel={title}
    >
      {({ pressed }) => (
        <View
          className={`flex h-16 w-full items-center justify-center rounded-xl ${
            isLoading
              ? "bg-primary-dark opacity-80"
              : pressed
              ? "bg-primary-dark"
              : "bg-primary"
          }`}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="text-base font-semibold text-white font-display">
              {title}
            </Text>
          )}
        </View>
      )}
    </Pressable>
  );
});