import React from 'react';

export enum View {
  SPLASH = 'SPLASH',
  HERO = 'HERO',
  HOME = 'HOME',
  LOGIN = 'LOGIN',
  COURSE = 'COURSE',
  LIVE_AUDIO = 'LIVE_AUDIO',
  VEO_VIDEO = 'VEO_VIDEO',
  IMAGE_EDITOR = 'IMAGE_EDITOR',
  IMAGE_GEN = 'IMAGE_GEN',
  VIDEO_ANALYZE = 'VIDEO_ANALYZE',
  TTS = 'TTS',
  TRANSCRIBE = 'TRANSCRIBE',
  GENERAL_TASK = 'GENERAL_TASK'
}

export interface NavItem {
  id: View;
  label: string;
  icon: React.ReactNode;
  description: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  image?: string;
}

// New types for authentication and progress
export interface User {
  id: string;
  name: string;
  email: string;
  enrolledCourses: string[]; // Course IDs: 'matrice-1', 'matrice-2', 'ascension-box'
  level: string; // "Acolyte", "Adept", "Master", etc.
  xp: number;
  createdAt: string;
}

export interface ModuleProgress {
  moduleId: string;
  completed: boolean;
  completedAt?: string;
  timeSpent?: number; // seconds
}

export interface CourseProgress {
  courseId: string;
  modules: ModuleProgress[];
  startedAt: string;
  completedAt?: string;
}