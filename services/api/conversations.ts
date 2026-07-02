import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  ConversationPreview,
  CreateConversationRequest,
  PaginatedConversationsResponse,
} from "@/types";

export const conversationsApi = {
  createConversation: async (
    request: CreateConversationRequest,
  ): Promise<ConversationPreview> => {
    const response = await api.post<ConversationPreview>(
      ENDPOINTS.conversations.base,
      request,
    );
    return response.data;
  },

  getConversations: async (params?: {
    limit?: number;
    cursor?: string;
  }): Promise<PaginatedConversationsResponse> => {
    const query: Record<string, string> = {};
    if (params?.limit !== undefined) query.Limit = String(params.limit);
    if (params?.cursor !== undefined) query.Cursor = params.cursor;

    const response = await api.get<PaginatedConversationsResponse>(
      ENDPOINTS.conversations.base,
      { params: query },
    );
    return response.data;
  },

  getConversation: async (
    conversationId: string,
  ): Promise<ConversationPreview> => {
    const response = await api.get<ConversationPreview>(
      `${ENDPOINTS.conversations.base}/${conversationId}`,
    );
    return response.data;
  },
};
