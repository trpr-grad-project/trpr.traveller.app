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

  trip: {
    formData: "/trip/form-data",
    create: "/trip",
    uploadImages: "/trip/images/upload-images",
  },

  place: {
    formData: "/places/form-data",
    search: "/places",
  },
} as const;
