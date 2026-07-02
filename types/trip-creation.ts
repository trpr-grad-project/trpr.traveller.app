export interface CreateTripPayload {
  themeId: string;
  title: string;
  description: string;
  price: string;
  startDate: string;
  images: string[];
  autoApprove: boolean;
  tripVisibility: "Public" | "Private";
  publishMode: string;
  segments: {
    duration: string;
    placesIds: string[];
  }[];
  maxParticipantsCount: string;
  guideId: null;
}
