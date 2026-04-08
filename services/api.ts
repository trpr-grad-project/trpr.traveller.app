import { STORAGE_KEYS } from "@/utils/constants";
import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Platform-specific API URL
export const API_URL =
  Platform.OS === "android"
    ? "http://192.168.100.6:5001/api/v1"
    : "http://localhost:5001/api/v1";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: attach access token
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

let isRefreshing = false;

let pendingPromises: {
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}[] = [];

const handlePendingPromises = (error: unknown, token: string | null = null) => {
  pendingPromises.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  pendingPromises = [];
};

// Unauthenticated callback (set by AuthContext)
type AuthCallback = () => void;
let onUnauthenticated: AuthCallback | null = null;

export const setOnUnauthenticated = (callback: AuthCallback) => {
  onUnauthenticated = callback;
};

// Response interceptor: handle 401 + token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          pendingPromises.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
        );

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            token: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          if (accessToken) {
            await SecureStore.setItemAsync(
              STORAGE_KEYS.ACCESS_TOKEN,
              accessToken,
            );

            if (newRefreshToken) {
              await SecureStore.setItemAsync(
                STORAGE_KEYS.REFRESH_TOKEN,
                newRefreshToken,
              );
            }

            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            handlePendingPromises(null, accessToken);
            return api(originalRequest);
          }
        }

        // No refresh token or no new access token
        onUnauthenticated?.();
        return Promise.reject(error);
      } catch (refreshError) {
        handlePendingPromises(refreshError, null);
        onUnauthenticated?.();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

export default api;
