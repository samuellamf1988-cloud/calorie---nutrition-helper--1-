// components/CalorieResultDisplay.tsx
import React from 'react';
import { CalorieResults, Profile } from '../types';
import { useLanguage } from '../context/LanguageContext';

interface CalorieResultDisplayProps {
  profile: Profile | null; // Now takes a full profile
}

const CalorieResultDisplay: React.FC<CalorieResultDisplayProps> = ({ profile }) => {
  const { translations } = useLanguage();

  if (!profile) {
    return (
      <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg mb-8" role="region" aria-labelledby="calorie-needs-title">
        <h2 id="calorie-needs-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">{translations.yourCalorieNeeds}</h2>
        <p className="text-center text-lg text-gray-700">{translations.noProfileSelected}</p>
      </div>
    );
  }

  return (
    <div className="p-6 bg-white rounded-lg shadow-md w-full max-w-lg mb-8" role="region" aria-labelledby="calorie-needs-title">
      <h2 id="calorie-needs-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">{translations.yourCalorieNeeds}</h2>
      <div className="space-y-4">
        <div className="flex justify-between items-center bg-blue-50 p-4 rounded-md">
          <span className="text-lg font-medium text-blue-800">{translations.bmr}</span>
          <span className="text-xl font-bold text-blue-600" aria-label={`BMR: ${Math.round(profile.bmr)} kcal`}>{Math.round(profile.bmr)} kcal</span>
        </div>
        {/* TDEE display removed as activity level is no longer an input for initial profile */}
        {/* <div className="flex justify-between items-center bg-green-50 p-4 rounded-md">
          <span className="text-lg font-medium text-green-800">{translations.tdee}</span>
          <span className="text-xl font-bold text-green-600" aria-label={`TDEE: ${Math.round(results.tdee)} kcal`}>{Math.round(results.tdee)} kcal</span>
        </div> */}
      </div>
      <p className="text-sm text-gray-600 mt-4 text-center">
        {translations.bmrDescription}
        {/* TDEE description removed */}
        {/* <br/>
        {translations.tdeeDescription} */}
      </p>
    </div>
  );
};

export default CalorieResultDisplay;