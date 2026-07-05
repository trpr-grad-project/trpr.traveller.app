import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { profileService } from "@/services";
import {
  NotificationSettings,
  ProfileInterest,
  ProfileLanguage,
  ProfileSetupResponse,
  ProfileVibe,
} from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { useAuth } from "./AuthContext";

interface ProfileContextType {
  profile: ProfileSetupResponse | null;
  languages: ProfileLanguage[];
  interests: ProfileInterest[];
  vibes: ProfileVibe[];
  notificationSettings: NotificationSettings | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
  updateProfile: (updates: {
    languageIds?: string[];
    interestIds?: string[];
    vibeIds?: string[];
    bio?: string | null;
    notificationSettings?: {
      tripUpdates?: boolean | null;
      messages?: boolean | null;
      promotions?: boolean | null;
    };
  }) => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export const useProfile = () => {
  const ctx = useContext(ProfileContext);
  if (!ctx) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  return ctx;
};

export const ProfileProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { session, profileSetupCompleted } = useAuth();
  const [profile, setProfile] = useState<ProfileSetupResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const profileRef = useRef(profile);
  profileRef.current = profile;

  const fetchProfile = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (e: any) {
      console.error("Failed to load profile", e);
      setError(getErrorMessage(e, "Failed to load profile"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!session || profileSetupCompleted === false) return;
    fetchProfile();
  }, [fetchProfile, session, profileSetupCompleted]);

  const updateProfile = useCallback(
    async (updates: {
      languageIds?: string[];
      interestIds?: string[];
      vibeIds?: string[];
      bio?: string | null;
      notificationSettings?: {
        tripUpdates?: boolean | null;
        messages?: boolean | null;
        promotions?: boolean | null;
      };
    }) => {
      const current = profileRef.current;
      if (!current) return;

      const payload = {
        bio: updates.bio ?? current.bio,
        languageIds: updates.languageIds ?? current.languages.map((l) => String(l.id)),
        interestIds: updates.interestIds ?? current.interests.map((i) => String(i.id)),
        vibeIds: updates.vibeIds ?? current.vibes.map((v) => String(v.id)),
        notificationSettings: {
          tripUpdates: updates.notificationSettings?.tripUpdates ?? current.notificationSettings?.tripUpdates ?? null,
          messages: updates.notificationSettings?.messages ?? current.notificationSettings?.messages ?? null,
          promotions: updates.notificationSettings?.promotions ?? current.notificationSettings?.promotions ?? null,
        },
      };

      const result = await profileService.updateProfile(payload);
      setProfile(result);
    },
    [],
  );

  const value = useMemo(
    () => ({
      profile,
      languages: profile?.languages ?? [],
      interests: profile?.interests ?? [],
      vibes: profile?.vibes ?? [],
      notificationSettings: profile?.notificationSettings ?? null,
      isLoading,
      error,
      refetch: fetchProfile,
      updateProfile,
    }),
    [profile, isLoading, error, fetchProfile, updateProfile],
  );

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};
