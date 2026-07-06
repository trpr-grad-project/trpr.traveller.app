import type { TripLocation } from "@/types";

export interface ITripLocationRepository {
  upsert(location: TripLocation): Promise<void>;
  getByTripId(tripId: string): Promise<TripLocation[]>;
  getByTripIdAndUserId(
    tripId: string,
    userId: string,
  ): Promise<TripLocation | null>;
  deleteByTripId(tripId: string): Promise<void>;
}
