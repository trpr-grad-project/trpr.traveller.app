import { create } from "zustand";

export interface LocationState {
  connectionState:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  isConnecting: boolean;
  activeTripId: string | null;
  currentLatitude: number | null;
  currentLongitude: number | null;
  isWatching: boolean;
  gpsError: string | null;
}

export interface LocationActions {
  setConnectionState: (state: LocationState["connectionState"]) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  setActiveTripId: (tripId: string | null) => void;
  setCurrentPosition: (lat: number | null, lng: number | null) => void;
  setIsWatching: (watching: boolean) => void;
  setGpsError: (error: string | null) => void;
  reset: () => void;
}

const initialState: LocationState = {
  connectionState: "disconnected",
  isConnecting: false,
  activeTripId: null,
  currentLatitude: null,
  currentLongitude: null,
  isWatching: false,
  gpsError: null,
};

export const useLocationStore = create<LocationState & LocationActions>()(
  (set) => ({
    ...initialState,
    setConnectionState: (connectionState) => set({ connectionState }),
    setIsConnecting: (isConnecting) => set({ isConnecting }),
    setActiveTripId: (activeTripId) => set({ activeTripId }),
    setCurrentPosition: (currentLatitude, currentLongitude) =>
      set({ currentLatitude, currentLongitude }),
    setIsWatching: (isWatching) => set({ isWatching }),
    setGpsError: (gpsError) => set({ gpsError }),
    reset: () => set({ ...initialState }),
  }),
);
