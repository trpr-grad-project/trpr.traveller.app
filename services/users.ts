import api from "@/services/api";
import { ENDPOINTS } from "@/services/endpoints";
import { User } from "@/types";

type UserResponseItem = {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  profile?: {
    bio?: string;
    languages?: unknown[];
    interests?: unknown[];
    vibes?: unknown[];
  };
};

export const usersService = {
  getAll: async (): Promise<User[]> => {
    const response = await api.get<{
      items: UserResponseItem[];
      page: number;
      pageSize: number;
      totalItems: number;
      totalPages: number;
    }>(ENDPOINTS.users.all, {
      headers: { "X-User-Role": '["Admin"]' },
    });

    return (response.data.items ?? []).map((item) => ({
      id: item.id,
      email: item.userName,
      firstName: item.firstName,
      lastName: item.lastName,
    }));
  },
};
