// types.ts
export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE',
}

// ActivityLevel is kept for potential future use or if TDEE is re-introduced elsewhere.
export enum ActivityLevel {
  SEDENTARY = 'SEDENTARY',
  LIGHTLY_ACTIVE = 'LIGHTLY_ACTIVE',
  MODERATELY_ACTIVE = 'MODERATELY_ACTIVE',
  VERY_ACTIVE = 'VERY_ACTIVE',
  SUPER_ACTIVE = 'SUPER_ACTIVE',
}

export interface UserMetrics {
  age: number;
  gender: Gender;
  height: number; // in cm
  weight: number; // in kg
}

export interface CalorieResults {
  bmr: number;
  // TDEE removed as activity level is no longer an input for initial profile
  // tdee: number; 
}

export interface Profile extends UserMetrics {
  id: string;
  name: string;
  bmr: number;
}

export interface FoodImageAnalysisResult {
  estimatedCalories: number | null;
  evaluation: string;
  advice: string;
}