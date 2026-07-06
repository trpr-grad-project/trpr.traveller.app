import { useTripHubStore } from "@/store/tripHubStore";
import type { TripTodayItem } from "@/types/trip-hub";

export function handleReceiveTripsToday(payload: unknown): void {
  const trips = payload as TripTodayItem[];
  if (!Array.isArray(trips)) {
    console.warn("TripsToday received non-array payload", payload);
    return;
  }
  useTripHubStore.getState().setTripsToday(trips);
}
