import { chatSync } from "./chatSync";

export function handleUserConnected(payload: string): void {
  console.log("UserConnected event received", payload);
}

export function handleReceiveMessage(message: unknown): void {
  console.log("ReceiveMessage received, forwarding to synchronization");
  chatSync.handleReceiveMessage(message).catch((error) => {
    console.error("Failed to handle receive message", error);
  });
}

export async function handleNewChatCreated(payload: { id: string }): Promise<void> {
  if (!payload?.id) return;
  console.log("New chat created, syncing conversation", payload.id);
  await chatSync.syncConversationMessages(payload.id);
}

export function handleReconnected(): void {
  console.log("SignalR reconnected, syncing conversations");
  chatSync.syncConversations().catch((error) => {
    console.error("SignalR reconnect sync failed", error);
  });
  chatSync.processPendingMessages().catch((error) => {
    console.error("Failed to process pending messages", error);
  });
}
