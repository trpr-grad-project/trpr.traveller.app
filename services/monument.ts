import api from "./api";

const MONUMENT_API_URL =
  "https://statue-storyteller.orangecoast-1b665a5f.francecentral.azurecontainerapps.io/chat";

export interface MonumentResponse {
  session_id: string;
  response: string;
  session_alias: string;
  assistant_message: {
    id: number;
    role: string;
    content: string;
    metadata: Record<string, unknown>;
    created_at: string;
    attachments: unknown[];
  };
}

export const monumentService = {
  recognize: async (params: {
    message: string;
    session_id: string;
    imageUri: string;
    mimeType: string;
    fileName: string;
  }): Promise<MonumentResponse> => {
    const formData = new FormData();
    formData.append("message", params.message);
    formData.append("session_id", params.session_id);
    formData.append("image", {
      uri: params.imageUri,
      type: params.mimeType,
      name: params.fileName,
    } as any);

    const response = await api.post<MonumentResponse>(MONUMENT_API_URL, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      timeout: 90000,
    });
    return response.data;
  },
};
