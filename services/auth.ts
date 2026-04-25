import api from "./api";
import { RegisterData } from "@/types/auth";

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await api.post("/auth/login", { identifier, password });
    return response.data;
  },

  register: async (data: RegisterData) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  verifyOtp: async (identifier: string, value: string) => {
    const response = await api.post("/auth/otp/verify", { identifier, value });
    return response.data;
  },

  forgotPassword: async (identifier: string) => {
    const response = await api.post("/auth/password/forgot", { identifier });
    return response.data;
  },

  verifyResetOtp: async (identifier: string, value: string) => {
    const response = await api.post("/auth/password/verify-reset-otp", {
      identifier,
      value,
    });
    return response.data;
  },

  resetPassword: async (resetToken: string, password: string) => {
    const response = await api.post("/auth/password/reset", {
      resetToken,
      password,
    });
    return response.data;
  },

  refreshToken: async (token: string) => {
    const response = await api.post("/auth/refresh-token", { token });
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get("/auth/profile/meta-data");
    return response.data;
  },
};
