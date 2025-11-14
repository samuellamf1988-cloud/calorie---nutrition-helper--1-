// services/geminiService.ts
import { GoogleGenAI, GenerateContentResponse, Modality, Type } from "@google/genai";
import { AI_LANGUAGE_INSTRUCTION, DEFAULT_ADVICE_PROMPT, FOOD_IMAGE_ANALYSIS_PROMPT } from '../constants';
import { FoodImageAnalysisResult } from '../types';
import { Language } from '../context/LanguageContext'; // Import Language type

/**
 * Fetches nutrition advice from the Gemini API.
 * @param dailyCalories The user's estimated daily calorie needs.
 * @param userGoal A string describing the user's goal (e.g., "lose weight", "gain muscle").
 * @param dietaryPreferences A string describing any dietary preferences (e.g., "vegetarian", "low-carb").
 * @param language The desired response language for the AI.
 * @returns A promise that resolves to the generated nutrition advice text.
 */
export const getNutritionAdvice = async (
  dailyCalories: number,
  userGoal: string,
  dietaryPreferences: string,
  language: Language,
): Promise<string> => {
  try {
    // CRITICAL: Create a new GoogleGenAI instance right before making an API call.
    // This ensures it uses the most up-to-date API key from the environment.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-2.5-flash';

    let prompt = DEFAULT_ADVICE_PROMPT
      .replace('{calories}', dailyCalories.toString())
      .replace('{languageInstruction}', AI_LANGUAGE_INSTRUCTION[language]);

    if (userGoal) {
      prompt += ` My specific goal is to ${userGoal}.`;
    }
    if (dietaryPreferences) {
      prompt += ` I have the following dietary preferences/restrictions: ${dietaryPreferences}.`;
    }
    prompt += ` Please provide detailed and actionable advice.`;

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: prompt,
      config: {
        systemInstruction: `You are a highly knowledgeable and friendly nutrition expert. Provide clear, comprehensive, and encouraging advice on healthy eating, tailored to the user's calorie needs, goals, and preferences. Always prioritize health and sustainability. ${AI_LANGUAGE_INSTRUCTION[language]}`,
        temperature: 0.7,
        topP: 0.95,
        topK: 64,
      },
    });

    if (response && response.text) {
      return response.text;
    } else {
      console.error("Gemini API response did not contain text.", response);
      throw new Error("Failed to get nutrition advice: Empty response from AI.");
    }
  } catch (error) {
    console.error("Error fetching nutrition advice from Gemini API:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      // This is a specific error often related to API key issues.
      // The calling component will handle prompting the user to re-select their key.
      throw new Error("Requested entity was not found. Please ensure your API key is correctly configured.");
    }
    throw new Error(`Failed to get nutrition advice: ${error instanceof Error ? error.message : String(error)}`);
  }
};

/**
 * Analyzes a food image to estimate calories and provide nutrition advice using the Gemini API.
 * @param base64Image The base64 encoded string of the food image.
 * @param mimeType The MIME type of the image (e.g., 'image/jpeg', 'image/png').
 * @param language The desired response language for the AI.
 * @returns A promise that resolves to the structured FoodImageAnalysisResult.
 */
export const analyzeFoodImage = async (
  base64Image: string,
  mimeType: string,
  language: Language,
): Promise<FoodImageAnalysisResult> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const modelName = 'gemini-2.5-flash-image'; // This model does not support JSON responseMimeType/responseSchema

    const imagePart = {
      inlineData: {
        mimeType: mimeType,
        data: base64Image,
      },
    };
    const textPart = {
      text: FOOD_IMAGE_ANALYSIS_PROMPT.replace('{languageInstruction}', AI_LANGUAGE_INSTRUCTION[language]), // The prompt will now guide for JSON output and language
    };

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: modelName,
      contents: { parts: [imagePart, textPart] },
      config: {
        // Removed responseMimeType: "application/json",
        // Removed responseSchema, as this model does not support it directly via config.
        // Instead, the prompt will instruct the model to generate JSON as text.
      },
    });

    if (response && response.text) {
      let jsonStr = response.text.trim();
      // Attempt to extract JSON from markdown code block if present
      const jsonMatch = jsonStr.match(/```json\n([\s\S]*?)\n```/);
      if (jsonMatch && jsonMatch[1]) {
        jsonStr = jsonMatch[1].trim();
      }
      
      try {
        const result: FoodImageAnalysisResult = JSON.parse(jsonStr);
        return result;
      } catch (jsonError) {
        console.error("Failed to parse Gemini API JSON response:", jsonError, "Raw response text:", response.text);
        // If parsing fails, provide a default error structure
        // This is important for graceful degradation and user feedback
        return {
          estimatedCalories: null,
          evaluation: `AI response format was unexpected. Please try with a clearer food image or a different prompt. (${AI_LANGUAGE_INSTRUCTION[language]})`,
          advice: `Ensure the image is clear and depicts food items. The AI might not have returned a valid JSON structure. (${AI_LANGUAGE_INSTRUCTION[language]})`
        };
      }
    } else {
      console.error("Gemini API response did not contain text for image analysis.", response);
      throw new Error("Failed to analyze image: Empty or invalid response from AI.");
    }
  } catch (error) {
    console.error("Error analyzing food image with Gemini API:", error);
    if (error instanceof Error && error.message.includes("Requested entity was not found.")) {
      throw new Error("Requested entity was not found. Please ensure your API key is correctly configured.");
    }
    throw new Error(`Failed to analyze food image: ${error instanceof Error ? error.message : String(error)}`);
  }
};