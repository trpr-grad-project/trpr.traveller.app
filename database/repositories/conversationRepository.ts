import type { ConversationPreview } from "@/types";

export interface IConversationRepository {
  insertOrUpdateConversation(conversation: ConversationPreview): Promise<void>;
  insertOrUpdateMany(conversations: ConversationPreview[]): Promise<void>;
  findConversation(id: string): Promise<ConversationPreview | null>;
  findAllConversations(): Promise<ConversationPreview[]>;
  updateConversation(
    id: string,
    updates: Partial<ConversationPreview>,
  ): Promise<void>;
  deleteConversation(id: string): Promise<void>;
  clearConversations(): Promise<void>;
  getLastSequence(): Promise<string | null>;
  updateUnreadCount(id: string, count: string): Promise<void>;
  updateLastReadSequence(id: string, sequence: string): Promise<void>;
  updateLastMessage(
    id: string,
    message: ConversationPreview["lastMessage"],
  ): Promise<void>;
  updateTripId(id: string, tripId: string): Promise<void>;
}
