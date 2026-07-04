import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";

export function useJoinTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripService.joinTrip(tripId),
    onSuccess: (_, tripId) => {
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["home-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
    },
    onError: (error) => {
      console.error("[useJoinTrip] error", error);
      Toast.show({
        type: "error",
        text1: "Failed to join trip",
        text2: (error as any)?.message ?? "Unknown error",
      });
    },
  });
}
