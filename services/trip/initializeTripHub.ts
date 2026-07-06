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
    console.log("Trip hub initialization already initialized");
    return;
  }

  if (_initializing) {
    console.log("Trip hub initialization already in progress");
    return _initializing;
  }

  console.log("Trip hub initialization started");

  const userId = getUserId();
  if (!userId) {
    console.log("Trip hub initialization skipped: no user");
    return;
  }

  _initializing = (async () => {
    useTripHubStore.getState().setIsConnecting(true);
    useTripHubStore.getState().setConnectionState("connecting");

    try {
      await tripConnection.initialize(userId);
      _initialized = true;
      useTripHubStore.getState().setConnectionState("connected");
      console.log("Trip hub initialization complete");
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
    console.log("Trip hub reconnect skipped: no user or not initialized");
    return;
  }

  if (tripConnection.isConnected()) {
    console.log("Trip hub reconnect skipped: already connected");
    return;
  }

  console.log("Trip hub foreground reconnect attempt");

  useTripHubStore.getState().setConnectionState("connecting");
  useTripHubStore.getState().setIsConnecting(true);

  try {
    await tripConnection.initialize(userId);
    useTripHubStore.getState().setConnectionState("connected");
    console.log("Trip hub foreground reconnect complete");
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
    console.log("Trip hub refresh skipped: no user");
    return;
  }
  console.log("Trip hub refresh: disconnecting and reconnecting");
  useTripHubStore.getState().setConnectionState("connecting");
  useTripHubStore.getState().setIsConnecting(true);
  try {
    await tripConnection.disconnect();
    resetTripHubInitialization();
    await tripConnection.initialize(userId);
    _initialized = true;
    useTripHubStore.getState().setConnectionState("connected");
    console.log("Trip hub refresh complete");
  } catch (error) {
    useTripHubStore.getState().setConnectionState("disconnected");
    console.error("Trip hub refresh failed", error);
  } finally {
    useTripHubStore.getState().setIsConnecting(false);
  }
}

export async function disconnectTripHub(): Promise<void> {
  console.log("Trip hub logout cleanup");
  _initializing = null;
  await tripConnection.disconnect();
  resetTripHubInitialization();
  useTripHubStore.getState().setConnectionState("disconnected");
}
