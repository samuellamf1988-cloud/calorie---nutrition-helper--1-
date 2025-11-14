// App.tsx
import React, { useState, useCallback, useEffect } from 'react';
import CalorieResultDisplay from './components/CalorieResultDisplay';
import NutritionAdvisor from './components/NutritionAdvisor';
import FoodImageAnalyzer from './components/FoodImageAnalyzer';
import ProfileManager from './components/ProfileManager'; // Import new component
import { Profile } from './types';
import { LanguageProvider, useLanguage, Language } from './context/LanguageContext';

function AppContent() {
  const { language, translations, setLanguage } = useLanguage();
  const [activeProfile, setActiveProfile] = useState<Profile | null>(() => {
    try {
      const storedActiveProfile = localStorage.getItem('activeProfile');
      return storedActiveProfile ? JSON.parse(storedActiveProfile) : null;
    } catch (e) {
      console.error("Failed to parse active profile from localStorage", e);
      return null;
    }
  });

  // Update localStorage whenever activeProfile changes
  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('activeProfile', JSON.stringify(activeProfile));
    } else {
      localStorage.removeItem('activeProfile');
    }
  }, [activeProfile]);

  // Removed toggleLanguage as individual buttons will directly set the language

  return (
    <div className="flex flex-col items-center justify-center p-4 bg-transparent w-full">
      <div className="w-full max-w-5xl flex justify-end mb-4">
        {/* Language Toggle Segmented Control */}
        <div className="flex bg-gray-200 rounded-full p-1 space-x-1">
          <button
            onClick={() => setLanguage('en')}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
              language === 'en' ? 'bg-teal-500 text-white shadow-sm' : 'bg-transparent text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="Switch to English"
          >
            EN
          </button>
          <button
            onClick={() => setLanguage('zh')}
            className={`px-4 py-2 rounded-full font-semibold transition duration-300 ${
              language === 'zh' ? 'bg-teal-500 text-white shadow-sm' : 'bg-transparent text-gray-700 hover:bg-gray-300'
            }`}
            aria-label="切换到中文"
          >
            中文
          </button>
        </div>
      </div>

      <h1 className="text-4xl font-extrabold text-blue-800 mb-10 text-center">
        {translations.appName}
      </h1>

      <div className="w-full max-w-lg mb-8">
        <ProfileManager onProfileSelect={setActiveProfile} selectedProfile={activeProfile} />
      </div>

      <div className="flex flex-col lg:flex-row lg:items-start lg:space-x-8 w-full max-w-5xl">
        {/* Left Column: Calorie Results & Nutrition Advisor */}
        <div className="flex flex-col items-center w-full lg:w-1/2 mb-8 lg:mb-0">
          <CalorieResultDisplay profile={activeProfile} />
          <NutritionAdvisor bmr={activeProfile ? activeProfile.bmr : null} />
        </div>

        {/* Right Column: Food Image Analyzer */}
        <div className="flex flex-col items-center w-full lg:w-1/2">
          <FoodImageAnalyzer />
        </div>
      </div>

      {/* Global API Billing Link at the bottom */}
      <p className="text-sm text-gray-500 mt-12 text-center w-full max-w-5xl">
        <a href="https://ai.google.dev/gemini-api/docs/billing" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
          {translations.apiBillingLink}
        </a>
      </p>
    </div>
  );
}

function App() {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
}

export default App;