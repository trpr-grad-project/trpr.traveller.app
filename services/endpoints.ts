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
    ai: "/conversations/ai",
  },

  conversations: {
    base: "/conversations",
  },

  trip: {
    formData: "/trip/form-data",
    create: "/trip/user",
    get: "/trip/",
    myTrips: "/trip/me",
    uploadImages: "/trip/images/upload-images",
    home: "/trip/home",
    join: "/trip/join/",
    start: "/trip/start/",
    end: "/trip/end/",
    acceptParticipant: "/trip/accept",
  },

  place: {
    formData: "/places/form-data",
    search: "/places",
  },

  users: {
    all: "/users",
  },
} as const;
