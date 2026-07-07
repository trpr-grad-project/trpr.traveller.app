import api from "./api";
import { ENDPOINTS } from "./endpoints";

export type SuggestionPlace = {
  id: number;
  title: string;
  description: string;
  averageVisitTime: number | null;
  categoryId: number;
  governorateId: number;
  latitude: number;
  longitude: number;
  userId: string | null;
  governorate: { id: number; name: string };
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
};

export type TripSuggestionResponse = Record<
  string,
  {
    itinerary: { places: SuggestionPlace[] };
    score: {
      themeScore: number;
      ratingScore: number;
      categoryScore: number;
      travelPenalty: number;
      totalScore: number;
    };
  }
>;

export type TripSuggestionParams = {
  ThemeId: number;
  NumberOfDays: number;
  StartDateUtc: string;
  GovernorateId?: number;
  Longitude?: number;
  Latitude?: number;
  RadiusInMeters?: number;
};

export async function getTripSuggestion(
  params: TripSuggestionParams,
): Promise<TripSuggestionResponse> {
  const response = await api.get(ENDPOINTS.trip.suggestion, {
    params,
    timeout: 90000,
  });
  return response.data;
}
