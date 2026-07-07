import api from "./api";
import { ENDPOINTS } from "./endpoints";
import type { BalanceResponse, TransactionHistoryResponse } from "@/types";

export const paymentService = {
  chargeAccount: async (amount: number): Promise<void> => {
    await api.post(ENDPOINTS.payments.charge, {}, {
      params: { ammount: amount },
    });
  },

  getBalance: async (): Promise<BalanceResponse> => {
    const { data } = await api.get<BalanceResponse>(ENDPOINTS.payments.balance);
    return data;
  },

  getTransactionHistory: async (
    cursor?: string,
    limit?: number,
  ): Promise<TransactionHistoryResponse> => {
    const { data } = await api.get<TransactionHistoryResponse>(
      ENDPOINTS.payments.history,
      {
        params: { cursor, limit },
      },
    );
    return data;
  },
};
