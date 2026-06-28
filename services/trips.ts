import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const tripService = {

  getTripFormData: async () => {
    const response = await api.get(ENDPOINTS.trip.formData);
    return response.data;
  },

  createTrip: async (payload: any) => {
    const response = await api.post(ENDPOINTS.trip.create, payload);
    return response.data;
  },

  uploadImages: async (formData: FormData) => {
    const response = await api.post(ENDPOINTS.trip.uploadImages, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
