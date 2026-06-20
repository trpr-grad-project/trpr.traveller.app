import { Stack } from "expo-router";
import { ProfileFormDataProvider } from "@/context/ProfileFormDataContext";
import { OnboardingSelectionsProvider } from "@/context/OnboardingSelectionsContext";

export default function OnboardingLayout() {
  return (
    <ProfileFormDataProvider>
      <OnboardingSelectionsProvider>
        <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }} />
      </OnboardingSelectionsProvider>
    </ProfileFormDataProvider>
  );
}
