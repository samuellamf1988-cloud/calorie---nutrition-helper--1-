// components/NutritionAdvisor.tsx
import React, { useState, useCallback } from 'react';
import { getNutritionAdvice } from '../services/geminiService';
import LoadingSpinner from './LoadingSpinner';
import { marked } from 'marked'; // For rendering markdown
import { useLanguage } from '../context/LanguageContext';

interface NutritionAdvisorProps {
  bmr: number | null; // Changed from dailyCalories to bmr
}

const NutritionAdvisor: React.FC<NutritionAdvisorProps> = ({ bmr }) => {
  const { translations, language } = useLanguage(); // Get language
  const [userGoal, setUserGoal] = useState<string>('');
  const [dietaryPreferences, setDietaryPreferences] = useState<string>('');
  const [advice, setAdvice] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAdvice = useCallback(async () => {
    if (bmr === null) {
      setError(translations.advicePlaceholder);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAdvice(null);
    try {
      const generatedAdvice = await getNutritionAdvice(bmr, userGoal, dietaryPreferences, language); // Pass bmr and language
      setAdvice(generatedAdvice);
    } catch (err: any) {
      console.error("Failed to fetch nutrition advice:", err);
      let errorMessage = translations.failedToFetchAdvice;
      if (err instanceof Error && err.message.includes("Requested entity was not found.")) {
        errorMessage = translations.alertApiIssue;
        await (window as any).aistudio.openSelectKey(); // Prompt user to select key only on this specific error
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [bmr, userGoal, dietaryPreferences, translations, language]); // Add language to dependencies

  // Helper to render markdown safely
  const renderMarkdown = (markdownText: string) => {
    return { __html: marked.parse(markdownText) };
  };

  const isProfileSelected = bmr !== null;

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg" role="region" aria-labelledby="nutrition-advisor-title">
      <h2 id="nutrition-advisor-title" className="text-2xl font-bold text-gray-800 mb-2 text-center">{translations.nutritionAdvisor}</h2>
      <p className="text-center text-gray-700 text-sm mb-4">{translations.nutritionAdvisorSubtitle}</p>

      {!isProfileSelected ? (
        <p className="text-center text-lg text-gray-700 mb-4">
          {translations.calculateCaloriesFirst}
        </p>
      ) : (
        <>
          <p className="text-center text-lg text-gray-700 mb-4">
            {translations.dailyCalorieNeedIs} <span className="font-bold text-blue-600">{Math.round(bmr)} kcal</span>
          </p>

          <div className="mb-4">
            <label htmlFor="userGoal" className="block text-gray-700 text-sm font-semibold mb-2">
              {translations.yourGoal}
            </label>
            <input
              type="text"
              id="userGoal"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={userGoal}
              onChange={(e) => setUserGoal(e.target.value)}
              placeholder={translations.goalPlaceholder}
              aria-label={translations.yourGoal}
            />
          </div>

          <div className="mb-6">
            <label htmlFor="dietaryPreferences" className="block text-gray-700 text-sm font-semibold mb-2">
              {translations.dietaryPreferences}
            </label>
            <textarea
              id="dietaryPreferences"
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              value={dietaryPreferences}
              onChange={(e) => setDietaryPreferences(e.target.value)}
              placeholder={translations.dietaryPlaceholder}
              aria-label={translations.dietaryPreferences}
            ></textarea>
          </div>

          <button
            onClick={fetchAdvice}
            className={`w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
            disabled={isLoading}
            aria-label={isLoading ? translations.gettingAdvice : translations.getAdvice}
          >
            {isLoading ? translations.gettingAdvice : translations.getAdvice}
          </button>
        </>
      )}

      {error && <p className="text-red-600 mt-4 text-center" role="alert">{error}</p>}

      {isLoading && <LoadingSpinner />}

      {advice && (
        <div className="mt-8 p-6 bg-gray-50 rounded-lg border border-gray-200" role="complementary" aria-labelledby="personalized-advice-title">
          <h3 id="personalized-advice-title" className="text-xl font-bold text-gray-800 mb-4">{translations.personalizedAdvice}</h3>
          <div className="prose max-w-none text-gray-700" dangerouslySetInnerHTML={renderMarkdown(advice)} />
        </div>
      )}
    </div>
  );
};

export default NutritionAdvisor;