import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/services/trips";

export function useTripDetails(id: string) {
  return useQuery({
    queryKey: ["trip", id],
    queryFn: () => tripService.getTripById(id),
    enabled: !!id,
  });
}
