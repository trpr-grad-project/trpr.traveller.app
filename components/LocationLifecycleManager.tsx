import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { useTripHubStore } from "@/store/tripHubStore";
import { useLocationStore } from "@/store/locationStore";
import {
  startLocationSharing,
  stopLocationSharing,
} from "@/hooks/useCurrentLocation";
import { tripConnection } from "@/services/signalr/tripConnection";

export default function LocationLifecycleManager() {
  const appState = useRef(AppState.currentState);
  const activeTripIdRef = useRef<string | null>(null);

  useEffect(() => {
    const tripsToday = useTripHubStore.getState().tripsToday;
    const started = tripsToday.find((t) => t.status === "Started");
    if (started) {
      activeTripIdRef.current = started.id;
      useLocationStore.getState().setActiveTripId(started.id);
      startLocationSharing(started.id).catch(console.error);
    }

    const unsubTrips = useTripHubStore.subscribe((state) => {
      const s = state.tripsToday.find((t) => t.status === "Started");
      const id = s?.id ?? null;
      if (id && id !== activeTripIdRef.current) {
        activeTripIdRef.current = id;
        useLocationStore.getState().setActiveTripId(id);
        startLocationSharing(id).catch(console.error);
      } else if (!id && activeTripIdRef.current) {
        activeTripIdRef.current = null;
        stopLocationSharing().catch(console.error);
      }
    });

    const unsubAppState = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          if (!tripConnection.isConnected()) {
            console.log("Location lifecycle: trip connection not connected");
          }
          const s = useTripHubStore.getState().tripsToday.find(
            (t) => t.status === "Started",
          );
          if (s && !activeTripIdRef.current) {
            activeTripIdRef.current = s.id;
            startLocationSharing(s.id).catch(console.error);
          }
        }
        appState.current = nextState;
      },
    );

    return () => {
      unsubTrips();
      unsubAppState.remove();
      stopLocationSharing().catch(console.error);
    };
  }, []);

  return null;
}
