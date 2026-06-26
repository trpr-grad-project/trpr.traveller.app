import React, { useState } from "react";
import { Pressable, ScrollView, StatusBar, Text, TextInput, View, Image } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useColorScheme } from "nativewind";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const FILTERS = ["All", "Groups", "Unread"];

const CONVERSATIONS = [
  {
    id: "1",
    name: "Ahmed Ali (Local Guide)",
    preview: "About tomorrow's plan...",
    time: "2h ago",
    unread: 2,
    online: true,
    isGroup: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuA5EUfORJBarq6w7AgAq5aAs6a4mngxdV2on09juyzwM1VbQpWx0PBLKPuzxRWa2mYjbt55Re7rA54IGN-5omeojQKXkrPueUBF3_ZgnKBAwb14R_wbUUeFXxdMiCv67xIcWR_K4nHjakXAJXObta4O5vTG7tPCAn19nqLKHq4dIu9YDMH90ygA7x6uwKIX2-4bWmeosuWGxfBUD5TsCxSfL-tqhoKJWm5p2u78DbgvL2LK_0RnB2n7ANUbzf0FCAwnttTr1yxPZ_py",
  },
  {
    id: "2",
    name: "Mohamed Reda (Alexandria Guide)",
    preview: "The seafood restaurant is booked for tonight.",
    time: "4h ago",
    unread: 0,
    online: false,
    isGroup: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCFWEEU9JNjHdHLtog34El-wIUeWLI42WbIZLeWa_RNspa6M6q1DVVY8rkTpQN3b4Rl03aZ5inWCjMOh1M1cwWCpfeQYBwuqKtQCTsLaKYKGmfoUb0rDz60xuOSdDRJqqujdD_zRviI_qpYWpuikncqPHljEKv7OAdqVAuYEK3yRMGr-02fQV_4N81ZUILKMlTYtVTqiGDD1uSHH4hV0bouub6TTi5ofVIipAJcUqP3jSsGJucUpwbG-Te_dj-WIyW25HpyfFtFf6OU",
  },
  {
    id: "3",
    name: "Aswan Nile Cruise Group",
    preview: "Departure time changed to 5 PM",
    time: "5h ago",
    unread: 1,
    online: false,
    isGroup: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBwfC5bmA6uzIISOzGmQMFGu38RCMsRRxQJU5O64FcKoSEt6c1TezKoKfReDoiv0RWZSaX7sOQCdSzSXxEXEMv35WcoJVu0ouqEumH-at91JVOkWWLZNAyB8eF3gRtpoC1Gv3SXIRDq_8PsG2vI1_7QnSwb8R02BCYxgqXaXzYN8dowhmLOfle2oQJbX09RlWSmp4GD3aY9QE5dt_7kVwdBGuYME_mGif5DzrLkwK6yyYvf9-zi66DiGVpXmslqthX3ktGkTuHTfm0P",
  },
  {
    id: "4",
    name: "Cairo Foodies",
    preview: "Don't miss the koshary spot!",
    time: "6h ago",
    unread: 0,
    online: false,
    isGroup: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDjCIcusmT7lN633C0a8KwmXdq660v4lA-nEy2dJtm00kdto7YxVEP53OMsnEJjxse9rNKo-KJsTKsssUlTdJbSUdgJmu1v2INtPLaRUoWToz8PXRPrjgYKNGfuRFGmtGWvzZ1grr8d58omeyACSCwgGt3NYH8dT_ZVa0zqkw-kjUy_36_D5KnIdvWXM-J3Z1h7uS7QrxK4VfWEkR1Sx-MytYEYRaE7ZtY4xaKsC2a7uTNmnol56oh6Fypfc0qWWXCOAgI6G0yL9I74",
  },
  {
    id: "5",
    name: "Giza Expedition 2024",
    preview: "Meeting point confirmed",
    time: "Yesterday",
    unread: 0,
    online: false,
    isGroup: true,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBRrXE--YB_mmudPLrM_t4jzT02PWTfh9Ztqs8LRcqtODG6vCGkpSbONPzZb2He6QkbXqYojzzfX0qEhz0rqp23zP9ge0yoStSW0jvBYsvYPs9-IYWzAKKcyn_dQm49mRlu-tsWKgaoPYgKuNyTg7dHr7oUxt_sDMkmgmVdqtGYoMMmWKXCH_-DgyvDSakTjzcIn6zKfSH9dKrASVvXiJ8d7YL2e7UKJC3JIzuEmyHGiQsIbP0dciJA9qT-y0xMWSioXmnjdLAKxkQk",
  },
  {
    id: "6",
    name: "Luxor Temple Tour",
    preview: "See you all at 9 AM!",
    time: "2d ago",
    unread: 0,
    online: false,
    isGroup: false,
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDkdoBcnN9vkR14fwD8m8laeZgZLzSqmC4RaAz2gXdyfVcVpXlO7hZrZYfUruhDJSMJ8mKaBndf5SbASQHnln6HU5CeaE4VdkP1o70DV8-pHz__ERPtJ7mM6Ih5mcVxln3aFcCF9Waru86-ewOpNsoQXMEdhdK6y3Vjqlm6XtUYwNKfH5MT1j1Tucs2vFlxX6AfV6AWW7y9MUa7Ns7WJXDoW0rOm36wAAi9e9j3F6eTAI0CxLAaJPKGAomdIlHO_WJif-uubmVr-sOK",
  },
];

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");

  return (
    <View className="flex-1 bg-white dark:bg-[#0f1923]" style={{ paddingTop: insets.top }}>
      <StatusBar translucent backgroundColor="transparent" barStyle={isDark ? "light-content" : "dark-content"} />

      <View className="border-b border-slate-100 dark:border-slate-800 pt-4">
        <View className="items-center px-4 pb-2">
          <Text className="text-[#0c141d] dark:text-white text-lg font-bold">Messages</Text>
        </View>

        <View className="mx-4 mb-2 flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-xl px-4 h-10 gap-2">
          <MaterialIcons name="search" size={20} color="#94a3b8" />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search chats or guides"
            placeholderTextColor="#94a3b8"
            className="flex-1 text-sm text-[#0c141d] dark:text-white"
          />
        </View>

        <View className="px-4 pb-4">
          <View className="flex-row bg-slate-100 dark:bg-slate-800 rounded-xl p-1">
            {FILTERS.map((f) => (
              <Pressable
                key={f}
                onPress={() => setFilter(f)}
                className={`flex-1 py-1.5 rounded-lg ${filter === f ? "bg-white dark:bg-slate-700 shadow-sm" : ""}`}
              >
                <Text
                  className={`text-xs font-semibold text-center ${
                    filter === f ? "text-primary" : "text-slate-500 dark:text-slate-400"
                  }`}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} className="flex-1 mb-24">
        <View className="divide-y divide-slate-50 dark:divide-slate-800">
          {CONVERSATIONS.map((conv) => (
            <Pressable
              key={conv.id}
              onPress={() => router.push(conv.isGroup ? `/chat/group/${conv.id}` : `/chat/${conv.id}`)}
              className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800"
            >
              <View className="relative">
                <View className={`w-14 h-14 ${conv.isGroup ? "rounded-xl" : "rounded-full"} overflow-hidden bg-slate-200`}>
                  <Image source={{ uri: conv.avatar }} className="w-full h-full" resizeMode="cover" />
                </View>
                {conv.online && (
                  <View className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white dark:border-[#0f1923]" />
                )}
              </View>
              <View className="flex-1 ml-4">
                <View className="flex-row justify-between items-baseline mb-0.5">
                  <Text className="font-bold text-[#0c141d] dark:text-white truncate flex-1 mr-2">{conv.name}</Text>
                  <Text className={`text-xs font-semibold ${conv.unread > 0 ? "text-primary" : "text-slate-400"}`}>
                    {conv.time}
                  </Text>
                </View>
                <View className="flex-row justify-between items-center">
                  <Text className="text-sm text-slate-500 dark:text-slate-400 truncate flex-1 mr-2">{conv.preview}</Text>
                  {conv.unread > 0 && (
                    <View className="w-2.5 h-2.5 bg-primary rounded-full flex-shrink-0" />
                  )}
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <Pressable
        onPress={() => router.push("/chat/ai")}
        className="fixed bottom-[119px] right-6 z-[60] flex-row items-center gap-2 bg-[#359EFF] px-5 py-3.5 rounded-t-[28px] rounded-bl-[28px] rounded-br-none shadow-lg"
        style={{
          position: "absolute",
          bottom: insets.bottom + 90,
          right: 24,
          shadowColor: "#359EFF",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 12,
          elevation: 8,
        }}
      >
        <MaterialIcons name="auto-awesome" size={20} color="white" />
        <Text className="text-white text-sm font-semibold">Trip Assistant</Text>
      </Pressable>
    </View>
  );
}
