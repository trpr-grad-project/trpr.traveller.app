import api from "./api";
import { ENDPOINTS } from "./endpoints";

export type SuggestionPlace = {
  id: number;
  title: string;
  description: string;
  averageVisitTime: number;
  latitude: number;
  longitude: number;
};

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
): Promise<SuggestionPlace[][]> {
  const response = await api.get(ENDPOINTS.trip.suggestion, { params, timeout: 90000 });
  return response.data;
}
