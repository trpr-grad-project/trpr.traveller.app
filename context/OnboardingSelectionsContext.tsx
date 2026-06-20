import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { profileService } from "@/services";

interface OnboardingSelectionsContextType {
  languageId: number | null;
  interestIds: number[];
  setLanguageId: (id: number) => void;
  setInterestIds: React.Dispatch<React.SetStateAction<number[]>>;
  submitProfile: (vibeId: number) => Promise<void>;
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
  const [languageId, setLanguageId] = useState<number | null>(null);
  const [interestIds, setInterestIds] = useState<number[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const submitProfile = useCallback(
    async (vibeId: number) => {
      setIsSubmitting(true);
      try {
        await profileService.setupProfile({
          bio: "",
          languageIds: languageId ? [String(languageId)] : [],
          interestIds: interestIds.map(String),
          vibeIds: [String(vibeId)],
        });
      } finally {
        setIsSubmitting(false);
      }
    },
    [languageId, interestIds],
  );

  const value = useMemo(
    () => ({
      languageId,
      interestIds,
      setLanguageId,
      setInterestIds,
      submitProfile,
      isSubmitting,
    }),
    [languageId, interestIds, submitProfile, isSubmitting],
  );

  return (
    <OnboardingSelectionsContext.Provider value={value}>
      {children}
    </OnboardingSelectionsContext.Provider>
  );
};
