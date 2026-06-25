import React, { useState } from "react";
import {
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

export default function PersonalInformationScreen() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Alex Traveller");
  const [email, setEmail] = useState("alex.traveller@example.com");
  const [phone, setPhone] = useState("+1 (555) 123-4567");
  const [dob, setDob] = useState("1994-03-15");

  const FIELDS = [
    { label: "Full Name", value: name, onChange: setName, icon: "person" as const },
    { label: "Email", value: email, onChange: setEmail, icon: "mail" as const },
    { label: "Phone Number", value: phone, onChange: setPhone, icon: "phone" as const },
    { label: "Date of Birth", value: dob, onChange: setDob, icon: "calendar-today" as const },
  ];

  return (
    <View className="flex-1 bg-background-light dark:bg-background-dark" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      {/* Header */}
      <View className="flex-row items-center px-4 py-3">
        <Pressable onPress={() => router.back()} className="w-10 h-10 rounded-full items-center justify-center">
          <MaterialIcons name="arrow-back-ios-new" size={18} color="#0d1b1b" />
        </Pressable>
        <Text className="text-lg font-bold text-[#0d1b1b] dark:text-white ml-2">Personal Information</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        {/* Profile Photo */}
        <View className="items-center py-8">
          <View className="relative">
            <View className="w-28 h-28 rounded-full overflow-hidden border-4 border-white dark:border-neutral-dark shadow-lg">
              <View className="flex-1 bg-primary/20 items-center justify-center">
                <Text className="text-3xl font-bold text-primary">AT</Text>
              </View>
            </View>
            <Pressable className="absolute bottom-1 right-1 bg-primary w-9 h-9 rounded-full items-center justify-center shadow-md">
              <MaterialIcons name="photo-camera" size={18} color="white" />
            </Pressable>
          </View>
          <Pressable>
            <Text className="text-primary font-semibold text-sm mt-3">Change Photo</Text>
          </Pressable>
        </View>

        {/* Form Fields */}
        <View className="mx-4 bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark overflow-hidden shadow-sm mb-4">
          {FIELDS.map((field, i, arr) => (
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

        {/* Save Button */}
        <View className="mx-4 mb-8">
          <Pressable className="w-full h-14 bg-primary rounded-xl items-center justify-center">
            <Text className="text-white font-bold text-base">Save Changes</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}
