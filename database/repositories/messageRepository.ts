import type { MessageItem } from "@/types";

export interface IMessageRepository {
  insertMessage(message: MessageItem): Promise<void>;
  insertManyMessages(messages: MessageItem[]): Promise<void>;
  messageExists(id: string): Promise<boolean>;
  findMessagesByConversation(conversationId: string): Promise<MessageItem[]>;
  findRecentMessagesByConversation(
    conversationId: string,
    limit: number,
  ): Promise<MessageItem[]>;
  findMessagesBeforeSequence(
    conversationId: string,
    beforeSequence: string,
    limit: number,
  ): Promise<MessageItem[]>;
  findMessage(id: string): Promise<MessageItem | null>;
  deleteConversationMessages(conversationId: string): Promise<void>;
  clearMessages(): Promise<void>;
  getLastSequence(conversationId: string): Promise<string | null>;
  getHighestSequence(conversationId: string): Promise<string | null>;
  getMessageCount(conversationId: string): Promise<number>;
}
