import api from "./api";
import { ENDPOINTS } from "./endpoints";
import type { HomeTripsResponse, MyTrip } from "@/types";

export const tripService = {

  getTripFormData: async () => {
    const response = await api.get(ENDPOINTS.trip.formData);
    return response.data;
  },

  createTrip: async (payload: any) => {
    const response = await api.post(ENDPOINTS.trip.create, payload);
    return response.data;
  },

  getTripById: async (id: string) => {
    const response = await api.get(ENDPOINTS.trip.get + id);
    return response.data;
  },

  getMyTrips: async (): Promise<MyTrip[]> => {
    const response = await api.get(ENDPOINTS.trip.myTrips);
    return response.data.items as MyTrip[];
  },

  getHomeTrips: async (): Promise<HomeTripsResponse> => {
    const response = await api.get(ENDPOINTS.trip.home);
    return response.data;
  },

  joinTrip: async (id: string) => {
    const response = await api.put(ENDPOINTS.trip.join + id, {});
    return response.data;
  },

  startTrip: async (id: string) => {
    const response = await api.put(ENDPOINTS.trip.start + id, {});
    return response.data;
  },

  endTrip: async (id: string) => {
    const response = await api.put(ENDPOINTS.trip.end + id, {});
    return response.data;
  },

  acceptParticipant: async (tripId: string, userId: string, isApproved: boolean) => {
    const response = await api.put(ENDPOINTS.trip.acceptParticipant, {
      isApproved,
      tripId,
      userId,
    });
    return response.data;
  },

  respondToBid: async (tripId: string, biddingId: string, _isApproved: boolean) => {
    const response = await api.post(
      `${ENDPOINTS.trip.acceptBid}/${tripId}/select/${biddingId}`,
    );
    return response.data;
  },

  uploadImages: async (formData: FormData) => {
    const response = await api.post(ENDPOINTS.trip.uploadImages, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
