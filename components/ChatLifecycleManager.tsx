import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";
import { isChatInitialized, reconnectChat } from "@/services/chat/initializeChat";
import { chatConnection } from "@/services/signalr/chatConnection";

export default function ChatLifecycleManager() {
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", (nextState: AppStateStatus) => {
      if (appState.current.match(/inactive|background/) && nextState === "active") {
        if (isChatInitialized() && !chatConnection.isConnected()) {
          reconnectChat().catch(console.error);
        }
      }
      appState.current = nextState;
    });

    return () => subscription.remove();
  }, []);

  return null;
}
