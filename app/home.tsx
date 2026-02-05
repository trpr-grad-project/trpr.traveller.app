import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

export default function Home() {
  const router = useRouter();
  return (
    <View className="flex-1 items-center justify-center bg-background-light dark:bg-background-dark">
      <View className="items-center p-6">
        <MaterialIcons name="home" size={64} color="#359EFF" />
        <Text className="mt-4 mb-2 text-3xl font-bold text-text-main-light dark:text-text-main-dark font-display">
          Welcome Home
        </Text>
        <Text className="mb-8 text-center text-lg text-gray-custom font-display">
          You have successfully navigated through the UI flow.
        </Text>

        <TouchableOpacity onPress={() => router.push("/")}>
          <Text className="text-lg font-semibold text-primary underline font-display">
            Back to Landing
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
