import * as signalR from "@microsoft/signalr";
import { API_URL } from "@/utils/constants";
import { useP2pChatStore } from "@/store/chatStore";
import {
  handleReceiveMessage,
  handleUserConnected,
  handleReconnected,
} from "@/services/chat/chatEvents";

export class ChatConnection {
  private connection: signalR.HubConnection | null = null;
  private userId: string | null = null;
  private initialized = false;

  async initialize(userId: string): Promise<void> {
    if (this.initialized && this.userId === userId && this.isConnected()) {
      console.log("Chat connection already initialized");
      return;
    }

    console.log("Chat connection initialization started");
    await this.connect(userId);
    this.initialized = true;
    console.log("Chat connection initialization completed");
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
    const hubUrl = `${new URL(API_URL).origin}/chat-hub`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        headers: { "X-User-Id": userId },
      })
      .withAutomaticReconnect()
      .build();

    this.connection.onreconnecting((error) => {
      console.log("SignalR reconnecting", error?.message);
      useP2pChatStore.getState().setConnectionState("reconnecting");
    });

    this.connection.onreconnected((connectionId) => {
      console.log("SignalR reconnected", connectionId);
      useP2pChatStore.getState().setConnectionState("connected");
      handleReconnected();
    });

    this.connection.onclose((error) => {
      console.log("SignalR closed", error?.message);
      useP2pChatStore.getState().setConnectionState("disconnected");
    });

    this.registerListeners();

    console.log("SignalR connecting...");
    await this.connection.start();
    console.log("SignalR connected");
  }

  private registerListeners(): void {
    if (!this.connection) return;

    this.connection.off("UserConnected");
    this.connection.on("UserConnected", (payload: string) => {
      console.log("UserConnected event received", payload);
      handleUserConnected(payload);
    });

    this.connection.off("ReceiveMessage");
    this.connection.on("ReceiveMessage", (payload: unknown) => {
      console.log("ReceiveMessage received, forwarding to sync");
      handleReceiveMessage(payload);
    });

    console.log("SignalR listeners registered");
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

export const chatConnection = new ChatConnection();
