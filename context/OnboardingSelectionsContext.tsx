import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { profileService } from "@/services";

interface OnboardingSelectionsContextType {
  languageIds: number[];
  interestIds: number[];
  setLanguageIds: React.Dispatch<React.SetStateAction<number[]>>;
  setInterestIds: React.Dispatch<React.SetStateAction<number[]>>;
  submitProfile: (vibeIds: number[]) => Promise<void>;
  isSubmitting: boolean;
}

const OnboardingSelectionsContext =
  createContext<OnboardingSelectionsContextType | null>(null);

export const useOnboardingSelections = () => {
  const ctx = useContext(OnboardingSelectionsContext);
  if (!ctx) {
    throw new Error(
      "useOnboardingSelections must be used within OnboardingSelectionsProvider",
    );
  }
  return ctx;
};

export const OnboardingSelectionsProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [languageIds, setLanguageIds] = useState<number[]>([]);
  const [interestIds, setInterestIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProfile = useCallback(
    async (vibeIds: number[]) => {
      setIsSubmitting(true);
      try {
        await profileService.setupProfile({
          bio: "",
          languageIds: languageIds.map(String),
          interestIds: interestIds.map(String),
          vibeIds: vibeIds.map(String),
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [languageIds, interestIds],
  );

  const value = useMemo(
    () => ({
      languageIds,
      interestIds,
      setLanguageIds,
      setInterestIds,
      submitProfile,
      isSubmitting,
    }),
    [languageIds, interestIds, submitProfile, isSubmitting],
  );

  return (
    <OnboardingSelectionsContext.Provider value={value}>
      {children}
    </OnboardingSelectionsContext.Provider>
  );
};
