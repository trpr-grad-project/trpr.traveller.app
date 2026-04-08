import { setOnUnauthenticated } from "@/services/api";
import { authService } from "@/services/auth";
import { STORAGE_KEYS } from "@/utils/constants";
import * as SecureStore from "expo-secure-store";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  [key: string]: any;
}

interface RegisterData {
  identifier: string;
  firstName: string;
  lastName: string;
  password: string;
}

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
  session: string | null;
  isLoading: boolean;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const signOut = useCallback(async () => {
    setSession(null);
    setUser(null);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
    await SecureStore.deleteItemAsync(STORAGE_KEYS.REFRESH_TOKEN);
  }, []);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync(STORAGE_KEYS.ACCESS_TOKEN);
        if (token) {
          setSession(token);
        }
      } catch (e) {
        console.error("Failed to load session", e);
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
    setOnUnauthenticated(signOut);
  }, [signOut]);

  const persistTokens = useCallback(
    async (accessToken: string, refreshToken?: string) => {
      setSession(accessToken);
      await SecureStore.setItemAsync(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
      if (refreshToken) {
        await SecureStore.setItemAsync(
          STORAGE_KEYS.REFRESH_TOKEN,
          refreshToken,
        );
      }
    },
    [],
  );

  const login = useCallback(
    async (identifier: string, password: string) => {
      try {
        const data = await authService.login(identifier, password);
        const token = data.accessToken;
        if (!token) throw new Error("No token received");
        await persistTokens(token, data.refreshToken);
      } catch (error) {
        console.error("Sign in failed", error);
        throw error;
      }
    },
    [persistTokens],
  );

  const register = useCallback(async (data: RegisterData) => {
    try {
      return await authService.register(data);
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    }
  }, []);

  const otpVerify = useCallback(
    async (identifier: string, value: string) => {
      try {
        const data = await authService.verifyOtp(identifier, value);
        const token = data.accessToken;
        if (!token) throw new Error("No token received from OTP verification");
        await persistTokens(token, data.refreshToken);
      } catch (error) {
        console.error("OTP Verify failed", error);
        throw error;
      }
    },
    [persistTokens],
  );

  const forgotPassword = useCallback(async (identifier: string) => {
    try {
      await authService.forgotPassword(identifier);
    } catch (error) {
      console.error("Forgot Password failed", error);
      throw error;
    }
  }, []);

  const verifyResetOtp = useCallback(
    async (identifier: string, value: string) => {
      try {
        return await authService.verifyResetOtp(identifier, value);
      } catch (error) {
        console.error("Verify Reset OTP failed", error);
        throw error;
      }
    },
    [],
  );

  const resetPassword = useCallback(
    async (resetToken: string, password: string) => {
      try {
        await authService.resetPassword(resetToken, password);
      } catch (error) {
        console.error("Reset Password failed", error);
        throw error;
      }
    },
    [],
  );

  const contextValue = useMemo(
    () => ({
      login,
      register,
      otpVerify,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      signOut,
      session,
      isLoading,
      user,
    }),
    [
      login,
      register,
      otpVerify,
      forgotPassword,
      verifyResetOtp,
      resetPassword,
      signOut,
      session,
      isLoading,
      user,
    ]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}
