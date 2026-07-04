export interface CreateTripPayload {
  themeId: string;
  title: string;
  description: string;
  price: string;
  startDate: string;
  images: string[];
  autoApprove: boolean;
  tripVisibility: "Public" | "Private";
  publishMode: "DirectPublish" | "Bidding";
  segments: {
    duration: string;
    placesIds: string[];
  }[];
  maxParticipantsCount: string;
  guideId: null;
}

export interface TripCreatorUser {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string | null;
  rating: number | null;
}

export interface TripSegmentPlace {
  id: number;
  title: string;
  description: string;
  averageVisitTime: number | null;
  categoryId: number;
  governorateId: number;
  latitude: number;
  longitude: number;
  userId: string | null;
  governorate: { id: number; name: string };
  category: { id: number; name: string };
  tags: { id: number; name: string }[];
}

export interface TripSegment {
  day: number;
  duration: number;
  places: TripSegmentPlace[];
}

export interface TripResponse {
  id: string;
  createdByUser: TripCreatorUser;
  creatorRoles: string[];
  theme: string;
  title: string;
  description: string;
  price: number;
  autoApprove: boolean;
  startDate: string;
  tripTime: string;
  imagesUrls: string[];
  tripVisibility: "Public" | "Private";
  status: string;
  publishMode: string;
  rejectionReason: string | null;
  segments: TripSegment[];
  maxParticipantsCount: number;
  approvedParticipants: TripCreatorUser[];
  pendingParticipants: TripCreatorUser[];
  guideId: string | null;
  createdAtUTC: string;
  biddingsPage: null;
}
