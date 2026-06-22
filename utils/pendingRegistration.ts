import type { RegisterRequest } from "@/types";

let pendingData: (RegisterRequest & { otpId: string }) | null = null;

export const setPendingRegistration = (
  data: RegisterRequest & { otpId: string },
) => {
  pendingData = data;
};

export const getPendingRegistration = () => pendingData;

export const clearPendingRegistration = () => {
  pendingData = null;
};
