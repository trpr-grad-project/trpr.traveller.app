export interface Place {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  governorateId: number;
  latitude: number;
  longitude: number;
  governorate: { id: number; name: string };
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
}

export interface Theme {
  id: number;
  name: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface Governorate {
  id: number;
  name: string;
}

export interface Tag {
  id: number;
  name: string;
}

export interface TripFormDataResponse {
  themes: Theme[];
}

export interface PlaceFormDataResponse {
  categories: Category[];
  governorates: Governorate[];
  tags: Tag[];
}

export interface PlacesResponse {
  items: Place[];
}

export interface PlacesQueryParams {
  GovernorateId?: number;
  Latitude?: number;
  Longitude?: number;
  RadiusInMeters?: number;
  Title?: string;
  LastPlaceId?: number;
  PageSize?: number;
}
