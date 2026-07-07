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
    const hubUrl = `${new URL(API_URL).origin}/notification-hub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        headers: { "X-User-Id": userId },
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnecting((error) => {
      useNotificationStore.getState().setConnectionState("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      useNotificationStore.getState().setConnectionState("connected");
      handleReconnected();
    });

    this.connection.onclose((error) => {
      useNotificationStore.getState().setConnectionState("disconnected");
    });

    this.registerListeners();

    await this.connection.start();
  }

  private registerListeners(): void {
    if (!this.connection) return;

    this.connection.off("ReceiveNotification");
    this.connection.on("ReceiveNotification", (payload: unknown) => {
      handleReceiveNotification(payload);
    });
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
