import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utils/constants";

// Token storage
let accessToken: string | null = null;
let refreshToken: string | null = null;
let loadPromise: Promise<void> | null = null;

// Load tokens from SecureStore
export const loadTokens = async () => {
  if (accessToken && refreshToken) return;

  // Prevent duplicate loads by returning the ongoing load operation
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    try {
      if (!accessToken) {
        accessToken = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
      }

      if (!refreshToken) {
        refreshToken = await SecureStore.getItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
        );
      }
    } finally {
      loadPromise = null;
    }
  })();

  return loadPromise;
};

// Getters
export const getAccessToken = () => accessToken;
export const getRefreshToken = () => refreshToken;

// Setters
export const setTokens = async (
  newAccessToken: string,
  newRefreshToken?: string,
) => {
  accessToken = newAccessToken;
  await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, newAccessToken);

  if (newRefreshToken) {
    refreshToken = newRefreshToken;
    await SecureStore.setItemAsync(STORAGE_KEYS.REFRESH_TOKEN, newRefreshToken);
  }
};

// Clear
export const clearTokens = async () => {
  accessToken = null;
  refreshToken = null;

  await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
  await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
};

// Profile setup flag (in-memory cache)
let profileSetupCompleted: boolean | null = null;

export const loadProfileSetupCompleted = async () => {
  const stored = await SecureStore.getItemAsync(
    STORAGE_KEYS.PROFILE_SETUP_COMPLETED,
  );
  profileSetupCompleted = stored === "true" ? true : stored === "false" ? false : null;
};

export const getProfileSetupCompleted = () => profileSetupCompleted;

export const setProfileSetupCompleted = async (value: boolean) => {
  profileSetupCompleted = value;
  await SecureStore.setItemAsync(
    STORAGE_KEYS.PROFILE_SETUP_COMPLETED,
    String(value),
  );
};

export const clearProfileSetupCompleted = async () => {
  profileSetupCompleted = null;
  await SecureStore.deleteItemAsync(STORAGE_KEYS.PROFILE_SETUP_COMPLETED);
};
