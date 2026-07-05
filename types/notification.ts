export interface Notification {
  id: string;
  title: string;
  message: string;
  sequenceNumber: number;
}

export interface PaginatedNotificationsResponse {
  items: Notification[];
  nextCursor: string | null;
  hasNextPage: boolean;
}
