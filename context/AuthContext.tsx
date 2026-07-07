import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { setDatabaseUser } from "@/database/database";
import {
  authService,
  profileService,
  setOnUnauthenticated,
  setApiUserId,
} from "@/services";
import { useP2pChatStore, setChatUserId } from "@/store/chatStore";
import { useTripDraftStore } from "@/store/tripCreation";
import { usePlaceDraftStore } from "@/store/placeDraft";
import { useLocationStore } from "@/store/locationStore";
import { useTripHubStore } from "@/store/tripHubStore";
import { useNotificationStore } from "@/store/notificationStore";
import { usePendingJoins } from "@/store/pendingJoins";
import { queryClient } from "@/providers/query-provider";
import { clearQueue } from "@/utils/offlineQueue";
import { initializeChat, disconnectChat } from "@/services/chat/initializeChat";
import {
  initializeNotifications,
  disconnectNotifications,
} from "@/services/notification/initializeNotification";
import {
  initializeTripHub,
  disconnectTripHub,
} from "@/services/trip/initializeTripHub";
import { LoginResponse, RegisterRequest, User } from "@/types";
import {
  clearProfileSetupCompleted,
  clearUserData,
  getProfileSetupCompleted,
  getUserData,
  loadLastSeenSequenceNumber,
  loadProfileSetupCompleted,
  loadUserData,
  setProfileSetupCompleted,
  setUserData,
  clearUserId,
  getUserId,
  loadUserId,
  setUserId,
} from "@/utils/storage";
import { decodeToken } from "@/utils/jwt";
import { userCache } from "@/utils/userCache";

// Types

interface AuthContextType {
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterRequest) => Promise<any>;
  otpVerify: (identifier: string, value: string) => Promise<void>;
  verifyResetOtp: (identifier: string, value: string) => Promise<void>;
  forgotPassword: (identifier: string) => Promise<string>;
  resetPassword: (password: string) => Promise<void>;
  signOut: () => Promise<void>;
  completeProfileSetup: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: User | null;
  profileSetupCompleted: boolean | null;
}

// Context
const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};

// Provider
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [profileSetupCompletedState, setProfileSetupCompletedState] = useState<
    boolean | null
  >(null);

  const signOut = useCallback(async () => {
    await Promise.all([
      clearUserId(),
      clearProfileSetupCompleted(),
      clearUserData(),
    ]);

    await setDatabaseUser(null);
    setApiUserId(null);
    await setChatUserId(null);
    setSession(null);
    setUser(null);
    setProfileSetupCompletedState(null);

    useTripDraftStore.getState().reset();
    usePlaceDraftStore.getState().reset();
    useLocationStore.getState().reset();
    useTripHubStore.getState().reset();
    useNotificationStore.getState().reset();
    useP2pChatStore.getState().reset();
    usePendingJoins.setState({ ids: [] });

    queryClient.clear();
    userCache.clear();
    clearQueue();

    await disconnectChat();
    await disconnectNotifications();
    await disconnectTripHub();
  }, []);

  // Init session and load profile flag
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await loadUserId();
        await loadProfileSetupCompleted();
        await loadUserData();
        await loadLastSeenSequenceNumber();
        const id = getUserId();

        if (id) {
          await setDatabaseUser(id);
          setApiUserId(id);
          await setChatUserId(id);
          const stored = getUserData();
          if (stored.firstName) {
            const userData = {
              id,
              email: stored.email,
              firstName: stored.firstName,
              lastName: stored.lastName,
            };
            setUser(userData);
            userCache.set(userData.id, userData.firstName, userData.lastName);
          }
          setSession(id);
          const completed = getProfileSetupCompleted();
          setProfileSetupCompletedState(completed);

          if (completed) {
            await initializeChat().catch(console.error);
            await initializeNotifications().catch(console.error);
            await initializeTripHub().catch(console.error);
          }
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    };

    init();
  }, []);

  useEffect(() => {
    setOnUnauthenticated(signOut);
  }, [signOut]);

  const establishSession = useCallback(async (data: LoginResponse) => {
    if (!data?.accessToken) {
      throw new Error("No access token received");
    }

    const decoded = decodeToken(data.accessToken);
    if (!decoded?.sub) {
      throw new Error("Invalid token: missing sub");
    }

    const setupCompleted = data.profileSetupCompleted ?? false;

    // Await all SecureStore operations first to prevent intermediate render ticks
    await Promise.all([
      setUserId(decoded.sub),
      setProfileSetupCompleted(setupCompleted),
    ]);

    // Persist user data for restoration after app refresh
    await setUserData({
      firstName: decoded.given_name,
      lastName: decoded.family_name,
      email: decoded.identifier,
    });

    // Perform React state updates synchronously to ensure proper batching
    await setDatabaseUser(decoded.sub);
    setApiUserId(decoded.sub);
    await setChatUserId(decoded.sub);
    const userData = {
      id: decoded.sub,
      email: decoded.identifier,
      firstName: decoded.given_name,
      lastName: decoded.family_name,
    };
    setUser(userData);
    userCache.set(userData.id, userData.firstName, userData.lastName);
    setProfileSetupCompletedState(setupCompleted);
    setSession(decoded.sub);

    if (setupCompleted) {
      await initializeChat().catch(console.error);
      await initializeNotifications().catch(console.error);
      await initializeTripHub().catch(console.error);
    }

    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    queryClient.invalidateQueries({ queryKey: ["my-trips"] });
  }, []);

  // Auth methods

  const login = useCallback(
    async (identifier: string, password: string) => {
      const data = await authService.login({ identifier, password });
      await establishSession(data);
    },
    [establishSession],
  );

  const register = useCallback(async (data: RegisterRequest) => {
    return await authService.register(data);
  }, []);

  const otpVerify = useCallback(
    async (identifier: string, value: string) => {
      const data = await authService.verifyOtp({ identifier, value });
      await establishSession(data);
    },
    [establishSession],
  );

  const verifyResetOtp = useCallback(
    async (identifier: string, value: string) => {
      const data = await authService.verifyOtp({ identifier, value });

      if (!data?.accessToken) {
        throw new Error("No token from OTP verification");
      }

      // Store userId for the upcoming resetPassword call, but do NOT set session.
      const decoded = decodeToken(data.accessToken);
      if (decoded?.sub) {
        await setUserId(decoded.sub);
        setApiUserId(decoded.sub);
      }
    },
    [],
  );

  const forgotPassword = useCallback(async (identifier: string) => {
    const data = await authService.forgotPassword({ identifier });
    return data?.otpId as string;
  }, []);

  const resetPassword = useCallback(async (password: string) => {
    await profileService.resetPassword({ password });
    setApiUserId(null);
    await clearUserId();
  }, []);

  const completeProfileSetup = useCallback(async () => {
    await setProfileSetupCompleted(true);
    setProfileSetupCompletedState(true);
    await initializeChat().catch(console.error);
    await initializeNotifications().catch(console.error);
    await initializeTripHub().catch(console.error);

    queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    queryClient.invalidateQueries({ queryKey: ["my-trips"] });
  }, []);

  // Context value
  const value = useMemo(
    () => ({
      login,
      register,
      otpVerify,
      verifyResetOtp,
      forgotPassword,
      resetPassword,
      signOut,
      completeProfileSetup,
      session,
      isLoading,
      user,
      profileSetupCompleted: profileSetupCompletedState,
    }),
    [
      login,
      register,
      otpVerify,
      verifyResetOtp,
      forgotPassword,
      resetPassword,
      signOut,
      completeProfileSetup,
      session,
      isLoading,
      user,
      profileSetupCompletedState,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
