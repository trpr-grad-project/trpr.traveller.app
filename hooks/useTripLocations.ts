import { useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { createTripLocationRepository } from "@/database/repositories/tripLocationRepositoryImpl";
import { setTripLocationQueryClient, tripLocationSync } from "@/services/trip/tripLocationSync";
import type { TripLocation } from "@/types";

export function useTripLocations(tripId: string) {
  const queryClient = useQueryClient();
  const registeredQueryClient = useRef(false);

  useEffect(() => {
    if (!registeredQueryClient.current) {
      setTripLocationQueryClient(queryClient);
      registeredQueryClient.current = true;
    }
  }, [queryClient]);

  const query = useQuery({
    queryKey: ["trip-locations", tripId],
    queryFn: () => createTripLocationRepository().getByTripId(tripId),
    staleTime: Infinity,
  });

  useEffect(() => {
    const unsubscribe = tripLocationSync.subscribe((id) => {
      if (id === tripId) {
        queryClient.invalidateQueries({
          queryKey: ["trip-locations", tripId],
        });
      }
    });
    return unsubscribe;
  }, [queryClient, tripId]);

  return (query.data ?? []) as TripLocation[];
}
