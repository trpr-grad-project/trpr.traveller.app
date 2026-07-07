export interface TripTodayItem {
  id: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  actualDuration: number;
  expectedDuration: number;
  price: number;
  images: string[];
  maxParticipantsCount: number;
  guideId: string | null;
  status: string;
}
