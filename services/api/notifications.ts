import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import type { PaginatedNotificationsResponse } from "@/types";

export const notificationsApi = {
  getNotifications: async (params?: {
    pageSize?: number;
    lastNotificationId?: string;
  }): Promise<PaginatedNotificationsResponse> => {
    const query: Record<string, string> = {};
    if (params?.pageSize !== undefined)
      query.PageSize = String(params.pageSize);
    if (params?.lastNotificationId !== undefined)
      query.LastNotificationId = params.lastNotificationId;

    const response = await api.get<PaginatedNotificationsResponse>(
      ENDPOINTS.notifications,
      { params: query },
    );
    return response.data;
  },
};
