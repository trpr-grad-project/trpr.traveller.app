export interface ProfileLanguage {
  id: number;
  name: string;
  code: string;
  nativeName: string;
  icon: string;
}

export interface ProfileInterest {
  id: number;
  icon: string;
  name: string;
}

export interface ProfileVibe {
  id: number;
  thumbnail: string;
  description: string;
  name: string;
}

export interface ProfileSetupDataResponse {
  languages: ProfileLanguage[];
  interests: ProfileInterest[];
  vibes: ProfileVibe[];
}

export interface NotificationSettings {
  tripUpdates: boolean;
  messages: boolean;
  promotions: boolean;
}

export interface ResetPasswordRequest {
  password: string;
}

export interface ProfileSetupRequest {
  bio: string;
  languageIds: string[];
  interestIds: string[];
  vibeIds: string[];
}

export interface ProfileUpdateRequest {
  bio: string | null;
  languageIds: string[];
  interestIds: string[];
  vibeIds: string[];
  notificationSettings: {
    tripUpdates: boolean | null;
    messages: boolean | null;
    promotions: boolean | null;
  };
}

export interface ProfileSetupResponse {
  id: string;
  bio: string;
  languages: ProfileLanguage[];
  interests: ProfileInterest[];
  vibes: ProfileVibe[];
  notificationSettings: NotificationSettings;
}
