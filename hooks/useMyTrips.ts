import { useQuery } from "@tanstack/react-query";
import { tripService } from "@/services/trips";

export function useMyTrips() {
  return useQuery({
    queryKey: ["my-trips"],
    queryFn: () => tripService.getMyTrips(),
  });
}
