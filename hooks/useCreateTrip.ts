import { useMutation } from "@tanstack/react-query";
import { tripService } from "@/services/trips";
import { useTripDraftStore } from "@/store/tripCreation";
import type { CreateTripPayload } from "@/types/trip-creation";

export function useCreateTrip() {
  const reset = useTripDraftStore((s) => s.reset);

  return useMutation({
    mutationFn: async (payload: CreateTripPayload) => {
      const response = await tripService.createTrip(payload);
      return response;
    },
    onSuccess: () => {
      reset();
    },
  });
}
