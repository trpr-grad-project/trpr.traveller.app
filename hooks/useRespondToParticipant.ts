import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";
import type { TripResponse } from "@/types";

export function useRespondToParticipant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      participantId,
      action,
    }: {
      tripId: string;
      participantId: string;
      action: "accept" | "reject";
    }) => tripService.acceptParticipant(tripId, participantId, action === "accept"),

    onMutate: async ({ tripId, participantId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      const previous = queryClient.getQueryData<TripResponse>(["trip", tripId]);

      if (previous) {
        const updated = { ...previous };
        const participant = updated.pendingParticipants?.find((p) => p.id === participantId);
        if (participant) {
          updated.pendingParticipants = updated.pendingParticipants?.filter((p) => p.id !== participantId) ?? [];
          if (action === "accept") {
            updated.approvedParticipants = [...(updated.approvedParticipants ?? []), participant];
          }
        }
        queryClient.setQueryData(["trip", tripId], updated);
      }

      return { previous };
    },

    onError: (_error, { tripId }, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["trip", tripId], context.previous);
      }
      Toast.show({
        type: "error",
        text1: "Action failed",
        text2: "Please try again",
      });
    },

    onSettled: (_data, _error, { tripId }) => {
      queryClient.invalidateQueries({ queryKey: ["home-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
    },
  });
}
