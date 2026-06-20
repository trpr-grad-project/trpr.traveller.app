import {
  ForgetPasswordRequest,
  ForgetPasswordResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyOtpRequest,
} from "@/types";
import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    data.identifier = data.identifier.trim().toLowerCase();
    data.password = data.password.trim();
    const response = await api.post(ENDPOINTS.auth.login, data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<RegisterResponse> => {
    data.identifier = data.identifier.trim().toLowerCase();
    data.password = data.password.trim();
    const response = await api.post(ENDPOINTS.auth.register, data);
    return response.data;
  },

  verifyOtp: async (data: VerifyOtpRequest): Promise<LoginResponse> => {
    const response = await api.post(ENDPOINTS.auth.verifyOtp, data);
    return response.data;
  },

  forgotPassword: async (
    data: ForgetPasswordRequest,
  ): Promise<ForgetPasswordResponse> => {
    data.identifier = data.identifier.trim().toLowerCase();
    const response = await api.post(ENDPOINTS.auth.forgotPassword, data);
    return response.data;
  },
};
