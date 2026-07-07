import { tripConnection } from "@/services/signalr/tripConnection";
import { useTripHubStore } from "@/store/tripHubStore";
import { getUserId } from "@/utils/storage";

let _initialized = false;
let _initializing: Promise<void> | null = null;

export function isTripHubInitialized(): boolean {
  return _initialized;
}

export function resetTripHubInitialization(): void {
  _initialized = false;
}

export async function initializeTripHub(): Promise<void> {
  if (_initialized) {
    return;
  }

  if (_initializing) {
    return _initializing;
  }

  const userId = getUserId();
  if (!userId) {
    return;
  }

  _initializing = (async () => {
    useTripHubStore.getState().setIsConnecting(true);
    useTripHubStore.getState().setConnectionState("connecting");

    try {
      await tripConnection.initialize(userId);
      _initialized = true;
      useTripHubStore.getState().setConnectionState("connected");
    } catch (error) {
      useTripHubStore.getState().setConnectionState("disconnected");
      console.error("Trip hub initialization failed", error);
      throw error;
    } finally {
      useTripHubStore.getState().setIsConnecting(false);
      _initializing = null;
    }
  })();

  return _initializing;
}

export async function reconnectTripHub(): Promise<void> {
  const userId = getUserId();
  if (!userId || !_initialized) {
    return;
  }

  if (tripConnection.isConnected()) {
    return;
  }

  useTripHubStore.getState().setConnectionState("connecting");
  useTripHubStore.getState().setIsConnecting(true);

  try {
    await tripConnection.initialize(userId);
    useTripHubStore.getState().setConnectionState("connected");
  } catch (error) {
    useTripHubStore.getState().setConnectionState("disconnected");
    console.error("Trip hub foreground reconnect failed", error);
  } finally {
    useTripHubStore.getState().setIsConnecting(false);
  }
}

export async function refreshTripsToday(): Promise<void> {
  const userId = getUserId();
  if (!userId) {
    return;
  }
  useTripHubStore.getState().setConnectionState("connecting");
  useTripHubStore.getState().setIsConnecting(true);
  try {
    await tripConnection.disconnect();
    resetTripHubInitialization();
    await tripConnection.initialize(userId);
    _initialized = true;
    useTripHubStore.getState().setConnectionState("connected");
  } catch (error) {
    useTripHubStore.getState().setConnectionState("disconnected");
    console.error("Trip hub refresh failed", error);
  } finally {
    useTripHubStore.getState().setIsConnecting(false);
  }
}

export async function disconnectTripHub(): Promise<void> {
  _initializing = null;
  await tripConnection.disconnect();
  resetTripHubInitialization();
  useTripHubStore.getState().setConnectionState("disconnected");
}
