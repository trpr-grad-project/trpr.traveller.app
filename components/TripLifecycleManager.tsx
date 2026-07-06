import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  isTripHubInitialized,
  reconnectTripHub,
} from "@/services/trip/initializeTripHub";
import { tripConnection } from "@/services/signalr/tripConnection";

export default function TripLifecycleManager() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      (nextState: AppStateStatus) => {
        if (
          appState.current.match(/inactive|background/) &&
          nextState === "active"
        ) {
          if (
            isTripHubInitialized() &&
            !tripConnection.isConnected()
          ) {
            reconnectTripHub().catch(console.error);
          }
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  return null;
}
