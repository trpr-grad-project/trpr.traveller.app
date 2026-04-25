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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

export default function EditProfileScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Alex Traveller");
  const [email, setEmail] = useState("alex.travels@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [location, setLocation] = useState("San Francisco, CA");
  const [bio, setBio] = useState("Exploring the world, one city at a time. Always looking for the best coffee spots. ☕️✈️");

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center justify-between px-4 py-3 bg-white dark:bg-neutral-dark border-b border-neutral-light dark:border-neutral-dark">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white">Edit Profile</Text>
        <Pressable>
          <Text className="text-primary font-bold text-sm">Save</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Avatar section */}
        <View className="items-center py-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg">
              <Image
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDW1Ny8NfxYlL2K2CAa03QmHEEhygawzlgk7zIY9l3hPUOYdk48MDEjEC4F3cT6xP9z_SwqoscM9EMw-QuvceAiSJ4UQZhf0XrzZMYG6QPZu8S0wiUosX9XOSKXmKv6VQPTkaopqyz-GGGi26uS6DjMK1Tz03RJwwMsyn51jsSBWaNg3SBel8agXN9jh4O1iy0RfJNeR2TiiD5dbZ6xBTkqUu28DcRZ-TbWsRZ7RLAK9fcPCjAkRUTeuVjTZc130tXWb7cuEnrfEFHK" }}
                className="w-full h-full"
                resizeMode="cover"
              />
            </View>
            <Pressable className="absolute bottom-1 right-1 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-md">
              <MaterialIcons name="photo-camera" size={18} color="white" />
            </Pressable>
          </View>
          <Pressable>
            <Text className="text-primary font-semibold text-sm mt-3">Change Photo</Text>
          </Pressable>
        </View>

        {/* Form fields */}
        <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
          {[
            { label: "Full Name", value: name, onChange: setName, icon: "person" as const },
            { label: "Email", value: email, onChange: setEmail, icon: "mail" as const },
            { label: "Phone", value: phone, onChange: setPhone, icon: "phone" as const },
            { label: "Location", value: location, onChange: setLocation, icon: "location-on" as const },
          ].map((field, i, arr) => (
            <View
              key={field.label}
              className={`flex-row items-center px-4 py-4 gap-3 ${
                i !== arr.length - 1 ? "border-b border-neutral-light dark:border-neutral-dark" : ""
              }`}
            >
              <View className="w-9 h-9 rounded-full bg-background-light dark:bg-background-dark items-center justify-center">
                <MaterialIcons name={field.icon} size={18} color="#4c9a9a" />
              </View>
              <View className="flex-1">
                <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-0.5">{field.label}</Text>
                <TextInput
                  value={field.value}
                  onChangeText={field.onChange}
                  className="text-sm font-medium text-[#0d1b1b] dark:text-white p-0"
                />
              </View>
              <MaterialIcons name="edit" size={16} color="#4c9a9a" />
            </View>
          ))}
        </View>

        {/* Bio section */}
        <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark shadow-sm p-4 mb-4">
          <Text className="text-[10px] font-semibold text-[#4c9a9a] uppercase tracking-wider mb-2">Bio</Text>
          <TextInput
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
            className="text-sm text-[#0d1b1b] dark:text-white leading-relaxed"
            style={{ minHeight: 72 }}
          />
        </View>
      </ScrollView>

      {/* Save button */}
      <View className="px-4" style={{ paddingBottom: insets.bottom + 16 }}>
        <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
          <Text className="text-white font-bold text-base">Save Changes</Text>
        </Pressable>
      </View>
    </View>
  );
}
