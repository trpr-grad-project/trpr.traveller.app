import { Platform } from "react-native";

// Platform-specific API URL
export const API_URL = Platform.select({
  android: "http://192.168.100.6:5001/api/v1",
  ios: "http://localhost:5001/api/v1",
  default: "http://localhost:5001/api/v1",
});

// Storage Keys
export const STORAGE_KEYS = {
  ACCESS_TOKEN: "access_token",
  REFRESH_TOKEN: "refresh_token",
  PROFILE_SETUP_COMPLETED: "profile_setup_completed",
} as const;