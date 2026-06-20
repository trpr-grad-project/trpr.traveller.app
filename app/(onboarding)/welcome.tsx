import React, { useCallback, useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Pressable,
  StatusBar,
  Text,
  View,
  ViewToken,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { router } from "expo-router";

const { width } = Dimensions.get("window");

type Slide = { id: string; title: string; body: string; image: string };

const SlideItem = React.memo(function SlideItem({ item }: { item: Slide }) {
  return (
    <View style={{ width }}>
      <View className="overflow-hidden bg-white dark:bg-background-dark" style={{ aspectRatio: 4 / 3 }}>
        <Image
          source={{ uri: item.image }}
          className="w-full h-full"
          resizeMode="cover"
        />
        <View className="absolute inset-0 bg-gradient-to-t from-white dark:from-background-dark via-transparent opacity-40" />
      </View>
      <View className="px-8 pt-8 pb-4 items-center">
        <Text className="text-[#101518] dark:text-white text-[32px] font-bold leading-tight text-center pb-4">
          {item.title}
        </Text>
        <Text className="text-[#101518]/80 dark:text-gray-300 text-base leading-relaxed text-center px-2">
          {item.body}
        </Text>
      </View>
    </View>
  );
});

const SLIDES: Slide[] = [
  {
    id: "1",
    title: "Discover the World, Your Way",
    body: "Uncover the stories behind every destination. Explore history, find unique local spots, and plan your next cultural journey with ease.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWPHr_sNBVZQJfzI-GNxspIdVXEBCvKanDV48oxWNHEpUxh15qSRoR6b-RSb5d4D9yt9PWmLUVeA0JnLIA7ZNgxoa7tpX41qlOfAgKxXr6ZcZ_T43pOuKoxkcyEo1EkXK1prgIQOA22aBVBRByxwnq-rHInsneckOgyCTmGF5jTXa2lMbKyk94zdAdci-7mWmiOC_OCxP0eBzs_mbZiCSFnrame3eNretK84Gu8c4scGhgS5ryIMj00r3IU_kdu9vXybTXDHzlpw3v",
  },
  {
    id: "2",
    title: "AI-Powered Trip Planning",
    body: "Let our smart assistant build personalized itineraries in seconds. Just tell it where you want to go and it handles the rest.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWPHr_sNBVZQJfzI-GNxspIdVXEBCvKanDV48oxWNHEpUxh15qSRoR6b-RSb5d4D9yt9PWmLUVeA0JnLIA7ZNgxoa7tpX41qlOfAgKxXr6ZcZ_T43pOuKoxkcyEo1EkXK1prgIQOA22aBVBRByxwnq-rHInsneckOgyCTmGF5jTXa2lMbKyk94zdAdci-7mWmiOC_OCxP0eBzs_mbZiCSFnrame3eNretK84Gu8c4scGhgS5ryIMj00r3IU_kdu9vXybTXDHzlpw3v",
  },
  {
    id: "3",
    title: "Connect with Local Guides",
    body: "Find verified local experts who know every hidden gem. Book a guide for your destination and experience it like a local.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWPHr_sNBVZQJfzI-GNxspIdVXEBCvKanDV48oxWNHEpUxh15qSRoR6b-RSb5d4D9yt9PWmLUVeA0JnLIA7ZNgxoa7tpX41qlOfAgKxXr6ZcZ_T43pOuKoxkcyEo1EkXK1prgIQOA22aBVBRByxwnq-rHInsneckOgyCTmGF5jTXa2lMbKyk94zdAdci-7mWmiOC_OCxP0eBzs_mbZiCSFnrame3eNretK84Gu8c4scGhgS5ryIMj00r3IU_kdu9vXybTXDHzlpw3v",
  },
  {
    id: "4",
    title: "Travel Together, Stay Connected",
    body: "Invite friends and family, share plans, and chat in group trips. Every adventure is better when shared.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWPHr_sNBVZQJfzI-GNxspIdVXEBCvKanDV48oxWNHEpUxh15qSRoR6b-RSb5d4D9yt9PWmLUVeA0JnLIA7ZNgxoa7tpX41qlOfAgKxXr6ZcZ_T43pOuKoxkcyEo1EkXK1prgIQOA22aBVBRByxwnq-rHInsneckOgyCTmGF5jTXa2lMbKyk94zdAdci-7mWmiOC_OCxP0eBzs_mbZiCSFnrame3eNretK84Gu8c4scGhgS5ryIMj00r3IU_kdu9vXybTXDHzlpw3v",
  },
  {
    id: "5",
    title: "Discover Ancient Wonders",
    body: "Uncover the stories behind every destination. Explore history, find unique local spots, and plan your next cultural journey with ease.",
    image: "https://lh3.googleusercontent.com/aida-public/AB6AXuCWPHr_sNBVZQJfzI-GNxspIdVXEBCvKanDV48oxWNHEpUxh15qSRoR6b-RSb5d4D9yt9PWmLUVeA0JnLIA7ZNgxoa7tpX41qlOfAgKxXr6ZcZ_T43pOuKoxkcyEo1EkXK1prgIQOA22aBVBRByxwnq-rHInsneckOgyCTmGF5jTXa2lMbKyk94zdAdci-7mWmiOC_OCxP0eBzs_mbZiCSFnrame3eNretK84Gu8c4scGhgS5ryIMj00r3IU_kdu9vXybTXDHzlpw3v",
  },
];

const viewabilityConfig = { itemVisiblePercentThreshold: 50 };

export default function WelcomeScreen() {
  const insets = useSafeAreaInsets();
  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0 && viewableItems[0].index !== null) {
        setCurrentIndex(viewableItems[0].index);
      }
    },
  ).current;

  const goToNext = useCallback(() => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1 });
    } else {
      router.push("/(onboarding)/languageSelection");
    }
  }, [currentIndex]);

  const goToLanguage = useCallback(() => {
    router.push("/(onboarding)/languageSelection");
  }, []);

  const renderItem = useCallback(
    ({ item }: { item: Slide }) => <SlideItem item={item} />,
    [],
  );

  const isLast = currentIndex === SLIDES.length - 1;

  return (
    <View
      className="flex-1 bg-white dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        scrollEventThrottle={16}
        removeClippedSubviews
      />

      {/* Bottom controls */}
      <View
        className="px-8 pb-4 items-center"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        {/* Dot indicators */}
        <View className="flex-row gap-2 mb-8 items-center">
          {SLIDES.map((_, i) => (
            <View
              key={i}
              className={`h-2 rounded-full ${
                i === currentIndex
                  ? "w-6 bg-primary"
                  : "w-2 bg-gray-200 dark:bg-gray-700"
              }`}
            />
          ))}
        </View>

        {/* Get Started / Next button */}
        <View className="w-full gap-2">
          <Pressable
            onPress={goToNext}
            className="flex w-full h-14 items-center justify-center rounded-xl bg-primary active:opacity-90 shadow-lg shadow-primary/20"
          >
            <Text className="text-white text-lg font-bold tracking-wide">
              {isLast ? "Get Started" : "Next"}
            </Text>
          </Pressable>

          {!isLast && (
            <Pressable
              onPress={goToLanguage}
              className="flex w-full h-12 items-center justify-center rounded-xl"
            >
              <Text className="text-[#828282] dark:text-gray-400 text-base font-semibold">
                Skip
              </Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
}
