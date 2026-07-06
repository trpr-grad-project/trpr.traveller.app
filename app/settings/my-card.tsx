import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  Text,
  View,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { useAuth } from "@/context/AuthContext";
import { paymentService } from "@/services";
import { createMockCardRepository } from "@/database/repositories/mockCardRepositoryImpl";
import type { MockCard } from "@/types";
import BackButton from "@/components/BackButton";
import FormInput from "@/components/FormInput";
import PrimaryButton from "@/components/PrimaryButton";

function formatCardNumber(text: string) {
  const digits = text.replace(/\D/g, "").slice(0, 16);
  return digits.replace(/(\d{4})(?=\d)/g, "$1-");
}

function maskCardNumber(num: string) {
  const cleaned = num.replace(/\D/g, "");
  if (cleaned.length < 4) return num;
  return `****-****-****-${cleaned.slice(-4)}`;
}

export default function MyCardScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";
  const { user } = useAuth();

  const mockCardRepo = useMemo(() => createMockCardRepository(), []);

  const [mode, setMode] = useState<"form" | "card">("form");
  const [loading, setLoading] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const [cardNumber, setCardNumber] = useState("");
  const [cardHolder, setCardHolder] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [amount, setAmount] = useState("");

  const loadCard = useCallback(async () => {
    if (!user?.id) return;
    const saved = await mockCardRepo.getCard(user.id);
    if (saved) {
      setCardNumber(saved.cardNumber);
      setCardHolder(saved.cardHolder);
      setExpiryDate(saved.expiryDate);
      setMode("card");
    }
  }, [user?.id, mockCardRepo]);

  const loadBalance = useCallback(async () => {
    try {
      setBalanceLoading(true);
      const res = await paymentService.getBalance();
      setBalance(res.balance);
    } catch {
      setBalance(null);
    } finally {
      setBalanceLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCard();
  }, [loadCard]);

  useEffect(() => {
    if (mode === "card") {
      loadBalance();
    }
  }, [mode, loadBalance]);

  const handleSaveCard = async () => {
    if (!user?.id) return;
    if (!cardNumber.trim() || !cardHolder.trim() || !expiryDate.trim()) {
      Alert.alert("Missing fields", "Please fill in all card details.");
      return;
    }

    setLoading(true);
    try {
      const now = new Date().toISOString();
      const card: MockCard = {
        id: `${user.id}-card`,
        userId: user.id,
        cardNumber: cardNumber.trim(),
        cardHolder: cardHolder.trim(),
        expiryDate: expiryDate.trim(),
        createdAt: now,
        updatedAt: now,
      };
      await mockCardRepo.saveCard(card);
      setMode("card");
    } finally {
      setLoading(false);
    }
  };

  const handleEditCard = () => {
    setMode("form");
  };

  const handleAddFunds = async () => {
    const amt = parseFloat(amount);
    if (!amt || amt <= 0) {
      Alert.alert("Invalid amount", "Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      await paymentService.chargeAccount(amt);
      await loadBalance();
      setAmount("");
      if (mode === "form") setMode("card");
    } catch (e) {
      console.error("Add funds error:", e);
      Alert.alert("Error", "Failed to charge account. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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

      <View className="flex-row items-center px-4 py-3">
        <BackButton iconSize={18} iconName="arrow-back-ios-new" />
        <Text className="flex-1 text-lg font-bold text-main-light dark:text-white text-center mr-8">
          My Card
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
      >
        {mode === "form" ? (
          <>
            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 shadow-sm mb-4">
              <Text className="text-sm font-bold text-main-light dark:text-white mb-4">
                Card Details
              </Text>

              <View className="gap-4">
                <FormInput
                  label="Card Number"
                  value={cardNumber}
                  onChangeText={(t) => setCardNumber(formatCardNumber(t))}
                  placeholder="4242-4242-4242-4242"
                  icon="credit-card"
                  keyboardType="number-pad"
                />
                <FormInput
                  label="Card Holder"
                  value={cardHolder}
                  onChangeText={setCardHolder}
                  placeholder="John Doe"
                  icon="person"
                />
                <FormInput
                  label="Expiry Date"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/YY"
                  icon="calendar-today"
                />
              </View>
            </View>

            <PrimaryButton
              title={loading ? "Saving..." : "Save Card"}
              onPress={handleSaveCard}
              isLoading={loading}
              disabled={loading}
            />

            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 shadow-sm my-6">
              <Text className="text-sm font-bold text-main-light dark:text-white mb-4">
                Add Funds
              </Text>

              {balance !== null && (
                <View className="flex-row items-center justify-between mb-4 px-1">
                  <Text className="text-xs text-sub-light">Current Balance</Text>
                  <Text className="text-sm font-bold text-green-500">
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              )}

              <FormInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                icon="attach-money"
                keyboardType="decimal-pad"
              />
              <View className="mt-3">
                <PrimaryButton
                  title={loading ? "Processing..." : "Add Funds"}
                  onPress={handleAddFunds}
                  isLoading={loading}
                  disabled={loading || !amount}
                />
              </View>
            </View>
          </>
        ) : (
          <>
            <LinearGradient
              colors={["#1e3a5f", "#0d2137"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              className="rounded-2xl p-6 shadow-lg mb-6"
            >
              <View className="flex-row justify-between items-start mb-8">
                <Text className="text-blue-200 text-xs font-semibold tracking-widest uppercase">
                  Virtual Card
                </Text>
                <MaterialIcons name="credit-card" size={28} color="white" />
              </View>
              <Text className="text-white text-xl font-bold tracking-widest mb-4">
                {maskCardNumber(cardNumber)}
              </Text>
              <View className="flex-row justify-between">
                <View>
                  <Text className="text-blue-300 text-[10px] uppercase">Card Holder</Text>
                  <Text className="text-white text-sm font-semibold">{cardHolder}</Text>
                </View>
                <View>
                  <Text className="text-blue-300 text-[10px] uppercase">Expires</Text>
                  <Text className="text-white text-sm font-semibold">{expiryDate}</Text>
                </View>
              </View>
            </LinearGradient>

            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 shadow-sm mb-4">
              <View className="flex-row items-center justify-between">
                <Text className="text-sm font-bold text-main-light dark:text-white">
                  Current Balance
                </Text>
                {balanceLoading && <ActivityIndicator size="small" color="#359EFF" />}
              </View>
              <Text className="text-3xl font-bold text-main-light dark:text-white mt-2">
                {balance !== null
                  ? `$${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}`
                  : "---"}
              </Text>
            </View>

            <View className="bg-white dark:bg-neutral-dark rounded-2xl border border-neutral-light dark:border-neutral-dark p-5 shadow-sm mb-6">
              <Text className="text-sm font-bold text-main-light dark:text-white mb-4">
                Add Funds
              </Text>

              {balance !== null && (
                <View className="flex-row items-center justify-between mb-4 px-1">
                  <Text className="text-xs text-sub-light">Current Balance</Text>
                  <Text className="text-sm font-bold text-green-500">
                    ${balance.toLocaleString("en-US", { minimumFractionDigits: 2 })}
                  </Text>
                </View>
              )}

              <FormInput
                label="Amount"
                value={amount}
                onChangeText={setAmount}
                placeholder="0.00"
                icon="attach-money"
                keyboardType="decimal-pad"
              />
              <View className="mt-3">
                <PrimaryButton
                  title={loading ? "Processing..." : "Add Funds"}
                  onPress={handleAddFunds}
                  isLoading={loading}
                  disabled={loading || !amount}
                />
              </View>
            </View>

            <Pressable
              onPress={handleEditCard}
              className="flex-row items-center justify-center gap-2 py-4 rounded-xl border border-neutral-light dark:border-neutral-dark active:bg-slate-50 dark:active:bg-slate-800"
            >
              <MaterialIcons name="edit" size={18} color="#359EFF" />
              <Text className="text-sm font-semibold text-primary">Edit Card</Text>
            </Pressable>
          </>
        )}
      </ScrollView>
    </View>
  );
}
