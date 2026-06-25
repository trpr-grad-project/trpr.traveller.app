export interface Trip {
  id: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  rating: string;
  category: string;
  type: "BY COMPANY" | "BY GUIDE" | "GROUP TRIP" | "SHARED";
  image: string;
  description?: string;
  theme?: string;
}

export interface Company {
  id: string;
  name: string;
  logo?: string;
  verified: boolean;
  rating: number;
  reviewCount: number;
  experience: string;
  about: string;
  tags: string[];
  tripCount: string;
  guideCount: string;
}

export interface GuideProfile {
  id: string;
  name: string;
  avatar: string;
  specialty: string;
  rating: number;
  reviewCount: number;
  tripCount: number;
  verified: boolean;
  about: string;
  languages?: string[];
}

export interface Plan {
  id: string;
  title: string;
  description: string;
  location: string;
  theme: string;
  visibility: "private" | "public";
  maxParticipants: number;
  languages: string[];
  ownerId: string;
  ownerName: string;
  ownerAvatar?: string;
  memberCount: number;
  createdAt: string;
}

export interface Booking {
  id: string;
  planId: string;
  planTitle: string;
  providerName: string;
  providerVerified: boolean;
  travelers: number;
  pricePerPerson: number;
  totalPrice: number;
  status: "pending" | "confirmed" | "completed" | "cancelled";
}

export interface Payment {
  bookingId: string;
  tripTitle: string;
  location: string;
  dateRange: string;
  travelers: number;
  duration: string;
  tripPrice: number;
  serviceFee: number;
  taxes: number;
  totalAmount: number;
  cardLastFour: string;
  cardExpiry: string;
}

export interface Notification {
  id: string;
  type: "itinerary" | "bid" | "upcoming" | "message" | "review" | "alert";
  title: string;
  body: string;
  time: string;
  isRead: boolean;
}

export interface Review {
  id: string;
  authorName: string;
  authorInitials: string;
  rating: number;
  text: string;
  date: string;
  tourName?: string;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  isMe: boolean;
  time: string;
  image?: string;
}

export interface ChatThread {
  id: string;
  name: string;
  avatar: string;
  preview: string;
  time: string;
  unread: number;
  online: boolean;
  isGroup: boolean;
}
