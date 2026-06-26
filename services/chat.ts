import { AiChatRequest, AiChatResponse } from "@/types";
import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const chatService = {
  sendMessage: async (data: AiChatRequest): Promise<AiChatResponse> => {
    const response = await api.post(ENDPOINTS.conversation.ai, data);
    return response.data;
  },
};
