import api from "./api";
import { ENDPOINTS } from "./endpoints";
import type { CreateReviewRequest } from "@/types/review";

export const reviewService = {
  createReview: async (tripId: string, payload: CreateReviewRequest) => {
    const response = await api.post(
      `${ENDPOINTS.review.create}${tripId}/review`,
      payload,
    );
    return response.data;
  },
};
