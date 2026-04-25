import axios, {
  AxiosError,
  AxiosInstance,
  AxiosRequestConfig,
  InternalAxiosRequestConfig,
} from "axios";

import { API_URL } from "@/utils/constants";
import {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
} from "@/utils/storage";

// Types
interface CustomAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean;
}

type PendingRequest = {
  resolve: (token: string | null) => void;
  reject: (error: unknown) => void;
};

type AuthCallback = () => void;
type TokenRefreshCallback = (token: string) => void;

// Axios Instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

const isAuthRoute = (url?: string) => url?.startsWith("/auth/") ?? false;

// Auth Callback
let onUnauthenticated: AuthCallback | null = null;

export const setOnUnauthenticated = (callback: AuthCallback) => {
  onUnauthenticated = callback;
};

let onTokenRefresh: TokenRefreshCallback | null = null;

export const setOnTokenRefresh = (callback: TokenRefreshCallback) => {
  onTokenRefresh = callback;
};

// Refresh Control
let isRefreshing = false;
let pendingPromises: PendingRequest[] = [];

const processQueue = (error: unknown, token: string | null = null) => {
  pendingPromises.forEach((prom) => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  pendingPromises = [];
};

// Request Interceptor
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getAccessToken();

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,

  async (error: AxiosError) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;

    if (!error.response) {
      return Promise.reject(error); // network error
    }

    if (isAuthRoute(originalRequest.url)) {
      return Promise.reject(error);
    }

    // Only handle 401
    if (error.response.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise<string | null>((resolve, reject) => {
        pendingPromises.push({ resolve, reject });
      })
        .then((token) => {
          (originalRequest.headers as any).Authorization = `Bearer ${token}`;
          return api(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        throw new Error("No refresh token");
      }

      const response = await axios.post(`${API_URL}/auth/refresh-token`, {
        token: refreshToken,
      });

      const { accessToken, refreshToken: newRefreshToken } = response.data;

      if (!accessToken) {
        throw new Error("Invalid refresh response");
      }

      await setTokens(accessToken, newRefreshToken);
      onTokenRefresh?.(accessToken);
      processQueue(null, accessToken);

      if (originalRequest.headers) {
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
      }

      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError, null);

      await clearTokens();
      onUnauthenticated?.();

      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  },
);

export default api;
