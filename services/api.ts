import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Platform-specific API URL
const getApiUrl = () => {
  if (Platform.OS === "android") {
    return "http://192.168.100.6:5001/api/v1";
  }
  return "http://localhost:5001/api/v1";
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to request headers
api.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);

let isRefreshing = false;
let pendingPromises: any[] = [];

const handlePendingPromises = (error: any, token: string | null = null) => {
  pendingPromises.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  pendingPromises = [];
};

// Allowing AuthContext to be notified when the user must be logged out
type AuthCallback = () => void;
let onUnauthenticated: AuthCallback | null = null;

export const setOnUnauthenticated = (callback: AuthCallback) => {
  onUnauthenticated = callback;
};

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          pendingPromises.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return api(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await SecureStore.getItemAsync("refresh_token");

        if (refreshToken) {
          const response = await axios.post(`${API_URL}/auth/refresh-token`, {
            token: refreshToken,
          });

          const { accessToken, refreshToken: newRefreshToken } = response.data;

          if (accessToken) {
            await SecureStore.setItemAsync("access_token", accessToken);
            if (newRefreshToken) {
              await SecureStore.setItemAsync("refresh_token", newRefreshToken);
            }

            api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;

            handlePendingPromises(null, accessToken);
            return api(originalRequest);
          }
        }

        // No refresh token or no access token in response
        if (onUnauthenticated) {
          onUnauthenticated();
        }
        return Promise.reject(error);
      } catch (refreshError) {
        handlePendingPromises(refreshError, null);
        if (onUnauthenticated) {
          onUnauthenticated();
        }
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    return Promise.reject(error);
  },
);

export default api;
