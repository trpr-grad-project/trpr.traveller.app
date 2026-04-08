import React from "react";
import { Slot, usePathname } from "expo-router";
import { useColorScheme } from "nativewind";
import { StatusBar, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import AuthHeader from "@/components/auth/AuthHeader";
import AuthFooter from "@/components/auth/AuthFooter";

export default function AuthLayout() {
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const isAuthForm =
    pathname.endsWith("/login") || pathname.endsWith("/register");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark">
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />
      {!isAuthForm ? (
        // Non-form auth screens render without shared layout
        <Slot />
      ) : (
        <>
          <AuthHeader />

          {/* Only form section scrolls + moves with keyboard */}
          <KeyboardAwareScrollView
            enableOnAndroid
            extraScrollHeight={20}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: insets.bottom + 20,
              flexGrow: 1,
            }}
          >
            <View className="flex flex-col px-6 pt-2">
              <Slot />
              <AuthFooter />
            </View>
          </KeyboardAwareScrollView>
        </>
      )}
    </View>
  );
}
