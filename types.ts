
export interface User {
  id: string;
  name: string;
  phoneNumber: string;
  avatar: string;
  subscriptionStatus: 'active' | 'inactive';
}

export interface Seller {
  id: string;
  name: string;
  avatar: string;
  isVerified: boolean;
  rating: number;
  joinedDate: string;
}

export interface Product {
  id: string;
  name: string;
  category: 'Food' | 'Fashion' | 'Service' | 'Tech' | 'Home' | 'Other';
  price: number;
  currency: 'USD' | 'FC';
  images: string[]; // Changed from single image string to array
  description: string;
  location: string;
  distance: string; // e.g., "1.2 km"
  seller: Seller;
  condition?: 'New' | 'Used' | 'Refurbished';
  stock: number;
  likes: number;
}

export type MessageType = 'text' | 'image' | 'audio' | 'video' | 'document';
export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read';

export interface Message {
  id: string;
  senderId: string;
  text: string; // Or caption for media
  mediaUrl?: string;
  mediaDuration?: string; // For audio/video
  fileName?: string; // For documents
  fileSize?: string; // For documents
  type: MessageType;
  timestamp: Date;
  status: MessageStatus;
  isMe: boolean;
  replyTo?: {
    id: string;
    text: string;
    senderName: string;
  };
  reactions?: string[];
}

export type ChatRole = 'admin' | 'moderator' | 'member';

export interface ChatSession {
  id: string;
  type: 'private' | 'group';
  name: string;
  lastMessage: string;
  lastMessageTime: Date;
  avatar: string;
  unread: number;
  isOnline?: boolean;
  isTyping?: boolean;
  members?: string[]; // Names of members for groups
  memberRoles?: Record<string, ChatRole>; // Map Member Name -> Role
}

export interface NetworkMetrics {
  latency: number; // RTT in ms
  jitter: number; // Variance in ms
  packetLoss: number; // Percentage
  bitrate: number; // kbps (Adaptive)
  bufferSize: number; // ms (Adaptive Jitter Buffer)
  mos: number; // Mean Opinion Score (1-5)
}

export enum AppTab {
  HOME = 'home',
  CHAT = 'chat',
  VIDEO = 'video',
  MARKET = 'market',
  HEALTH = 'health', // Now hidden from main nav, accessed via Profile
  PROFILE = 'profile',
  SERVICES = 'services',
  JOBS = 'jobs',
  ADVICE = 'advice',
  FEED = 'feed'
}

export interface HealthMetric {
  date: string;
  value: number;
}