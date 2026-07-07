import { create } from "zustand";
import type { TripTodayItem } from "@/types/trip-hub";

export interface TripHubState {
  tripsToday: TripTodayItem[];
  connectionState:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  isConnecting: boolean;
}

export interface TripHubActions {
  setTripsToday: (trips: TripTodayItem[]) => void;
  updateTripStatus: (tripId: string, status: string) => void;
  removeTrip: (tripId: string) => void;
  setConnectionState: (state: TripHubState["connectionState"]) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  reset: () => void;
}

const initialState: TripHubState = {
  tripsToday: [],
  connectionState: "disconnected",
  isConnecting: false,
};

export const useTripHubStore = create<TripHubState & TripHubActions>()(
  (set) => ({
    ...initialState,
    setTripsToday: (tripsToday) => set({ tripsToday }),
    updateTripStatus: (tripId, status) =>
      set((state) => ({
        tripsToday: state.tripsToday.map((t) =>
          t.id === tripId ? { ...t, status } : t,
        ),
      })),
    removeTrip: (tripId) =>
      set((state) => ({
        tripsToday: state.tripsToday.filter((t) => t.id !== tripId),
      })),
    setConnectionState: (connectionState) => set({ connectionState }),
    setIsConnecting: (isConnecting) => set({ isConnecting }),
    reset: () => set({ ...initialState }),
  }),
);
