import "@/global.css";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Redirect, Stack, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import Toast from "react-native-toast-message";
import { toastConfig } from "@/utils/toastConfig";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, isLoading } = useAuth();
  const segments = useSegments();

  // Hide splash screen when fonts are loaded and authentication is complete
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  if (!fontsLoaded || isLoading) {
    return null;
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (!session && !inAuthGroup) {
    // Redirect to the login page if not authenticated
    return <Redirect href="/(auth)/login" />;
  }

  if (session && inAuthGroup) {
    // Redirect to the home page if authenticated
    return <Redirect href="/" />;
  }

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function RootLayoutNav() {
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
  });

  return (
    <>
      <AuthProvider>
        <RootLayoutContent fontsLoaded={fontsLoaded} />
      </AuthProvider>
      <Toast config={toastConfig} />
    </>
  );
}
