import type {
  ProfileMyProfileResponse,
  ProfileSetupDataResponse,
  ProfileSetupRequest,
  ProfileSetupResponse,
  ProfileUpdateRequest,
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

  getProfile: async (): Promise<ProfileSetupResponse> => {
    const response = await api.get<ProfileMyProfileResponse>(
      ENDPOINTS.profile.myProfile,
    );
    const d = response.data;
    return {
      id: d.profile.id,
      bio: d.profile.bio,
      languages: d.profile.languages,
      interests: d.profile.interests,
      vibes: d.profile.vibes,
      notificationSettings: {
        tripUpdates: null,
        messages: null,
        promotions: null,
      },
    };
  },

  updateProfile: async (
    data: ProfileUpdateRequest,
  ): Promise<ProfileSetupResponse> => {
    const response = await api.put(ENDPOINTS.profile.main, data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest): Promise<void> => {
    data.password = data.password.trim();
    const response = await api.put(ENDPOINTS.profile.resetPassword, data);
    return response.data;
  },

  getProfileById: async (id: string): Promise<ProfileMyProfileResponse> => {
    const response = await api.get(`${ENDPOINTS.profile.byId}${id}`);
    return response.data;
  },
};
