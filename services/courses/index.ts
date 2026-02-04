// Central export point for all course data
export * from './types';
export { matrice1 } from './matrice1';
export { matrice2 } from './matrice2';
export { ascensionBox } from './ascensionBox';

import { Course } from './types';
import { matrice1 } from './matrice1';
import { matrice2 } from './matrice2';
import { ascensionBox } from './ascensionBox';

// Main courses object for easy access
export const COURSES: Record<string, Course> = {
    'matrice-1': matrice1,
    'matrice-2': matrice2,
    'ascension-box': ascensionBox
};

// Re-export types for backward compatibility
export type { Module, Mastermind, Course } from './types';
