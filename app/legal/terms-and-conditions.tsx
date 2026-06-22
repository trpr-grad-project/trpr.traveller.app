import { useRouter } from "expo-router";
import { ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import BackButton from "@/components/BackButton";

export default function TermsAndConditions() {
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
          Terms & Conditions
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="mx-auto w-full max-w-2xl px-5 pb-10 pt-8">
          {/* Last Updated */}
          <Text className="mb-1 font-display text-[11px] font-semibold uppercase tracking-widest text-gray-custom">
            Last Updated
          </Text>
          <Text className="mb-8 font-display text-[14px] text-slate-600 dark:text-slate-400">
            Jun 24, 2026
          </Text>

          {/* Section 1 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              1. Acceptance of Terms
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              By accessing and using this travel application, you agree to be
              bound by these Terms and Conditions and all applicable laws and
              regulations. If you do not agree with any of these terms, you are
              prohibited from using or accessing this site.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We reserve the right to modify these terms at any time. Your
              continued use of the app following any changes indicates your
              acceptance of the new Terms and Conditions.
            </Text>
          </View>

          {/* Section 2 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              2. User Responsibilities
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              Users are responsible for maintaining the confidentiality of their
              account information, including passwords. You agree to accept
              responsibility for all activities that occur under your account.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              When booking travel services through our platform, you ensure
              that all information provided is accurate, current, and complete.
              Any fraudulent or speculative bookings are strictly prohibited.
            </Text>
          </View>

          {/* Section 3 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              3. Privacy Policy
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              Your privacy is important to us. Our Privacy Policy, which is
              incorporated into these Terms by reference, explains how we
              collect, use, and protect your personal information.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              By using our services, you consent to the collection and use of
              your data as outlined in our Privacy Policy, including data
              sharing with third-party travel providers necessary to complete
              your bookings.
            </Text>
          </View>

          {/* Section 4 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              4. Limitation of Liability
            </Text>
            <Text className="mb-3 font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              To the maximum extent permitted by law, the application and its
              affiliates shall not be liable for any direct, indirect,
              incidental, special, or consequential damages resulting from the
              use or inability to use our services.
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We act as an intermediary between users and travel service
              providers (airlines, hotels, etc.). We are not responsible for
              the acts, errors, omissions, representations, warranties,
              breaches, or negligence of any such providers.
            </Text>
          </View>

          {/* Section 5 */}
          <View className="mb-7">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              5. Intellectual Property
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              The content, features, and functionality of this app are and will
              remain the exclusive property of the company and its licensors.
              Our trademarks and trade dress may not be used in connection with
              any product or service without prior written consent.
            </Text>
          </View>

          {/* Section 6 */}
          <View className="mb-10">
            <Text className="mb-3 font-display text-[15px] font-bold text-slate-900 dark:text-white">
              6. Termination
            </Text>
            <Text className="font-display text-[14px] leading-relaxed text-slate-600 dark:text-slate-400">
              We may terminate or suspend your account and bar access to the
              service immediately, without prior notice or liability, under our
              sole discretion, for any reason whatsoever and without
              limitation, including but not limited to a breach of the Terms.
            </Text>
          </View>

          {/* Footer */}
          <View className="border-t border-neutral-light pt-6 dark:border-neutral-dark/50">
            <Text className="text-center font-display text-[12px] text-gray-custom">
              © 2026 Travel App Inc. All rights reserved.
            </Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
