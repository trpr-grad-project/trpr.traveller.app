import { useMutation, useQueryClient } from "@tanstack/react-query";
import { tripService } from "@/services/trips";
import { chatSync } from "@/services/chat/chatSync";
import { createConversationRepository } from "@/database/repositories/conversationRepositoryImpl";
import { useTripDraftStore } from "@/store/tripCreation";
import type { CreateTripPayload } from "@/types/trip-creation";

export function useCreateTrip() {
  const reset = useTripDraftStore((s) => s.reset);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CreateTripPayload) => {
      const response = await tripService.createTrip(payload);
      return response;
    },
    onSuccess: async (data, payload) => {
      reset();

      try {
        await chatSync.syncConversations({ limit: 20 });
      } catch (error) {
        console.error("[useCreateTrip] Failed to sync conversations", error);
      }

      const tripId =
        (data as any)?.id ??
        (data as any)?.tripId ??
        (data as any)?.data?.id ??
        (data as any)?.createdTrip?.id;

      if (tripId) {
        try {
          const convRepo = createConversationRepository();
          const convs = await convRepo.findAllConversations();
          const match = convs.find((c) => c.title === payload.title && !c.tripId);
          if (match) {
            await convRepo.updateTripId(match.id, tripId);
          }
        } catch (error) {
          console.error("[useCreateTrip] Failed to store tripId", error);
        }
      }

      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });
}
