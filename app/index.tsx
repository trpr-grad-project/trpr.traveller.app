import { useAuth } from "@/context/AuthContext";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, Text, View } from "react-native";

export default function Index() {
  const { signOut } = useAuth();

  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-neutral-dark">
      <View className="items-center gap-4">
        <MaterialIcons name="check-circle" size={80} color="#359EFF" />
        <Text className="mt-4 text-3xl font-bold text-gray-800 dark:text-white font-display">
          Welcome!
        </Text>
        <Text className="mb-8 text-base text-gray-600 dark:text-gray-400 font-display">
          You are successfully logged in
        </Text>

        <Pressable
          style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}
          className="flex-row items-center gap-2 rounded-xl bg-primary px-6 py-3"
          onPress={signOut}
        >
          <MaterialIcons name="logout" size={24} color="white" />
          <Text className="text-base font-semibold text-white font-display">Logout</Text>
        </Pressable>
      </View>
    </View>
  );
}
