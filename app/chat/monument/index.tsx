import React, { useState, useRef } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";
import { useColorScheme } from "nativewind";
import * as ImagePicker from "expo-image-picker";
import BackButton from "@/components/BackButton";
import { monumentService } from "@/services/monument";

function FormattedText({ text }: { text: string }) {
  const normalized = text.replace(/\\n/g, "\n");
  return (
    <Text className="text-sm leading-relaxed text-slate-700 dark:text-slate-300">
      {normalized.split("\n").map((line, i) => (
        <Text key={i}>
          {i > 0 && <Text>{"\n"}</Text>}
          {line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
            if (part.startsWith("**") && part.endsWith("**")) {
              return (
                <Text key={j} className="font-bold">
                  {part.slice(2, -2)}
                </Text>
              );
            }
            return part;
          })}
        </Text>
      ))}
    </Text>
  );
}

function generateSessionId(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

export default function MonumentScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const sessionId = useRef(generateSessionId());

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [responseText, setResponseText] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handlePick = async (useCamera: boolean) => {
    const options: ImagePicker.ImagePickerOptions = {
      mediaTypes: ["images"],
      quality: 0.8,
      allowsMultipleSelection: false,
    };

    const result = useCamera
      ? await ImagePicker.launchCameraAsync(options)
      : await ImagePicker.launchImageLibraryAsync(options);

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    setImageUri(asset.uri);
    setError(null);
    await sendToApi(asset.uri, asset.mimeType ?? "image/jpeg", asset.fileName ?? "photo.jpg");
  };

  const sendToApi = async (uri: string, mimeType: string, fileName: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await monumentService.recognize({
        message: "Who is this?",
        session_id: sessionId.current,
        imageUri: uri,
        mimeType,
        fileName,
      });

      setResponseText(response.response);
    } catch (err: any) {
      setError(err?.message || "Failed to recognize monument");
    } finally {
      setIsLoading(false);
    }
  };

  const isDone = responseText !== null;

  return (
    <View className="flex-1 bg-white dark:bg-[#0f1923]" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="flex-row items-center px-4 py-3 border-b border-slate-100 dark:border-slate-800">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-center text-lg font-bold text-[#0c141d] dark:text-white mr-8">
          Recognize a monument
        </Text>
      </View>

      <View className="flex-1 px-6 pt-8">
        {!imageUri && !isLoading && !isDone && !error && (
          <View className="flex-1 items-center justify-center -mt-20">
            <View className="w-28 h-28 rounded-full bg-primary/10 items-center justify-center mb-6">
              <MaterialIcons name="photo-camera" size={52} color="#359EFF" />
            </View>
            <Text className="text-xl font-bold text-[#0c141d] dark:text-white mb-2 text-center">
              Take a photo of a monument
            </Text>
            <Text className="text-sm text-slate-500 dark:text-slate-400 mb-10 text-center max-w-xs">
              Snap or choose a photo to identify any monument instantly
            </Text>
            <Pressable
              onPress={() => handlePick(true)}
              className="w-full flex-row items-center justify-center gap-3 bg-primary py-4 rounded-2xl mb-4 shadow-sm active:opacity-70"
            >
              <MaterialIcons name="camera-alt" size={22} color="white" />
              <Text className="text-white font-bold text-base">Take Photo</Text>
            </Pressable>
            <Pressable
              onPress={() => handlePick(false)}
              className="w-full flex-row items-center justify-center gap-3 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 active:opacity-70"
            >
              <MaterialIcons name="photo-library" size={22} color="#359EFF" />
              <Text className="text-primary font-bold text-base">Choose from Gallery</Text>
            </Pressable>
          </View>
        )}

        {(imageUri || isLoading || isDone) && (
          <View className="flex-1">
            {imageUri && (
              <View className="w-full aspect-video rounded-2xl overflow-hidden bg-slate-200 mb-6">
                <Image source={{ uri: imageUri }} className="w-full h-full" resizeMode="cover" />
              </View>
            )}

            {isLoading && (
              <View className="flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#359EFF" />
                <Text className="text-sm text-slate-500 dark:text-slate-400 mt-4">
                  Identifying monument...
                </Text>
              </View>
            )}

            {error && (
              <View className="flex-1 items-center justify-center">
                <MaterialIcons name="error-outline" size={48} color="#ef4444" />
                <Text className="text-base text-red-500 mt-4 text-center max-w-xs">{error}</Text>
                <Pressable
                  onPress={() => {
                    setError(null);
                    setImageUri(null);
                  }}
                  className="mt-6 px-6 py-3 bg-primary rounded-xl active:opacity-70"
                >
                  <Text className="text-white font-bold">Try Again</Text>
                </Pressable>
              </View>
            )}

            {isDone && (
              <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                <View className="bg-primary/5 dark:bg-primary/10 rounded-2xl p-5 border border-primary/10">
                  <View className="flex-row items-center gap-2 mb-3">
                    <MaterialIcons name="auto-awesome" size={20} color="#359EFF" />
                    <Text className="font-bold text-[#0c141d] dark:text-white">Result</Text>
                  </View>
                  <FormattedText text={responseText} />
                </View>
              </ScrollView>
            )}
          </View>
        )}
      </View>

      {isDone && (
        <View className="px-6 pb-4" style={{ paddingBottom: insets.bottom + 20 }}>
          <Pressable
            onPress={() => router.back()}
            className="w-full flex-row items-center justify-center gap-2 bg-slate-100 dark:bg-slate-800 py-4 rounded-2xl border border-slate-200 dark:border-slate-700 active:opacity-70"
          >
            <MaterialIcons name="logout" size={20} color="#64748b" />
            <Text className="font-bold text-slate-600 dark:text-slate-300">Go Back</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
}
