import { chatSync } from "./chatSync";

export function handleUserConnected(_payload: string): void {
}

export function handleReceiveMessage(message: unknown): void {
  chatSync.handleReceiveMessage(message).catch((error) => {
    console.error("Failed to handle receive message", error);
  });
}

export async function handleNewChatCreated(payload: { id: string }): Promise<void> {
  if (!payload?.id) return;
  await chatSync.syncConversationMessages(payload.id);
}

export function handleReconnected(): void {
  chatSync.syncConversations().catch((error) => {
    console.error("SignalR reconnect sync failed", error);
  });
  chatSync.processPendingMessages().catch((error) => {
    console.error("Failed to process pending messages", error);
  });
}
