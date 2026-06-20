import {
  create,
  AxiosError,
  AxiosInstance,
  InternalAxiosRequestConfig,
} from "axios";

import { API_URL } from "@/utils/constants";

// In-memory userId — set by AuthContext after storage is loaded.
let _userId: string | null = null;

export const setApiUserId = (id: string | null) => {
  _userId = id;
};

type AuthCallback = () => void;

// Axios Instance
const api: AxiosInstance = create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Auth Callback
let onUnauthenticated: AuthCallback | null = null;

export const setOnUnauthenticated = (callback: AuthCallback) => {
  onUnauthenticated = callback;
};

// Request Interceptor
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (_userId && !config.url?.startsWith("/auth/")) {
      config.headers["X-User-Id"] = _userId;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const url = error.config?.url ?? "";

    if (
      error.response?.status === 401 &&
      _userId &&
      !url.startsWith("/auth/")
    ) {
      onUnauthenticated?.();
    }

    return Promise.reject(error);
  },
);

export default api;
