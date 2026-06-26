import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  TextInput,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router, useLocalSearchParams } from "expo-router";

const MESSAGES = [
  {
    id: "1",
    sender: "Sara (Local Guide)",
    avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuD08lVoan8JB_tWKncwWGbr5BwasPlqL-zEmYJxYLHHdvtNWv2IHqa40dZj4E0X9TPaKTjGhLD_3QKz_EdYkZ8D7C1dbjKAsa77fNynWQ-0OoFL4Btki3iQlR03JUZxwE0BmtCj7i24qAA1NjmxENSrH3uuTaLJ58pErS-0HTCMC4w5rrb7fZerWyRXHr6lwsw1aqsq2t94QHfTt8ds2KINiMOjkIoOOZpe5HvaA6qhhOGp6RF42rRY1fKcQ45JSjRGHpo0Xa9xIy1U",
    text: "Welcome to Giza! I've pinned our meeting point for tomorrow morning near the Great Pyramid entrance.",
    isMe: false,
    time: "9:03 AM",
  },
  {
    id: "2",
    sender: "me",
    text: "That looks incredible! Can't wait to see it in person. Are we meeting at 9 AM?",
    isMe: true,
    time: "9:05 AM",
  },
];

const AVATARS = [
  "https://lh3.googleusercontent.com/aida-public/AB6AXuD08lVoan8JB_tWKncwWGbr5BwasPlqL-zEmYJxYLHHdvtNWv2IHqa40dZj4E0X9TPaKTjGhLD_3QKz_EdYkZ8D7C1dbjKAsa77fNynWQ-0OoFL4Btki3iQlR03JUZxwE0BmtCj7i24qAA1NjmxENSrH3uuTaLJ58pErS-0HTCMC4w5rrb7fZerWyRXHr6lwsw1aqsq2t94QHfTt8ds2KINiMOjkIoOOZpe5HvaA6qhhOGp6RF42rRY1fKcQ45JSjRGHpo0Xa9xIy1U",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuAkJocAf20HCjuiZSuz3f9J1r3rwv8iiKU-WKHORJw2Tpv4a3JUe6itXQWkvhoGDrZhYFD4oBcVlyNc6S5HM2iKZyX-msatDSUPre3Oy26PBPfbc73JFNZDiv18Js9nPuCAJ6qYEC9TRHco5ZBwV9bwxEFbGoo6gNfEhSwI581987RKAJ-RnFNOZY-rfngcbAOUU4Evt6zpEHo4bxwDNgcDgblRQRlLQ1WIXH_8rp2k1beEGqqVvDhtHvzbwZTjRB4-p6skTqLGK87K",
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDTX2f0IZjJA-U3ZzZxAxpXGKSD6Rdxq77Gxc34alwdOlCZAoZkqGjkJpxWP_N72-CHtTUlfdGaAs761kYea17js5oTmEP1W6rOWXxVvmM9W60AQOgyiwXHz712z4m8L7t-zJPbZzzshT4cOf7j0Jbi4CpzJFcFgXif12U2w-vOGd4RWk4Uw08Yqjg--BYnOgsjQ41khH94whferq1ujRENqeiavEQnlU-Vi1FhZOBLzqXx2xvVvuPqL1RzoUkGmQKx6ZEv3R7BgZ2D",
];

export default function GroupChatScreen() {
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [message, setMessage] = useState("");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View className="bg-white/80 dark:bg-background-dark/80 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center p-4 pb-2 justify-between">
          <BackButton iconSize={18} iconName="arrow-back-ios-new" />
          <Text className="text-main-light dark:text-white text-lg font-bold flex-1 text-center">
            Giza Expedition 2024
          </Text>
          <Pressable onPress={() => router.push(`/chat/group/${id}/settings`)} className="w-10 h-10 items-end justify-center">
            <MaterialIcons name="more-vert" size={22} color="#4F4F4F" />
          </Pressable>
        </View>

        {/* Member avatars */}
        <View className="flex-row justify-center pb-3 px-4 gap-2">
          <View className="flex-row" style={{ gap: -12 }}>
            {AVATARS.map((uri, i) => (
              <View key={i} className="w-7 h-7 rounded-full overflow-hidden border-2 border-white dark:border-background-dark">
                <Image source={{ uri }} className="w-full h-full" resizeMode="cover" />
              </View>
            ))}
            <View className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-800 border-2 border-white dark:border-background-dark items-center justify-center">
              <Text className="text-[10px] font-bold text-gray-500">+2</Text>
            </View>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView className="flex-1 p-4" showsVerticalScrollIndicator={false}>
        {/* Date stamp */}
        <View className="flex-row justify-center my-4">
          <View className="bg-gray-100 dark:bg-gray-800 px-4 py-1 rounded-full">
            <Text className="text-gray-custom text-[11px] font-semibold uppercase tracking-wide">Today</Text>
          </View>
        </View>

        {MESSAGES.map((msg) =>
          msg.isMe ? (
            <View key={msg.id} className="flex-row items-end justify-end gap-3 mb-4">
              <View className="max-w-[85%] flex-col items-end gap-1">
                <View className="px-4 py-3 bg-primary rounded-xl rounded-br-none shadow-sm">
                  <Text className="text-white text-[15px] font-normal leading-relaxed">{msg.text}</Text>
                </View>
              </View>
            </View>
          ) : (
            <View key={msg.id} className="flex-row items-end gap-3 mb-4">
              <View className="w-9 h-9 rounded-full overflow-hidden border-2 border-primary flex-shrink-0">
                <Image source={{ uri: msg.avatar }} className="w-full h-full" resizeMode="cover" />
              </View>
              <View className="flex-1 flex-col gap-1 items-start">
                <Text className="text-primary text-[12px] font-bold">{msg.sender}</Text>
                <View className="max-w-[85%] px-4 py-3 bg-white dark:bg-gray-800 rounded-xl rounded-bl-none shadow-sm">
                  <Text className="text-main-light dark:text-white text-[15px] font-normal leading-relaxed">{msg.text}</Text>
                </View>
              </View>
            </View>
          )
        )}
      </ScrollView>

      {/* Input */}
      <View
        className="p-4 bg-white dark:bg-background-dark border-t border-gray-100 dark:border-gray-800"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center gap-3">
          <Pressable className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
            <MaterialIcons name="add" size={22} color={isDark ? "#E2E8F0" : "#0F172A"} />
          </Pressable>
          <View className="flex-1 relative flex-row items-center">
            <TextInput
              value={message}
              onChangeText={setMessage}
              placeholder="Type a message..."
              placeholderTextColor="#9ca3af"
              className="flex-1 h-11 bg-gray-100 dark:bg-gray-800 rounded-full px-5 text-[15px] text-main-light dark:text-white"
            />
            <Pressable className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 items-center justify-center">
              <MaterialIcons name="mood" size={22} color="#359EFF" />
            </Pressable>
          </View>
          <Pressable className="w-11 h-11 rounded-full bg-primary items-center justify-center shadow-lg">
            <MaterialIcons name="send" size={20} color="white" />
          </Pressable>
        </View>
      </View>
    </View>
  );
}
