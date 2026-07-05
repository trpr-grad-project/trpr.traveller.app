import * as signalR from "@microsoft/signalr";
import { API_URL } from "@/utils/constants";
import { useNotificationStore } from "@/store/notificationStore";
import {
  handleReceiveNotification,
  handleReconnected,
} from "@/services/notification/notificationEvents";

export class NotificationConnection {
  private connection: signalR.HubConnection | null = null;
  private userId: string | null = null;
  private initialized = false;

  async initialize(userId: string): Promise<void> {
    if (this.initialized && this.userId === userId && this.isConnected()) {
      console.log("Notification connection already initialized");
      return;
    }

    console.log("Notification connection initialization started");
    await this.connect(userId);
    this.initialized = true;
    console.log("Notification connection initialization completed");
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
    const hubUrl = `${new URL(API_URL).origin}/notification-hub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        headers: { "X-User-Id": userId },
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnecting((error) => {
      console.log("SignalR notification reconnecting", error?.message);
      useNotificationStore.getState().setConnectionState("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR notification reconnected", connectionId);
      useNotificationStore.getState().setConnectionState("connected");
      handleReconnected();
    });

    this.connection.onclose((error) => {
      console.log("SignalR notification closed", error?.message);
      useNotificationStore.getState().setConnectionState("disconnected");
    });

    this.registerListeners();

    console.log("SignalR notification connecting...");
    await this.connection.start();
    console.log("SignalR notification connected");
  }

  private registerListeners(): void {
    if (!this.connection) return;

    this.connection.off("ReceiveNotification");
    this.connection.on("ReceiveNotification", (payload: unknown) => {
      handleReceiveNotification(payload);
    });

    console.log("SignalR notification listeners registered");
  }

  async disconnect(): Promise<void> {
    if (!this.connection) return;
    await this.connection.stop();
    this.connection = null;
    this.userId = null;
    this.initialized = false;
  }

  isConnected(): boolean {
    return (
      this.connection?.state === signalR.HubConnectionState.Connected
    );
  }

  getConnection(): signalR.HubConnection | null {
    return this.connection;
  }
}

export const notificationConnection = new NotificationConnection();
