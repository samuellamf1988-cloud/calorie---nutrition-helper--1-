// constants.ts
// import { ActivityLevel } from './types'; // Removed ActivityLevel import as it's no longer used for calculations here
import { Language } from './context/LanguageContext';

// Removed as activity level is no longer an input for initial profile
// export const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
//   [ActivityLevel.SEDENTARY]: 1.2, // Little to no exercise, desk job
//   [ActivityLevel.LIGHTLY_ACTIVE]: 1.375, // Light exercise/sports 1-3 days/week
//   [ActivityLevel.MODERATELY_ACTIVE]: 1.55, // Moderate exercise/sports 3-5 days/week
//   [ActivityLevel.VERY_ACTIVE]: 1.725, // Hard exercise/sports 6-7 days a week
//   [ActivityLevel.SUPER_ACTIVE]: 1.9, // Very hard exercise/physical job
// };

export const AI_LANGUAGE_INSTRUCTION: Record<Language, string> = {
  en: "Respond in English.",
  zh: "请用中文回答。",
};

export const DEFAULT_ADVICE_PROMPT = `Based on a Basal Metabolic Rate (BMR) of {calories} calories, please provide general healthy eating advice. Include suggestions for macronutrient distribution (carbs, protein, fat) and examples of suitable foods for each meal. Focus on balanced nutrition and sustainable habits. {languageInstruction}`;

export const FOOD_IMAGE_ANALYSIS_PROMPT = `You are a highly knowledgeable food and nutrition expert. Based on the provided image of food, accurately estimate the total calorie count (a numerical value in kcal, e.g., 350), provide a brief evaluation of its healthiness, and offer scientific dietary advice. Your response MUST be a JSON object, wrapped in a markdown code block like this: \`\`\`json { "estimatedCalories": number | null, "evaluation": string, "advice": string } \`\`\`. If calorie estimation is not possible or the image does not clearly show food, set "estimatedCalories" to null and provide a helpful message in "evaluation" and "advice". {languageInstruction}`;