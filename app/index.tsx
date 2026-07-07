import { Redirect } from "expo-router";
import { useAuth } from "@/context/AuthContext";
import { ActivityIndicator, View } from "react-native";

export default function Index() {
  const { isLoading, session } = useAuth();

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white dark:bg-background-dark">
        <ActivityIndicator size="large" color="#359EFF" />
      </View>
    );
  }

  if (!session) {
    return <Redirect href="/(auth)" />;
  }

  return <Redirect href="/(traveler)" />;
}
