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
  tcAccepted: z.literal(true, { errorMap: () => ({ message: "Devi accettare i Termini e Condizioni" }) }),
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