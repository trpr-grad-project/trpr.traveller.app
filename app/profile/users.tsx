import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

import BackButton from "@/components/BackButton";
import { useAuth } from "@/context/AuthContext";
import { usersService } from "@/services";
import { User } from "@/types";

export default function UsersScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await usersService.getAll();
        setUsers(data.filter((u) => u.id !== currentUser?.id));
      } catch (e) {
        setError(e instanceof Error ? e.message : "Failed to load users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentUser?.id]);

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const renderUser = ({ item }: { item: User }) => (
    <Pressable
      onPress={() =>
        router.push(
          `/chat/${item.id}?name=${encodeURIComponent(`${item.firstName} ${item.lastName}`)}&email=${encodeURIComponent(item.email)}`,
        )
      }
      className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800 active:opacity-70"
    >
      <View className="w-14 h-14 rounded-full bg-primary/10 items-center justify-center">
        <Text className="text-lg font-bold text-primary">
          {getInitials(item.firstName, item.lastName)}
        </Text>
      </View>
      <View className="flex-1 ml-4">
        <Text className="font-bold text-[#0c141d] dark:text-white text-base">
          {item.firstName} {item.lastName}
        </Text>
        <Text className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
          {item.email}
        </Text>
      </View>
      <MaterialIcons name="chat-bubble-outline" size={20} color="#94a3b8" />
    </Pressable>
  );

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle={isDark ? "light-content" : "dark-content"}
      />

      <View className="flex-row items-center px-4 py-3 border-b border-slate-200 dark:border-slate-800">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="text-lg font-bold text-[#0c141d] dark:text-white ml-2">
          All Users
        </Text>
      </View>

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#359EFF" />
          <Text className="mt-3 text-sm text-slate-500">Loading users...</Text>
        </View>
      ) : error ? (
        <View className="flex-1 items-center justify-center px-6">
          <MaterialIcons name="error-outline" size={48} color="#ef4444" />
          <Text className="mt-3 text-base font-semibold text-slate-700 dark:text-slate-200 text-center">
            {error}
          </Text>
          <Pressable
            onPress={() => router.back()}
            className="mt-4 px-6 py-2 bg-primary rounded-full"
          >
            <Text className="text-white font-semibold">Go Back</Text>
          </Pressable>
        </View>
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item) => item.id}
          renderItem={renderUser}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="flex-1 items-center justify-center pt-20">
              <MaterialIcons name="people-outline" size={48} color="#94a3b8" />
              <Text className="mt-3 text-sm text-slate-500">
                No users found
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}
