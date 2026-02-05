import api from "./api";

export const authService = {
  login: async (identifier: string, password: string) => {
    const response = await api.post("/auth/login", { identifier, password });
    return response.data;
  },

  register: async (data: {
    identifier: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    const response = await api.post("/auth/register", data);
    return response.data;
  },

  verifyOtp: async (identifier: string, value: string) => {
    // identifier here is the otpId returned from register
    const response = await api.post("/auth/otp/verify", { identifier, value });
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
