import * as signalR from "@microsoft/signalr";
import { API_URL } from "@/utils/constants";
import { useTripHubStore } from "@/store/tripHubStore";
import { useLocationStore } from "@/store/locationStore";
import { handleReceiveTripsToday } from "@/services/trip/tripHubEvents";
import { tripLocationSync } from "@/services/trip/tripLocationSync";
import { tripService } from "@/services/trips";

export class TripConnection {
  private connection: signalR.HubConnection | null = null;
  private userId: string | null = null;
  private initialized = false;
  private locationInterval: ReturnType<typeof setInterval> | null = null;
  private readonly DEFAULT_INTERVAL_MS = 10000;

  async initialize(userId: string): Promise<void> {
    if (this.initialized && this.userId === userId && this.isConnected()) {
      return;
    }

    await this.connect(userId);
    this.initialized = true;
  }

  async connect(userId: string): Promise<void> {
    if (
      this.connection?.state === signalR.HubConnectionState.Connected &&
      this.userId === userId
    ) {
      return;
    }

    if (this.connection) {
      await this.connection.stop();
    }

    this.userId = userId;
    const hubUrl = `${new URL(API_URL).origin}/trip-hub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        headers: { "X-User-Id": userId },
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnecting((error) => {
      useTripHubStore.getState().setConnectionState("reconnecting");
      useLocationStore.getState().setConnectionState("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      useTripHubStore.getState().setConnectionState("connected");
      useLocationStore.getState().setConnectionState("connected");
      this.startPeriodicLocationSend();
    });

    this.connection.onclose((error) => {
      useTripHubStore.getState().setConnectionState("disconnected");
      useLocationStore.getState().setConnectionState("disconnected");
      this.stopPeriodicLocationSend();
    });

    this.registerListeners();

    await this.connection.start();

    this.startPeriodicLocationSend();
  }

  private registerListeners(): void {
    if (!this.connection) return;

    this.connection.off("TripsToday");
    this.connection.on("TripsToday", (payload: unknown) => {
      handleReceiveTripsToday(payload);
    });

    this.connection.off("LocationUpdated");
    this.connection.on("LocationUpdated", (payload: unknown) => {
      tripLocationSync.handleLocationUpdated(payload).catch(console.error);
    });
  }

  async sendLocation(
    tripIds: string[],
    latitude: number,
    longitude: number,
  ): Promise<void> {
    if (tripIds.length === 0) return;

    try {
      await Promise.all(
        tripIds.map((tripId) =>
          tripService.sendLocationAPI(tripId, latitude, longitude),
        ),
      );
    } catch (error) {
      console.error("Failed to send location", error);
    }
  }

  private getStartedTripIds(): string[] {
    return useTripHubStore
      .getState()
      .tripsToday.filter((t) => t.status === "Started")
      .map((t) => t.id);
  }

  private getCurrentCoords(): { lat: number; lng: number } | null {
    const { currentLatitude, currentLongitude } = useLocationStore.getState();
    if (currentLatitude != null && currentLongitude != null) {
      return { lat: currentLatitude, lng: currentLongitude };
    }
    return null;
  }

  startPeriodicLocationSend(intervalMs?: number): void {
    if (this.locationInterval) return;

    this.locationInterval = setInterval(() => {
      this.sendLocationsForStartedTrips();
    }, intervalMs ?? this.DEFAULT_INTERVAL_MS);

    this.sendLocationsForStartedTrips();
  }

  stopPeriodicLocationSend(): void {
    if (this.locationInterval) {
      clearInterval(this.locationInterval);
      this.locationInterval = null;
    }
  }

  private sendLocationsForStartedTrips(): void {
    const tripsIds = this.getStartedTripIds();
    if (tripsIds.length === 0) return;

    const { gpsError } = useLocationStore.getState();
    if (gpsError) {
      return;
    }

    const coords = this.getCurrentCoords();
    if (!coords) {
      return;
    }

    this.sendLocation(tripsIds, coords.lat, coords.lng);
  }

  async disconnect(): Promise<void> {
    this.stopPeriodicLocationSend();
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = null;
    this.userId = null;
    this.initialized = false;
  }

  isConnected(): boolean {
    return this.connection?.state === signalR.HubConnectionState.Connected;
  }

  getConnection(): signalR.HubConnection | null {
    return this.connection;
  }
}

export const tripConnection = new TripConnection();
