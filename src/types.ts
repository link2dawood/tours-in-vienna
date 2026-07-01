/**
 * Types and interfaces for Tours in Vienna
 */

export interface Tour {
  id: string;
  title: string;
  tagline: string;
  description: string;
  longDescription: string;
  price: number;
  duration: string;
  category: "History & Culture" | "Nature & Sightseeing" | "Food & Wine" | "Music & Arts";
  groupSize: string;
  rating: number;
  reviewsCount: number;
  startPoint: string;
  highlights: string[];
  coordinates: { x: number; y: number; label: string };
  image: string;
}

export interface Booking {
  id: string;
  tourId: string;
  tourTitle: string;
  tourPrice: number;
  bookingDate: string;
  bookingTime: string;
  fullName: string;
  email: string;
  phone: string;
  guests: number;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  paymentStatus: 'paid' | 'unpaid';
  cardLast4: string;
  promoCode?: string;
}

export interface Review {
  id: string;
  tourId: string; // "general" or tour id
  tourTitle?: string;
  userName: string;
  rating: number;
  comment: string;
  createdAt: string;
  userAvatar: string;
}

export interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  author: string;
  image: string;
  readTime: string;
  category: string;
  comments: BlogComment[];
}

export interface BlogComment {
  id: string;
  userName: string;
  comment: string;
  createdAt: string;
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'replied';
}

export interface EmailLog {
  id: string;
  to: string;
  subject: string;
  body: string;
  sentAt: string;
  type: 'client_booking' | 'admin_booking' | 'client_inquiry' | 'admin_inquiry';
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  createdAt: string;
}

export interface UserProfile {
  uid: string;
  fullName: string;
  email: string;
  phone?: string;
  avatar: string;
  role: string;
  wishlist: string[]; // Tour IDs
  bookingsHistory: any[];
}
