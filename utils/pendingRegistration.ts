import type { RegisterRequest } from "@/types";

let pendingData: RegisterRequest | null = null;

export const setPendingRegistration = (data: RegisterRequest) => {
  pendingData = data;
};

export const getPendingRegistration = () => pendingData;

export const clearPendingRegistration = () => {
  pendingData = null;
};
