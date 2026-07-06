export interface Message {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
  pending?: boolean;
  failed?: boolean;
}

export interface Conversation {
  id: string;
  title: string;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface AiChatRequest {
  conversationId: string | null;
  prompt: string;
}

export interface AiChatResponse {
  id: string;
  conversationId: string;
  senderUserId: string | null;
  content: string;
}

// ─── P2P Chat Types ────────────────────────────────────────────

export interface ConversationLastMessage {
  id: string;
  sequenceNumber: string;
  text: string;
  senderId: string | null;
  sentAt: string;
}

export interface ConversationPreview {
  id: string;
  title: string | null;
  imageUrl: string | null;
  tripId?: string;
  lastMessage: ConversationLastMessage | null;
  lastReadSequence: string;
  unreadCount: string;
}

export interface MessageItem {
  id: string;
  sequenceNumber: string;
  content: string;
  senderUserId: string | null;
  sentAtUtc: string;
  conversationId: string;
  isPending?: boolean;
}

export interface CreateConversationRequest {
  title: string | null;
  imageUrl: string | null;
  participantUserIds: string[];
}

export interface SendMessageRequest {
  messageContent: string;
}

export interface PaginatedConversationsResponse {
  items: ConversationPreview[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface PaginatedMessagesResponse {
  items: MessageItem[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export interface PendingMessage {
  id: string;
  conversationId: string;
  content: string;
  senderUserId: string | null;
  createdAt: string;
  retryCount: number;
  lastError: string | null;
}
