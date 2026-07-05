import { create } from "zustand";

export interface NotificationState {
  connectionState:
    | "disconnected"
    | "connecting"
    | "connected"
    | "reconnecting";
  isConnecting: boolean;
}

export interface NotificationActions {
  setConnectionState: (
    state: NotificationState["connectionState"],
  ) => void;
  setIsConnecting: (isConnecting: boolean) => void;
  reset: () => void;
}

const initialState: NotificationState = {
  connectionState: "disconnected",
  isConnecting: false,
};

export const useNotificationStore = create<
  NotificationState & NotificationActions
>()((set) => ({
  ...initialState,
  setConnectionState: (connectionState) => set({ connectionState }),
  setIsConnecting: (isConnecting) => set({ isConnecting }),
  reset: () => set({ ...initialState }),
}));
