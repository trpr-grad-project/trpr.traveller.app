import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";

export default function PrivacyPolicy() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="flex-1 bg-background-light dark:bg-background-dark"
      style={{ paddingTop: insets.top }}
    >
      {/* Header */}
      <View className="flex-row items-center border-b border-neutral-light px-5 pb-4 dark:border-neutral-dark/50">
        <BackButton onPress={() => router.back()} />
        <Text className="flex-1 pr-7 text-center font-display text-[17px] font-bold text-slate-900 dark:text-white">
          Privacy Policy
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="mx-auto w-full max-w-2xl px-5 pb-10 pt-8">
          {/* Section 1 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              1. Information We Collect
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We collect information that you provide directly to us when you
              create an account, make a booking, or communicate with our support
              team. This includes your name, email address, phone number, and
              payment information.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We also automatically collect certain device information and usage
              data when you use the app, such as your IP address, browser type,
              and interactions with our services.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              2. How We Use Your Data
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We use the information we collect to provide, maintain, and
              improve our services. This includes processing your travel
              bookings, sending you notifications about your trips, and
              personalizing your travel recommendations.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              Additionally, we use data for security purposes, to prevent fraud,
              and to comply with legal obligations. We may use your contact
              information to send you marketing communications if you have opted
              in to receive them.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              3. Data Sharing and Disclosure
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We share your information with travel providers (such as airlines,
              hotels, and car rental companies) to fulfill your bookings. We
              also share data with third-party service providers who perform
              services on our behalf.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We do not sell your personal data to third parties. We may
              disclose your information if required by law or in response to
              valid requests by public authorities.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-10">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              4. Your Privacy Rights
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              Depending on your location, you may have rights to access, correct,
              or delete your personal information. You can manage your
              communication preferences and some data settings directly within
              the app&apos;s account section.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              If you have questions about your rights or how we handle your
              data, please contact our privacy officer through the support
              channel.
            </Text>
          </View>

          {/* Footer */}
          <View className="border-t border-neutral-light pt-6 dark:border-neutral-dark/50">
            <Text className="text-center font-display text-[12px] text-gray-custom">
              Last updated: June 24, 2026
            </Text>
            <Text className="mt-1 text-center font-display text-[12px] text-gray-custom">
              © 2026 Travel App Inc.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
