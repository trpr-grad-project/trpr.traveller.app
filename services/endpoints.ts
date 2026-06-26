export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/otp/verify",
    forgotPassword: "/auth/forget-password",
  },

  profile: {
    main: "/Profile/me",
    formData: "/Profile/form-data",
    resetPassword: "/Profile/me/password-reset",
  },

  conversation: {
    ai: "/conversation/ai",
  },
} as const;
