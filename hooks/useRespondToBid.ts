import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";
import type { TripResponse } from "@/types";

export function useRespondToBid() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      tripId,
      biddingId,
      action,
    }: {
      tripId: string;
      biddingId: string;
      action: "accept" | "reject";
    }) => tripService.respondToBid(tripId, biddingId, action === "accept"),

    onMutate: async ({ tripId, biddingId, action }) => {
      await queryClient.cancelQueries({ queryKey: ["trip", tripId] });
      const previous = queryClient.getQueryData<TripResponse>(["trip", tripId]);

      if (previous) {
        const updated = { ...previous };
        if (action === "accept") {
          updated.biddingsPage = updated.biddingsPage
            ? { ...updated.biddingsPage, items: [] }
            : null;
        } else {
          if (updated.biddingsPage) {
            updated.biddingsPage = {
              ...updated.biddingsPage,
              items: updated.biddingsPage.items.filter(
                (b) => b.id !== biddingId,
              ),
            };
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
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["home-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
    },
  });
}
