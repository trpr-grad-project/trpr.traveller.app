import {
  ProfileSetupDataResponse,
  ProfileSetupRequest,
  ProfileSetupResponse,
  ResetPasswordRequest,
} from "@/types";
import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const profileService = {
  getProfileSetupData: async (): Promise<ProfileSetupDataResponse> => {
    const response = await api.get(ENDPOINTS.profile.formData);
    return response.data;
  },

  setupProfile: async (
    data: ProfileSetupRequest,
  ): Promise<ProfileSetupResponse> => {
    const response = await api.post(ENDPOINTS.profile.main, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    data.password = data.password.trim();
    const response = await api.put(ENDPOINTS.profile.resetPassword, data);
    return response.data;
  },
};
