// components/ProfileForm.tsx
import React, { useState, useEffect } from 'react';
import { Gender, UserMetrics, Profile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import NumberSpinnerInput from './NumberSpinnerInput';
import { calculateBMR } from '../services/calorieService';

interface ProfileFormProps {
  initialProfile?: Profile | null;
  onSubmit: (profile: Profile) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const ProfileForm: React.FC<ProfileFormProps> = ({ initialProfile, onSubmit, onCancel, isLoading }) => {
  const { translations } = useLanguage();
  const [name, setName] = useState<string>(initialProfile?.name || '');
  const [age, setAge] = useState<number>(initialProfile?.age || 30);
  const [gender, setGender] = useState<Gender>(initialProfile?.gender || Gender.MALE);
  const [height, setHeight] = useState<number>(initialProfile?.height || 175); // cm
  const [weight, setWeight] = useState<number>(initialProfile?.weight || 70); // kg

  useEffect(() => {
    if (initialProfile) {
      setName(initialProfile.name);
      setAge(initialProfile.age);
      setGender(initialProfile.gender);
      setHeight(initialProfile.height);
      setWeight(initialProfile.weight);
    } else {
      setName('');
      setAge(30);
      setGender(Gender.MALE);
      setHeight(175);
      setWeight(70);
    }
  }, [initialProfile]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bmr = calculateBMR(gender, weight, height, age);
    onSubmit({
      id: initialProfile?.id || Date.now().toString(), // Use existing ID or generate new one
      name,
      age,
      gender,
      height,
      weight,
      bmr,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 bg-white rounded-lg shadow-md w-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {initialProfile ? translations.updateProfile : translations.addProfile}
      </h2>

      <div className="mb-4">
        <label htmlFor="profileName" className="block text-gray-700 text-sm font-semibold mb-2">
          {translations.profileName}
        </label>
        <input
          type="text"
          id="profileName"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={translations.enterProfileName}
          required
          aria-label={translations.profileName}
        />
      </div>

      <NumberSpinnerInput
        id="age"
        label={translations.age}
        value={age}
        onChange={setAge}
        min={1}
        max={120}
        className="mb-4"
        ariaLabel={translations.age}
      />

      <div className="mb-4">
        <label htmlFor="gender" className="block text-gray-700 text-sm font-semibold mb-2">{translations.gender}</label>
        <select
          id="gender"
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={gender}
          onChange={(e) => setGender(e.target.value as Gender)}
          aria-label={translations.gender}
        >
          <option value={Gender.MALE}>{translations.male}</option>
          <option value={Gender.FEMALE}>{translations.female}</option>
        </select>
      </div>

      <NumberSpinnerInput
        id="height"
        label={translations.height}
        value={height}
        onChange={setHeight}
        min={50}
        max={250}
        className="mb-4"
        ariaLabel={translations.height}
      />

      <NumberSpinnerInput
        id="weight"
        label={translations.weight}
        value={weight}
        onChange={setWeight}
        min={10}
        max={300}
        step={1} // Changed from 0.1 to 1 to enforce integer input
        className="mb-6"
        ariaLabel={translations.weight}
      />

      <div className="flex justify-between space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 bg-gray-300 text-gray-800 py-3 rounded-md font-semibold hover:bg-gray-400 transition duration-300"
          aria-label="Cancel"
        >
          Cancel
        </button>
        <button
          type="submit"
          className={`flex-1 bg-blue-600 text-white py-3 rounded-md font-semibold hover:bg-blue-700 transition duration-300 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          disabled={isLoading}
          aria-label={initialProfile ? translations.updateProfile : translations.addProfile}
        >
          {isLoading ? translations.calculating : (initialProfile ? translations.updateProfile : translations.addProfile)}
        </button>
      </div>
    </form>
  );
};

export default ProfileForm;