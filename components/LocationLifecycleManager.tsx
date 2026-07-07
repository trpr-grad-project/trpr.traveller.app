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
  const isWatchingRef = useRef(false);

  useEffect(() => {
    const tripsToday = useTripHubStore.getState().tripsToday;
    if (tripsToday.some((t) => t.status === "Started")) {
      isWatchingRef.current = true;
      useLocationStore.getState().setActiveTripId(tripsToday[0].id);
      startLocationSharing(tripsToday[0].id).catch(console.error);
    }

    const unsubTrips = useTripHubStore.subscribe((state) => {
      const hasStarted = state.tripsToday.some((t) => t.status === "Started");
      if (hasStarted && !isWatchingRef.current) {
        isWatchingRef.current = true;
        useLocationStore.getState().setActiveTripId(state.tripsToday[0].id);
        startLocationSharing(state.tripsToday[0].id).catch(console.error);
      } else if (!hasStarted && isWatchingRef.current) {
        isWatchingRef.current = false;
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
          }
          const tripsToday = useTripHubStore.getState().tripsToday;
          if (tripsToday.some((t) => t.status === "Started") && !isWatchingRef.current) {
            isWatchingRef.current = true;
            useLocationStore.getState().setActiveTripId(tripsToday[0].id);
            startLocationSharing(tripsToday[0].id).catch(console.error);
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
