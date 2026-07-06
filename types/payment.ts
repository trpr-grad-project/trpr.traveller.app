export interface BalanceResponse {
  userId: string;
  balance: number;
}

export interface TransactionItem {
  id: string;
  refNumber: string | null;
  status: "Gain" | "Spend";
  amount: number;
  createdAtUtc: string;
  note: string;
}

export interface TransactionHistoryResponse {
  items: TransactionItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface MockCard {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
}
