import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import {
  isNotificationInitialized,
  reconnectNotifications,
} from "@/services/notification/initializeNotification";
import { notificationConnection } from "@/services/signalr/notificationConnection";

export default function NotificationLifecycleManager() {
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
            isNotificationInitialized() &&
            !notificationConnection.isConnected()
          ) {
            reconnectNotifications().catch(console.error);
          }
        }
        appState.current = nextState;
      },
    );

    return () => subscription.remove();
  }, []);

  return null;
}
