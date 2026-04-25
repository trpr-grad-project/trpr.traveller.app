import React from "react";
import { Pressable, StatusBar, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAuth } from "@/context/AuthContext";

export default function CompletionScreen() {
  const insets = useSafeAreaInsets();
  const { completeProfileSetup } = useAuth();

  const handleGoHome = async () => {
    await completeProfileSetup();
    router.replace("/(traveler)");
  };

  return (
    <View className="flex-1 bg-white dark:bg-background-dark">
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      <View className="flex-1 items-center justify-center px-6">
        <View className="max-w-md w-full text-center items-center">
          {/* Illustration */}
          <View className="relative w-full aspect-square items-center justify-center mb-12">
            {/* Background gradient effect */}
            <View className="absolute w-64 h-64 bg-blue-50 dark:bg-blue-900/10 rounded-full opacity-50" />
            
            <View className="relative">
              {/* Main Gift Icon */}
              <View 
                className="w-32 h-32 bg-primary rounded-3xl items-center justify-center shadow-xl shadow-primary/30"
                style={{ transform: [{ rotate: "12deg" }] }}
              >
                <MaterialIcons name="redeem" size={60} color="white" style={{ transform: [{ rotate: "-12deg" }] }} />
              </View>

              {/* Floating Icons */}
              <View 
                className="absolute -top-12 -left-8 w-16 h-16 bg-white dark:bg-neutral-dark rounded-2xl shadow-lg items-center justify-center border border-gray-100 dark:border-gray-800"
                style={{ transform: [{ rotate: "-12deg" }] }}
              >
                <MaterialIcons name="flight" size={30} color="#359EFF" />
              </View>

              <View 
                className="absolute -top-16 right-0 w-20 h-20 bg-white dark:bg-neutral-dark rounded-2xl shadow-lg items-center justify-center border border-gray-100 dark:border-gray-800"
                style={{ transform: [{ rotate: "12deg" }] }}
              >
                <MaterialIcons name="temple-hindu" size={40} color="#359EFF" />
              </View>

              <View 
                className="absolute bottom-0 -right-10 w-16 h-16 bg-white dark:bg-neutral-dark rounded-2xl shadow-lg items-center justify-center border border-gray-100 dark:border-gray-800"
                style={{ transform: [{ rotate: "-6deg" }] }}
              >
                <MaterialIcons name="photo-camera" size={30} color="#359EFF" />
              </View>

              {/* Sparkles */}
              <View className="absolute top-0 right-0">
                <MaterialIcons name="auto-awesome" size={20} color="#fbbf24" />
              </View>
              <View className="absolute bottom-10 -left-10">
                <MaterialIcons name="auto-awesome" size={24} color="#93c5fd" />
              </View>
            </View>
          </View>

          <Text className="text-[#1A1A1A] dark:text-white text-3xl font-bold tracking-tight mb-4">
            You’re all set!
          </Text>
          <Text className="text-[#828282] dark:text-gray-400 text-[17px] leading-relaxed max-w-[280px] text-center">
            Start exploring ancient wonders and plan your perfect trip today.
          </Text>
        </View>
      </View>

      {/* Footer */}
      <View 
        className="p-6 bg-white dark:bg-background-dark"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="max-w-md mx-auto w-full">
          <Pressable
            onPress={handleGoHome}
            className="flex w-full items-center justify-center rounded-2xl h-[56px] bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-[18px] font-semibold">Go to Home</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}
