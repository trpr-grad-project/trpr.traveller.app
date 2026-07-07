import { getUserId } from "@/utils/storage";
import { createTripLocationRepository } from "@/database/repositories/tripLocationRepositoryImpl";
import type { TripLocation } from "@/types";

let queryClientRef: {
  setQueryData: (queryKey: unknown[], data: unknown) => void;
  invalidateQueries: (filters: { queryKey: unknown[] }) => void;
} | null = null;

export function setTripLocationQueryClient(
  client: typeof queryClientRef,
): void {
  queryClientRef = client;
}

export type LocationSyncListener = (tripId: string) => void;

class TripLocationSync {
  private listeners = new Set<LocationSyncListener>();

  subscribe(listener: LocationSyncListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notify(tripId: string): void {
    for (const fn of this.listeners) {
      try {
        fn(tripId);
      } catch {
        /* noop */
      }
    }
  }

  async handleLocationUpdated(payload: unknown): Promise<void> {
    const location = payload as Record<string, unknown> | null;
    if (
      !location ||
      typeof location.userId !== "string" ||
      typeof location.tripId !== "string" ||
      typeof location.latitude !== "number" ||
      typeof location.longitude !== "number"
    ) {
      console.log("Invalid LocationUpdated payload ignored", payload);
      return;
    }

    const currentUserId = getUserId();
    if (location.userId === currentUserId) {
      return;
    }

    const repo = createTripLocationRepository();
    const entry: TripLocation = {
      tripId: location.tripId,
      userId: location.userId,
      latitude: location.latitude,
      longitude: location.longitude,
      updatedAt: Date.now(),
    };

    try {
      await repo.upsert(entry);
    } catch (error) {
      console.error("Failed to persist location update", error);
      return;
    }

    this.updateCache(entry);
    this.notify(entry.tripId);
  }

  updateCache(location: TripLocation): void {
    if (!queryClientRef) return;
    const key = ["trip-locations", location.tripId];
    queryClientRef.setQueryData(key, (old: TripLocation[] | undefined) => {
      if (!old) return [location];
      const idx = old.findIndex((l) => l.userId === location.userId);
      if (idx >= 0) {
        const next = [...old];
        next[idx] = location;
        return next;
      }
      return [...old, location];
    });
  }
}

export const tripLocationSync = new TripLocationSync();
