export interface CreateTripPayload {
  themeId: string;
  title: string;
  description: string;
  price: number;
  startDate: string;
  endDate: string;
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
