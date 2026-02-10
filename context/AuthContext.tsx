import { setOnUnauthenticated } from "@/services/api";
import { authService } from "@/services/auth";
import * as SecureStore from "expo-secure-store";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  login: (identifier: string, password: string) => Promise<void>;
  register: (data: any) => Promise<any>;
  otpVerify: (identifier: string, value: string) => Promise<void>;
  signOut: () => Promise<void>;
  session: string | null;
  isLoading: boolean;
  user: any | null;
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
  const [user, setUser] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const token = await SecureStore.getItemAsync("access_token");
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

    // Subscribe to forced logout events from API
    setOnUnauthenticated(() => {
      signOut();
    });
  }, []);

  const login = async (identifier: string, password: string) => {
    try {
      const data = await authService.login(identifier, password);
      // Response structure: { accessToken, refreshToken, profileSetupCompleted }
      const token = data.accessToken;

      if (token) {
        setSession(token);
        await SecureStore.setItemAsync("access_token", token);
        if (data.refreshToken) {
          await SecureStore.setItemAsync("refresh_token", data.refreshToken);
        }
      } else {
        throw new Error("No token received");
      }
    } catch (error) {
      console.error("Sign in failed", error);
      throw error;
    }
  };

  const register = async (data: {
    identifier: string;
    firstName: string;
    lastName: string;
    password: string;
  }) => {
    try {
      return await authService.register(data);
    } catch (error) {
      console.error("Sign up failed", error);
      throw error;
    }
  };

  const otpVerify = async (identifier: string, value: string) => {
    try {
      const data = await authService.verifyOtp(identifier, value);
      const token = data.accessToken;
      if (token) {
        setSession(token);
        await SecureStore.setItemAsync("access_token", token);
        if (data.refreshToken) {
          await SecureStore.setItemAsync("refresh_token", data.refreshToken);
        }
      } else {
        throw new Error("No token received from OTP verification");
      }
    } catch (error) {
      console.error("OTP Verify failed", error);
      throw error;
    }
  };

  const signOut = async () => {
    setSession(null);
    setUser(null);
    await SecureStore.deleteItemAsync("access_token");
    await SecureStore.deleteItemAsync("refresh_token");
  };

  return (
    <AuthContext.Provider
      value={{
        login,
        register,
        otpVerify,
        signOut,
        session,
        isLoading,
        user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
