// components/ProfileManager.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Profile } from '../types';
import { useLanguage } from '../context/LanguageContext';
import ProfileForm from './ProfileForm'; // Use the new ProfileForm

interface ProfileManagerProps {
  onProfileSelect: (profile: Profile | null) => void;
  selectedProfile: Profile | null;
}

const ProfileManager: React.FC<ProfileManagerProps> = ({ onProfileSelect, selectedProfile }) => {
  const { translations } = useLanguage();
  const [profiles, setProfiles] = useState<Profile[]>(() => {
    try {
      const storedProfiles = localStorage.getItem('userProfiles');
      return storedProfiles ? JSON.parse(storedProfiles) : [];
    } catch (e) {
      console.error("Failed to parse user profiles from localStorage", e);
      return [];
    }
  });
  const [showProfileForm, setShowProfileForm] = useState<boolean>(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Update localStorage whenever profiles change
  useEffect(() => {
    localStorage.setItem('userProfiles', JSON.stringify(profiles));
  }, [profiles]);

  const handleAddOrUpdateProfile = useCallback((newProfile: Profile) => {
    setIsLoading(true);
    setProfiles(prevProfiles => {
      const existingIndex = prevProfiles.findIndex(p => p.id === newProfile.id);
      if (existingIndex > -1) {
        // Update existing profile
        const updatedProfiles = [...prevProfiles];
        updatedProfiles[existingIndex] = newProfile;
        // If the updated profile was the selected one, re-select it
        if (selectedProfile && selectedProfile.id === newProfile.id) {
          onProfileSelect(newProfile);
        }
        return updatedProfiles;
      } else {
        // Add new profile
        const updatedProfiles = [...prevProfiles, newProfile];
        // Automatically select the new profile
        onProfileSelect(newProfile);
        return updatedProfiles;
      }
    });
    setShowProfileForm(false);
    setEditingProfile(null);
    setIsLoading(false);
  }, [onProfileSelect, selectedProfile]);

  const handleDeleteProfile = useCallback((profileId: string, profileName: string) => {
    if (window.confirm(translations.confirmDeleteProfile.replace('{profileName}', profileName))) {
      setProfiles(prevProfiles => {
        const updatedProfiles = prevProfiles.filter(p => p.id !== profileId);
        // If the deleted profile was the selected one, deselect it
        if (selectedProfile && selectedProfile.id === profileId) {
          onProfileSelect(null);
        }
        return updatedProfiles;
      });
    }
  }, [onProfileSelect, selectedProfile, translations]);

  const startCreateProfile = useCallback(() => {
    if (profiles.length >= 3) {
      alert(translations.maxProfilesReached);
      return;
    }
    setEditingProfile(null);
    setShowProfileForm(true);
  }, [profiles.length, translations]);

  const startEditProfile = useCallback((profile: Profile) => {
    setEditingProfile(profile);
    setShowProfileForm(true);
  }, []);

  const cancelForm = useCallback(() => {
    setShowProfileForm(false);
    setEditingProfile(null);
  }, []);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md mb-8 w-full max-w-lg" role="region" aria-labelledby="profile-manager-title">
      <h2 id="profile-manager-title" className="text-2xl font-bold text-gray-800 mb-6 text-center">{translations.profileManagerTitle}</h2>

      {showProfileForm ? (
        <ProfileForm
          initialProfile={editingProfile}
          onSubmit={handleAddOrUpdateProfile}
          onCancel={cancelForm}
          isLoading={isLoading}
        />
      ) : (
        <>
          {profiles.length > 0 && (
            <div className="space-y-4 mb-6">
              {profiles.map(profile => (
                <div key={profile.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-md border border-gray-200">
                  <div className="flex-1 mr-4">
                    <p className="font-semibold text-gray-800">{profile.name}</p>
                    <p className="text-sm text-gray-600">
                      {profile.age} {translations.age}, {profile.height}cm, {profile.weight}kg
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => startEditProfile(profile)}
                      className="p-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition duration-300"
                      aria-label={`Edit ${profile.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.38-2.829-2.828z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => {
                        if (selectedProfile?.id === profile.id) {
                          onProfileSelect(null); // Deselect if already active
                        } else {
                          onProfileSelect(profile); // Select if not active
                        }
                      }}
                      className={`px-3 py-2 rounded-md font-semibold transition duration-300 ${
                        selectedProfile?.id === profile.id
                          ? 'bg-green-600 text-white' // Style for active
                          : 'bg-blue-500 text-white hover:bg-blue-600' // Style for inactive
                      }`}
                      aria-label={
                        selectedProfile?.id === profile.id
                          ? translations.deselectProfileLabel.replace('{profileName}', profile.name)
                          : translations.selectProfileLabel.replace('{profileName}', profile.name)
                      }
                    >
                      {selectedProfile?.id === profile.id ? '✓' : translations.selectProfile}
                    </button>
                    <button
                      onClick={() => handleDeleteProfile(profile.id, profile.name)}
                      className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300"
                      aria-label={`Delete ${profile.name}`}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm6 0a1 1 0 11-2 0v6a1 1 0 112 0V8z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {selectedProfile && (
            <p className="text-center text-lg text-gray-700 mb-4">
              {translations.activeProfile} <span className="font-bold text-blue-600">{selectedProfile.name}</span>
            </p>
          )}

          <button
            onClick={startCreateProfile}
            className="w-full bg-green-600 text-white py-3 rounded-md font-semibold hover:bg-green-700 transition duration-300"
            disabled={profiles.length >= 3}
            aria-label={translations.createNewProfile}
          >
            {translations.createNewProfile}
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileManager;