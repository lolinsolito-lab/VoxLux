import React from 'react';
import { z } from 'zod';

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
  GENERAL_TASK = 'GENERAL_TASK',
  SUPPORT = 'SUPPORT'
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
  role: 'user' | 'admin' | 'god'; // Security Role
  createdAt: string;
}

// --- ZOD SCHEMAS FOR INPUT VALIDATION ---

export const LoginSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(6, "La password deve essere di almeno 6 caratteri"),
});

export const SignupSchema = z.object({
  email: z.string().email("Inserisci un'email valida"),
  password: z.string().min(8, "La password deve essere di almeno 8 caratteri").regex(/[A-Z]/, "Serve almeno una maiuscola").regex(/[0-9]/, "Serve almeno un numero"),
  fullName: z.string().min(2, "Inserisci il tuo nome completo"),
  phone: z.string().min(10, "Numero di telefono non valido").optional(),
  tcAccepted: z.boolean().refine(val => val === true, { message: "Devi accettare i Termini e Condizioni" }),
});

export const CheckoutSchema = z.object({
  email: z.string().email(),
  courseId: z.string(),
  priceId: z.string(),
});


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

// --- LEGAL ARMORING TYPES ---
export interface UserContract {
  id: string;
  user_id: string;
  contract_version: string;
  signed_at: string;
  ip_address?: string;
  agreements: {
    refund_waiver: boolean;
    privacy_policy: boolean;
    anti_piracy: boolean;
    marketing_consent: boolean;
  };
  pdf_url?: string;
}

// --- LMS EVOLUTION TYPES ---
export interface LessonResource {
  title: string;
  url: string;
  type: 'pdf' | 'link' | 'file';
}

export interface Lesson {
  id: string;
  module_id: string;
  title: string;
  description?: string;
  video_provider: 'youtube' | 'vimeo' | 'custom';
  video_id: string;
  duration_minutes: number;
  order_index: number;
  resources: LessonResource[];
  is_free_preview: boolean;
  // Computed/Joined fields
  completed?: boolean;
}

export interface Module {
  id: string;
  course_id: string;
  title: string;
  description?: string;
  order_index: number;
  is_locked: boolean;
  lessons: Lesson[];
}

// --- PHASE 2: QUIZ & DIPLOMA TYPES ---

export interface QuizQuestion {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number; // Index of correct option
  explanation?: string; // Shown after answer
}

export interface QuizData {
  questions: QuizQuestion[];
  passingScore: number; // 0-100
  timeLimitMinutes?: number;
}

export interface Diploma {
  id: string;
  userId: string;
  courseId: string;
  certificateCode: string;
  issuedAt: string;
  metadata: {
    userName: string;
    courseTitle: string;
    score?: number;
  };
}