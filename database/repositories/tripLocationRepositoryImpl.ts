import type { TripLocation } from "@/types";
import { getDatabase } from "../database";
import type { ITripLocationRepository } from "./tripLocationRepository";

export function createTripLocationRepository(): ITripLocationRepository {
  return {
    upsert: async (location) => {
      const db = await getDatabase();
      await db.runAsync(
        `INSERT OR REPLACE INTO trip_locations (tripId, userId, latitude, longitude, updatedAt)
         VALUES (?, ?, ?, ?, ?)`,
        [
          location.tripId,
          location.userId,
          location.latitude,
          location.longitude,
          location.updatedAt,
        ],
      );
    },

    getByTripId: async (tripId) => {
      const db = await getDatabase();
      return db.getAllAsync<TripLocation>(
        `SELECT * FROM trip_locations WHERE tripId = ?`,
        [tripId],
      );
    },

    getByTripIdAndUserId: async (tripId, userId) => {
      const db = await getDatabase();
      return db.getFirstAsync<TripLocation>(
        `SELECT * FROM trip_locations WHERE tripId = ? AND userId = ?`,
        [tripId, userId],
      );
    },

    deleteByTripId: async (tripId) => {
      const db = await getDatabase();
      await db.runAsync("DELETE FROM trip_locations WHERE tripId = ?", [tripId]);
    },
  };
}
