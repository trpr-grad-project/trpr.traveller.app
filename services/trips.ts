import api from "./api";
import { ENDPOINTS } from "./endpoints";

export const tripService = {
  getTrips: async () => {
    const response = await api.get("/trips");
    return response.data;
  },

  getTripById: async (id: string) => {
    const response = await api.get(`/trips/${id}`);
    return response.data;
  },

  createPlan: async (data: any) => {
    const response = await api.post("/trips/plans", data);
    return response.data;
  },

  getGuides: async () => {
    const response = await api.get("/guides");
    return response.data;
  },

  getGuideById: async (id: string) => {
    const response = await api.get(`/guides/${id}`);
    return response.data;
  },

  getCompanies: async () => {
    const response = await api.get("/companies");
    return response.data;
  },

  getCompanyById: async (id: string) => {
    const response = await api.get(`/companies/${id}`);
    return response.data;
  },

  getBids: async (tripId: string) => {
    const response = await api.get(`/trips/${tripId}/bids`);
    return response.data;
  },

  createBooking: async (data: any) => {
    const response = await api.post("/bookings", data);
    return response.data;
  },

  processPayment: async (data: any) => {
    const response = await api.post("/payments", data);
    return response.data;
  },
};
