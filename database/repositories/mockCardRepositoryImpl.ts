import type { MockCard } from "@/types";
import { getDatabase } from "../database";
import type { IMockCardRepository } from "./mockCardRepository";

type CardRow = {
  id: string;
  userId: string;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  createdAt: string;
  updatedAt: string;
};

function fromRow(row: CardRow): MockCard {
  return {
    id: row.id,
    userId: row.userId,
    cardNumber: row.cardNumber,
    cardHolder: row.cardHolder,
    expiryDate: row.expiryDate,
    createdAt: row.createdAt,
    updatedAt: row.updatedAt,
  };
}

export function createMockCardRepository(): IMockCardRepository {
  return {
    saveCard: async (card) => {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT OR REPLACE INTO mock_card
          (id, userId, cardNumber, cardHolder, expiryDate, createdAt, updatedAt)
         VALUES (?, ?, ?, ?, ?, ?, ?)`,
        [
          card.id,
          card.userId,
          card.cardNumber,
          card.cardHolder,
          card.expiryDate,
          card.createdAt,
          card.updatedAt,
        ],
      );
    },

    getCard: async (userId) => {
      const db = await getDatabase();
      const row = await db.getFirstAsync<CardRow>(
        `SELECT * FROM mock_card WHERE userId = ?`,
        [userId],
      );
      return row ? fromRow(row) : null;
    },

    deleteCard: async (userId) => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM mock_card WHERE userId = ?", [userId]);
    },
  };
}
