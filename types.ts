
export enum NexusModule {
  DASHBOARD = 'dashboard',
  CHAT = 'chat',
  CANVAS = 'canvas',
  VOICE = 'voice',
  LENS = 'lens',
  PROFILE = 'profile',
  SETTINGS = 'settings',
  AUTH = 'auth',
  ADMIN = 'admin'
}

export type UserTier = 'basic' | 'elite';

export interface User {
  id: string;
  username: string;
  email: string;
  tier: UserTier;
  credits: number;
  avatar: string;
  lastActive?: number; // Timestamp de dernière activité
  registeredAt?: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  imageUrl?: string;
}

export interface CanvasHistory {
  id: string;
  prompt: string;
  imageUrl: string;
  timestamp: number;
}
