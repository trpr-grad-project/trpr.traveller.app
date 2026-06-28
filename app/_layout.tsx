import QueryProvider from "@/app/query-provider";
import { toastConfig } from "@/config/toast.config";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import "@/global.css";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";
import { Stack, useSegments, useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Toast from "react-native-toast-message";

SplashScreen.preventAutoHideAsync();

function RootLayoutContent({ fontsLoaded }: { fontsLoaded: boolean }) {
  const { session, isLoading, profileSetupCompleted } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  // Hide splash screen when fonts are loaded and authentication is complete
  useEffect(() => {
    if (fontsLoaded && !isLoading) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  // Handle routing redirects
  useEffect(() => {
    if (!fontsLoaded || isLoading) {
      return;
    }

    const inAuthGroup = segments[0] === "(auth)";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inLegalGroup = segments[0] === "legal";

    // Not logged in -> redirect to login
    if (!session && !inAuthGroup && !inLegalGroup) {
      router.replace("/(auth)");
      return;
    }

    // Logged in but on an auth screen -> redirect away
    if (session && inAuthGroup) {
      if (profileSetupCompleted === false) {
        router.replace("/(onboarding)/welcome");
      } else {
        router.replace("/(traveler)");
      }
      return;
    }

    // Logged in, profile incomplete -> keep inside onboarding
    if (session && profileSetupCompleted === false && !inOnboardingGroup) {
      router.replace("/(onboarding)/welcome");
      return;
    }

    // Logged in, profile complete -> redirect to home
    if (session && profileSetupCompleted === true && inOnboardingGroup) {
      router.replace("/(traveler)");
      return;
    }
  }, [session, isLoading, profileSetupCompleted, segments, fontsLoaded, router]);

  if (!fontsLoaded || isLoading) {
    return null;
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
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <QueryProvider>
          <RootLayoutContent fontsLoaded={fontsLoaded} />
        </QueryProvider>
      </AuthProvider>
      <Toast config={toastConfig} />
    </GestureHandlerRootView>
  );
}
