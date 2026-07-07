export interface CreateReviewRequest {
  tripId: string;
  revieweeId: string;
  rating: number;
  review: string;
}
