import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const placesService = {
  getFormData: async () => {
    const response = await api.get(ENDPOINTS.place.formData);
    return response.data;
  },

  search: async (params: {
    GovernorateId?: number;
    Latitude?: number;
    Longitude?: number;
    RadiusInMeters?: number;
    Title?: string;
    LastPlaceId?: number;
    PageSize?: number;
  }) => {
    const query: Record<string, string> = {};
    if (params.GovernorateId !== undefined) query.GovernorateId = String(params.GovernorateId);
    if (params.Latitude !== undefined) query.Latitude = String(params.Latitude);
    if (params.Longitude !== undefined) query.Longitude = String(params.Longitude);
    if (params.RadiusInMeters !== undefined) query.RadiusInMeters = String(params.RadiusInMeters);
    if (params.Title !== undefined && params.Title.length > 0) query.Title = params.Title;
    if (params.LastPlaceId !== undefined) query.LastPlaceId = String(params.LastPlaceId);
    if (params.PageSize !== undefined) query.PageSize = String(params.PageSize);
    const response = await api.get(ENDPOINTS.place.search, { params: query });
    return response.data;
  },
};
