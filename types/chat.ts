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
