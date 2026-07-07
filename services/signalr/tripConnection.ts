import * as signalR from "@microsoft/signalr";
import { API_URL } from "@/utils/constants";
import { useTripHubStore } from "@/store/tripHubStore";
import { useLocationStore } from "@/store/locationStore";
import { handleReceiveTripsToday } from "@/services/trip/tripHubEvents";
import { tripLocationSync } from "@/services/trip/tripLocationSync";

export class TripConnection {
  private connection: signalR.HubConnection | null = null;
  private userId: string | null = null;
  private initialized = false;

  async initialize(userId: string): Promise<void> {
    if (this.initialized && this.userId === userId && this.isConnected()) {
      console.log("Trip connection already initialized");
      return;
    }

    console.log("Trip connection initialization started");
    await this.connect(userId);
    this.initialized = true;
    console.log("Trip connection initialization completed");
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
      console.log("SignalR trip reconnecting", error?.message);
      useTripHubStore.getState().setConnectionState("reconnecting");
      useLocationStore.getState().setConnectionState("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR trip reconnected", connectionId);
      useTripHubStore.getState().setConnectionState("connected");
      useLocationStore.getState().setConnectionState("connected");
    });

    this.connection.onclose((error) => {
      console.log("SignalR trip closed", error?.message);
      useTripHubStore.getState().setConnectionState("disconnected");
      useLocationStore.getState().setConnectionState("disconnected");
    });

    this.registerListeners();

    console.log("SignalR trip connecting...");
    await this.connection.start();
    console.log("SignalR trip connected");
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

    console.log("SignalR trip listeners registered");
  }

  async sendLocation(
    tripId: string,
    latitude: number,
    longitude: number,
  ): Promise<void> {
    if (!this.connection || !this.isConnected()) {
      console.log("SendLocation skipped: not connected");
      return;
    }

    try {
      await this.connection.invoke("UpdateLocation", {
        tripId,
        latitude,
        longitude,
      });
    } catch (error) {
      console.error("Failed to send location", error);
    }
  }

  async disconnect(): Promise<void> {
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
