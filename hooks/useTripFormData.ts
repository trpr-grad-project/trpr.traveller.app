import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/services/trips";
import { placesService } from "@/services/places";

export function useTripFormData() {
  return useQuery({
    queryKey: ["trip-form-data"],
    queryFn: () => tripService.getTripFormData(),
    staleTime: Infinity,
  });
}

export function usePlaceFormData() {
  return useQuery({
    queryKey: ["place-form-data"],
    queryFn: () => placesService.getFormData(),
    staleTime: Infinity,
  });
}
