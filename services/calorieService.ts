// services/calorieService.ts
import { Gender } from '../types';
// import { ACTIVITY_MULTIPLIERS } from '../constants'; // Removed as no longer needed

/**
 * Calculates Basal Metabolic Rate (BMR) using the Mifflin-St Jeor Equation.
 * @param gender User's gender.
 * @param weight Weight in kilograms.
 * @param height Height in centimeters.
 * @param age Age in years.
 * @returns BMR in calories.
 */
export const calculateBMR = (
  gender: Gender,
  weight: number,
  height: number,
  age: number,
): number => {
  if (gender === Gender.MALE) {
    return (10 * weight) + (6.25 * height) - (5 * age) + 5;
  } else { // Female
    return (10 * weight) + (6.25 * height) - (5 * age) - 161;
  }
};

/**
 * calculateTDEE is removed as activity level is no longer an input for initial profile.
 * If needed, it would require a separate input for activity level after profile creation.
 */
/*
export const calculateTDEE = (bmr: number, activityLevel: ActivityLevel): number => {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  if (!multiplier) {
    throw new Error(`Unknown activity level: ${activityLevel}`);
  }
  return bmr * multiplier;
};
*/