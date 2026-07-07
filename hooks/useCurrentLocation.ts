import { useEffect } from "react";
import * as Location from "expo-location";
import { getUserId } from "@/utils/storage";
import { createTripLocationRepository } from "@/database/repositories/tripLocationRepositoryImpl";
import { tripLocationSync } from "@/services/trip/tripLocationSync";
import { useLocationStore } from "@/store/locationStore";
import type { TripLocation } from "@/types";

let _subscription: Location.LocationSubscription | null = null;
let _tripId: string | null = null;

async function onPositionUpdate(loc: Location.LocationObject): Promise<void> {
  const userId = getUserId();
  if (!userId || !_tripId) return;

  const { latitude: newLat, longitude: newLng } = loc.coords;
  useLocationStore.getState().setCurrentPosition(newLat, newLng);

  const entry: TripLocation = {
    tripId: _tripId,
    userId,
    latitude: newLat,
    longitude: newLng,
    updatedAt: Date.now(),
  };

  const repo = createTripLocationRepository();
  try {
    await repo.upsert(entry);
  } catch (e) {
    console.error("Failed to save location", e);
    return;
  }

  tripLocationSync.updateCache(entry);
}

export async function startLocationSharing(
  tripId: string,
): Promise<void> {
  if (_subscription) {
    if (_tripId === tripId) return;
    await stopLocationSharing();
  }

  _tripId = tripId;

  useLocationStore.getState().setGpsError(null);

  try {
    const { granted } = await Location.requestForegroundPermissionsAsync();
    if (!granted) {
      useLocationStore.getState().setGpsError("Location permission denied");
      useLocationStore.getState().setIsWatching(false);
      return;
    }

    const last = await Location.getLastKnownPositionAsync({
      requiredAccuracy: 100,
    });
    if (last) {
      const { latitude, longitude } = last.coords;
      useLocationStore.getState().setCurrentPosition(latitude, longitude);
      useLocationStore.getState().setActiveTripId(tripId);
    }

    const sub = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000,
        distanceInterval: 5,
      },
      onPositionUpdate,
    );

    _subscription = sub;
    useLocationStore.getState().setIsWatching(true);
    useLocationStore.getState().setActiveTripId(tripId);
  } catch {
    useLocationStore.getState().setGpsError("Location unavailable");
    useLocationStore.getState().setIsWatching(false);
  }
}

export async function stopLocationSharing(): Promise<void> {
  if (_subscription) {
    _subscription.remove();
    _subscription = null;
  }
  _tripId = null;
  useLocationStore.getState().setActiveTripId(null);
  useLocationStore.getState().setIsWatching(false);
}

export function useCurrentLocation() {
  const currentLatitude = useLocationStore((s) => s.currentLatitude);
  const currentLongitude = useLocationStore((s) => s.currentLongitude);
  const isWatching = useLocationStore((s) => s.isWatching);
  const gpsError = useLocationStore((s) => s.gpsError);
  const activeTripId = useLocationStore((s) => s.activeTripId);

  useEffect(() => {
    return () => {
      /* cleanup handled globally by stopLocationSharing */
    };
  }, []);

  return {
    latitude: currentLatitude,
    longitude: currentLongitude,
    isWatching,
    error: gpsError,
    activeTripId,
  };
}
