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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    // Handle 401 Unauthorized (Refresh Token Logic could go here)
    if (error.response?.status === 401) {
      // For now, simpler logic: just reject.
      // In a real app, we might try to refresh the token here.
    }
    return Promise.reject(error);
  },
);

export default api;
