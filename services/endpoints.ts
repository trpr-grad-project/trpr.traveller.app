export const ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    verifyOtp: "/auth/otp/verify",
    forgotPassword: "/auth/forget-password",
  },

  profile: {
    main: "/Profile/me",
    myProfile: "/Profile/my-profile",
    formData: "/Profile/form-data",
    resetPassword: "/Profile/me/password-reset",
    byId: "/Profile/",
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
    suggestion: "/trip/suggestion",
    acceptBid: "/bidding",
    location: "/trip/location"
  },

  place: {
    formData: "/places/form-data",
    search: "/places",
    myPlaces: "/places/me",
  },

  users: {
    all: "/users",
  },

  notifications: "/notifications",

  payments: {
    charge: "/payments",
    balance: "/payments/balance",
    history: "/payments/history",
  },
} as const;
