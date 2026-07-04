import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/services/trips";

export function useHomeTrips() {
  return useQuery({
    queryKey: ["home-trips"],
    queryFn: () => tripService.getHomeTrips(),
    staleTime: 1000 * 60,
  });
}
