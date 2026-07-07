import type { MockCard } from "@/types";

export interface IMockCardRepository {
  saveCard(card: MockCard): Promise<void>;
  getCard(userId: string): Promise<MockCard | null>;
  deleteCard(userId: string): Promise<void>;
}
