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
import { toastConfig } from "@/config/toast.config";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, isLoading, profileSetupCompleted } = useAuth();
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
  const inOnboardingGroup = segments[0] === "(onboarding)";

  // Not logged in → send to login
  if (!session && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  // Logged in but on an auth screen → redirect away
  if (session && inAuthGroup) {
    if (profileSetupCompleted === false) {
      return <Redirect href="/(onboarding)/welcome" />;
    }
    return <Redirect href="/" />;
  }

  // Logged in, profile incomplete → keep inside onboarding
  if (session && profileSetupCompleted === false && !inOnboardingGroup) {
    return <Redirect href="/(onboarding)/welcome" />;
  }

  // Logged in, profile complete → don't let them linger in onboarding
  if (session && profileSetupCompleted === true && inOnboardingGroup) {
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
