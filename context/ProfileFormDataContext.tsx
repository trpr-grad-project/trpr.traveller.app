import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

import { profileService } from "@/services";
import { ProfileInterest, ProfileLanguage, ProfileVibe } from "@/types";
import { getErrorMessage } from "@/utils/errorHandler";
import { getUserId } from "@/utils/storage";

interface ProfileFormDataContextType {
  languages: ProfileLanguage[];
  interests: ProfileInterest[];
  vibes: ProfileVibe[];
  isLoading: boolean;
  error: string | null;
  refetch: () => void;
}

const ProfileFormDataContext =
  createContext<ProfileFormDataContextType | null>(null);

export const useProfileFormData = () => {
  const ctx = useContext(ProfileFormDataContext);
  if (!ctx) {
    throw new Error(
      "useProfileFormData must be used within ProfileFormDataProvider"
    );
  }
  return ctx;
};

export const ProfileFormDataProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [languages, setLanguages] = useState<ProfileLanguage[]>([]);
  const [interests, setInterests] = useState<ProfileInterest[]>([]);
  const [vibes, setVibes] = useState<ProfileVibe[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    // Only fetch when there is a valid userId.
    const id = getUserId();
    if (!id) return;

    try {
      setIsLoading(true);
      setError(null);
      const data = await profileService.getProfileSetupData();
      setLanguages(data.languages ?? []);
      setInterests(data.interests ?? []);
      setVibes(data.vibes ?? []);
    } catch (e: any) {
      console.error("Failed to load profile form data", e);
      setError(getErrorMessage(e, "Failed to load data"));
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const value = useMemo(
    () => ({ languages, interests, vibes, isLoading, error, refetch: fetchData }),
    [languages, interests, vibes, isLoading, error, fetchData]
  );

  return (
    <ProfileFormDataContext.Provider value={value}>
      {children}
    </ProfileFormDataContext.Provider>
  );
};
