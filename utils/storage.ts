import * as SecureStore from "expo-secure-store";
import { STORAGE_KEYS } from "@/utils/constants";

// User ID storage
let userId: string | null = null;

export const loadUserId = async () => {
  userId = await SecureStore.getItemAsync(STORAGE_KEYS.USER_ID);
};

export const getUserId = () => userId;

export const setUserId = async (id: string) => {
  userId = id;
  await SecureStore.setItemAsync(STORAGE_KEYS.USER_ID, id);
};

export const clearUserId = async () => {
  userId = null;
  await SecureStore.deleteItemAsync(STORAGE_KEYS.USER_ID);
};

// Profile setup flag
let profileSetupCompleted: boolean | null = null;

export const loadProfileSetupCompleted = async () => {
  const stored = await SecureStore.getItemAsync(
    STORAGE_KEYS.PROFILE_SETUP_COMPLETED,
  );
  profileSetupCompleted =
    stored === "true" ? true : stored === "false" ? false : null;
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

// Color scheme preference
let colorScheme: string | null = null;

export const loadColorScheme = async () => {
  colorScheme = await SecureStore.getItemAsync(STORAGE_KEYS.COLOR_SCHEME);
};

export const getColorScheme = () => colorScheme;

export const saveColorScheme = async (scheme: "light" | "dark") => {
  colorScheme = scheme;
  await SecureStore.setItemAsync(STORAGE_KEYS.COLOR_SCHEME, scheme);
};
