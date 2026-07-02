import { Platform } from "react-native";

// Platform-specific API URL
const REMOTE_URL = process.env.EXPO_PUBLIC_API_URL_REMOTE;
const LOCAL_URL =
  process.env.EXPO_PUBLIC_API_URL_LOCAL || "http://localhost:5000/users/api/v1";

export const API_URL = Platform.select({
  android: REMOTE_URL || "http://10.0.2.2:5000/users/api/v1",
  ios: LOCAL_URL,
  default: LOCAL_URL,
});

// Storage Keys
export const STORAGE_KEYS = {
  USER_ID: "user_id",
  PROFILE_SETUP_COMPLETED: "profile_setup_completed",
  COLOR_SCHEME: "color_scheme",
  USER_FIRST_NAME: "user_first_name",
  USER_LAST_NAME: "user_last_name",
  USER_EMAIL: "user_email",
} as const;
