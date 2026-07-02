import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type {
  MessageItem,
  SendMessageRequest,
  PaginatedMessagesResponse,
} from "@/types";

export const messagesApi = {
  sendMessage: async (
    conversationId: string,
    request: SendMessageRequest,
  ): Promise<MessageItem> => {
    const response = await api.post<MessageItem>(
      `${ENDPOINTS.conversations.base}/${conversationId}`,
      request,
    );
    return response.data;
  },

  getMessages: async (params: {
    conversationId: string;
    limit?: number;
    afterSequence?: string;
  }): Promise<PaginatedMessagesResponse> => {
    const query: Record<string, string> = {};
    if (params.limit !== undefined) query.Limit = String(params.limit);
    if (params.afterSequence !== undefined)
      query.AfterSequence = params.afterSequence;

    const response = await api.get<PaginatedMessagesResponse>(
      `${ENDPOINTS.conversations.base}/${params.conversationId}/messages`,
      { params: query },
    );
    return response.data;
  },
};
