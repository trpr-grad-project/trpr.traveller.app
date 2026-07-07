import { useMutation, useQueryClient } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { tripService } from "@/services/trips";
import { refreshTripsToday } from "@/services/trip/initializeTripHub";
import { useTripHubStore } from "@/store/tripHubStore";

export function useEndTrip() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (tripId: string) => tripService.endTrip(tripId),
    onSuccess: (_, tripId) => {
      useTripHubStore.getState().updateTripStatus(tripId, "Finished");
      queryClient.invalidateQueries({ queryKey: ["trip", tripId] });
      queryClient.invalidateQueries({ queryKey: ["home-trips"] });
      queryClient.invalidateQueries({ queryKey: ["my-trips"] });
      refreshTripsToday().catch(console.error);
    },
    onError: (error) => {
      console.error("[useEndTrip] error", error);
      Toast.show({
        type: "error",
        text1: "Failed to end trip",
        text2: (error as any)?.message ?? "Unknown error",
      });
    },
  });
}