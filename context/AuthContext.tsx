import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { authService } from "@/services/auth";
import {
  setTokens,
  clearTokens,
  loadTokens,
  getAccessToken,
  setProfileSetupCompleted,
  getProfileSetupCompleted,
  loadProfileSetupCompleted,
  clearProfileSetupCompleted,
} from "@/utils/storage";
import { User, RegisterData } from "@/types/auth";

import { setOnUnauthenticated, setOnTokenRefresh } from "@/services/api";

// Types

interface AuthContextType {
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<any>;
  otpVerify: (identifier: string, value: string) => Promise<void>;
  forgotPassword: (identifier: string) => Promise<void>;
  verifyResetOtp: (
    identifier: string,
    value: string,
  ) => Promise<{ resetToken: string }>;
  resetPassword: (resetToken: string, password: string) => Promise<void>;
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
    setSession(null);
    setUser(null);
    setProfileSetupCompletedState(null);
    await clearTokens();
    await clearProfileSetupCompleted();
  }, []);

  // Init session and load profile flag
  useEffect(() => {
    const init = async () => {
      try {
        setIsLoading(true);
        await loadTokens();
        await loadProfileSetupCompleted();
        const token = getAccessToken();

        if (token) {
          setSession(token);
          setProfileSetupCompletedState(getProfileSetupCompleted());
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

  useEffect(() => {
    setOnTokenRefresh((token) => {
      setSession(token);
    });
  }, [setSession]);

  // Auth methods

  const login = useCallback(async (identifier: string, password: string) => {
    const data = await authService.login(identifier, password);

    if (!data?.accessToken) {
      throw new Error("No access token received");
    }

    await setTokens(data.accessToken, data.refreshToken);
    setSession(data.accessToken);

    const setupCompleted = data.profileSetupCompleted ?? false;
    await setProfileSetupCompleted(setupCompleted);
    setProfileSetupCompletedState(setupCompleted);
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    return await authService.register(data);
  }, []);

  const otpVerify = useCallback(async (identifier: string, value: string) => {
    const data = await authService.verifyOtp(identifier, value);

    if (!data?.accessToken) {
      throw new Error("No token from OTP verification");
    }

    await setTokens(data.accessToken, data.refreshToken);
    setSession(data.accessToken);

    const setupCompleted = data.profileSetupCompleted ?? false;
    await setProfileSetupCompleted(setupCompleted);
    setProfileSetupCompletedState(setupCompleted);
  }, []);

  const forgotPassword = useCallback(async (identifier: string) => {
    await authService.forgotPassword(identifier);
  }, []);

  const verifyResetOtp = useCallback(
    async (identifier: string, value: string) => {
      return await authService.verifyResetOtp(identifier, value);
    },
    [],
  );

  const resetPassword = useCallback(
    async (resetToken: string, password: string) => {
      await authService.resetPassword(resetToken, password);
    },
    [],
  );

  const completeProfileSetup = useCallback(async () => {
    await setProfileSetupCompleted(true);
    setProfileSetupCompletedState(true);
  }, []);

  // Context value
  const value = useMemo(
    () => ({
      login,
      register,
      otpVerify,
      forgotPassword,
      verifyResetOtp,
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
      forgotPassword,
      verifyResetOtp,
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
