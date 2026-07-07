import { useInfiniteQuery } from "@tanstack/react-query";
import { placesService } from "@/services/places";
import { useTripDraftStore } from "@/store/tripCreation";
import { useEffect, useState } from "react";

export function usePlacesInfinite(search: string, pageSize = 20, myPlacesOnly = false) {
  const governorateId = useTripDraftStore((s) => s.governorateId);
  const mapLocation = useTripDraftStore((s) => s.mapLocation);

  const [debouncedSearch, setDebouncedSearch] = useState(search);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(timer);
  }, [search]);

  const query = useInfiniteQuery({
    queryKey: [
      "places",
      myPlacesOnly,
      governorateId,
      mapLocation?.lat,
      mapLocation?.lng,
      mapLocation?.radius,
      debouncedSearch,
    ],
    queryFn: async ({ pageParam }) => {
      const params: Record<string, any> = { PageSize: pageSize };
      if (governorateId !== null) params.GovernorateId = governorateId;
      if (mapLocation !== null) {
        params.Latitude = mapLocation.lat;
        params.Longitude = mapLocation.lng;
        params.RadiusInMeters = mapLocation.radius;
      }
      if (debouncedSearch.length > 0) params.Title = debouncedSearch;
      if (pageParam !== undefined) params.LastPlaceId = pageParam;
      return myPlacesOnly
        ? placesService.getMyPlaces(params)
        : placesService.search(params);
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage: any, _allPages, lastPageParam) => {
      const items = lastPage.items ?? [];
      if (items.length < pageSize) return undefined;
      const last = items[items.length - 1];
      return last?.id ?? lastPageParam;
    },
    enabled: governorateId !== null || mapLocation !== null,
  });

  return query;
}
