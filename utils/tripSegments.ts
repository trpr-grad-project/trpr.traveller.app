export type TripSegment =
  | "all"
  | "pending"
  | "upcoming"
  | "current"
  | "completed"
  | "rejected"
  | "canceled";

export const SEGMENT_STATUS_MAP: Record<TripSegment, readonly string[]> = {
  all: [],
  pending: ["UnderReview"],
  upcoming: ["Published", "Bidding", "Ready"],
  current: ["Started"],
  completed: ["Finished"],
  rejected: ["Rejected"],
  canceled: ["Canceled"],
} as const;

export const SEGMENTS: TripSegment[] = [
  "all",
  "pending",
  "upcoming",
  "current",
  "completed",
  "rejected",
  "canceled",
];

export const SEGMENT_LABELS: Record<TripSegment, string> = {
  all: "All",
  pending: "Pending",
  upcoming: "Upcoming",
  current: "Current",
  completed: "Completed",
  rejected: "Rejected",
  canceled: "Canceled",
};

export const STATUS_TO_LABEL: Record<string, string> = {
  UnderReview: "Pending",
  Published: "Upcoming",
  Bidding: "Upcoming",
  Ready: "Upcoming",
  Started: "Current",
  Finished: "Completed",
  Rejected: "Rejected",
  Canceled: "Canceled",
};

export const STATUS_COLORS: Record<string, { bg: string; text: string }> = {
  Pending: { bg: "#F59E0B", text: "#FFFFFF" },
  Upcoming: { bg: "#359EFF", text: "#FFFFFF" },
  Current: { bg: "#27AE60", text: "#FFFFFF" },
  Completed: { bg: "#64748B", text: "#FFFFFF" },
  Rejected: { bg: "#EF4444", text: "#FFFFFF" },
  Canceled: { bg: "#6B7280", text: "#FFFFFF" },
};
