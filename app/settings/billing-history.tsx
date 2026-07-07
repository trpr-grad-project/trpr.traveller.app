import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  RefreshControl,
  StatusBar,
  Text,
  View,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useColorScheme } from "nativewind";

import { paymentService } from "@/services";
import type { TransactionItem } from "@/types";
import BackButton from "@/components/BackButton";

function formatDate(utc: string): string {
  const d = new Date(utc);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatAmount(amount: number): string {
  return `$${amount.toLocaleString("en-US", { minimumFractionDigits: 2 })}`;
}

export default function BillingHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { colorScheme } = useColorScheme();
  const isDark = colorScheme === "dark";

  const [items, setItems] = useState<TransactionItem[]>([]);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(
    async (cursor?: string, isRefresh = false) => {
      try {
        if (isRefresh) setRefreshing(true);
        const res = await paymentService.getTransactionHistory(cursor, 20);
        if (cursor) {
          setItems((prev) => [...prev, ...res.items]);
        } else {
          setItems(res.items);
        }
        setNextCursor(res.nextCursor);
        setHasNextPage(res.hasNextPage);
      } catch {
        // silently fail
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [],
  );

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleRefresh = () => {
    setItems([]);
    setNextCursor(null);
    fetchData(undefined, true);
  };

  const handleLoadMore = () => {
    if (!hasNextPage || loading || refreshing || !nextCursor) return;
    fetchData(nextCursor);
  };

  const renderItem = ({ item }: { item: TransactionItem }) => {
    const isGain = item.status === "Gain";
    return (
      <View className="flex-row items-center px-6 py-4 border-b border-slate-50 dark:border-slate-800">
        <View className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 items-center justify-center">
          <MaterialIcons
            name={isGain ? "add-circle-outline" : "remove-circle-outline"}
            size={24}
            color="#359EFF"
          />
        </View>
        <View className="flex-1 ml-4">
          <Text className="text-sm font-bold text-main-light dark:text-white">
            {item.note}
          </Text>
          <Text className="text-xs text-sub-light mt-0.5">
            {formatDate(item.createdAtUtc)}
          </Text>
        </View>
        <View className="items-end">
          <Text
            className={`text-sm font-bold ${
              isGain ? "text-green-500" : "text-red-500"
            }`}
          >
            {isGain ? "+" : "-"}
            {formatAmount(item.amount)}
          </Text>
          <Text
            className={`text-[11px] font-semibold mt-0.5 ${
              isGain ? "text-green-500" : "text-red-500"
            }`}
          >
            {isGain ? "Paid" : "Spent"}
          </Text>
        </View>
      </View>
    );
  };

  const renderListEmpty = () => {
    if (loading) return null;
    return (
      <View className="items-center justify-center py-20">
        <MaterialIcons name="receipt-long" size={48} color="#94a3b8" />
        <Text className="text-sm text-sub-light mt-4">No transactions yet</Text>
      </View>
    );
  };

  const renderFooter = () => {
    if (!loading || items.length === 0) return null;
    return (
      <View className="py-6">
        <ActivityIndicator size="small" color="#359EFF" />
      </View>
    );
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

      <View className="bg-white/80 dark:bg-background-dark/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 px-4 py-4">
        <View className="flex-row items-center">
          <BackButton iconSize={20} iconName="arrow-back-ios-new" />
          <Text className="flex-1 text-center text-lg font-bold text-main-light dark:text-white mr-8">
            Billing History
          </Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderListEmpty}
        ListFooterComponent={renderFooter}
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.3}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#359EFF"
            colors={["#359EFF"]}
          />
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 40 }}
      />
    </View>
  );
}
