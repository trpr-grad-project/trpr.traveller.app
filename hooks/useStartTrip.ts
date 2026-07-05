import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";
import { chatSync } from "@/services/chat/chatSync";

export function useStartTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripService.startTrip(tripId),
    onSuccess: async (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["home-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });

      try {
        const trip = await tripService.getTripById(tripId);
        const participantIds = [
          trip.createdByUser.id,
          ...trip.approvedParticipants.map((p) => p.id),
        ];
        const uniqueIds = [...new Set(participantIds)];

        await chatSync.createConversation({
          title: trip.title,
          imageUrl: trip.imagesUrls?.[0] ?? null,
          participantUserIds: uniqueIds,
        });
      } catch (error) {
        console.error("[useStartTrip] Failed to create conversation", error);
      }
    },
    onError: (error) => {
      console.error("[useStartTrip] error", error);
      Toast.show({
        type: "error",
        text1: "Failed to start trip",
        text2: (error as any)?.message ?? "Unknown error",
      });
    },
  });
}