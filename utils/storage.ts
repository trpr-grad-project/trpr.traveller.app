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

// User data storage (name, email persisted for display after refresh)
let userFirstName: string | null = null;
let userLastName: string | null = null;
let userEmail: string | null = null;

export const loadUserData = async () => {
  userFirstName = await SecureStore.getItemAsync(STORAGE_KEYS.USER_FIRST_NAME);
  userLastName = await SecureStore.getItemAsync(STORAGE_KEYS.USER_LAST_NAME);
  userEmail = await SecureStore.getItemAsync(STORAGE_KEYS.USER_EMAIL);
};

export const getUserData = () => ({
  firstName: userFirstName ?? "",
  lastName: userLastName ?? "",
  email: userEmail ?? "",
});

export const setUserData = async (data: {
  firstName: string;
  lastName: string;
  email: string;
}) => {
  userFirstName = data.firstName;
  userLastName = data.lastName;
  userEmail = data.email;
  await Promise.all([
    SecureStore.setItemAsync(STORAGE_KEYS.USER_FIRST_NAME, data.firstName),
    SecureStore.setItemAsync(STORAGE_KEYS.USER_LAST_NAME, data.lastName),
    SecureStore.setItemAsync(STORAGE_KEYS.USER_EMAIL, data.email),
  ]);
};

export const clearUserData = async () => {
  userFirstName = null;
  userLastName = null;
  userEmail = null;
  await Promise.all([
    SecureStore.deleteItemAsync(STORAGE_KEYS.USER_FIRST_NAME),
    SecureStore.deleteItemAsync(STORAGE_KEYS.USER_LAST_NAME),
    SecureStore.deleteItemAsync(STORAGE_KEYS.USER_EMAIL),
  ]);
};
