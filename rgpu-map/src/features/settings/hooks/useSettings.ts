import { useState, useEffect } from 'react';
import { 
  fetchSettings, 
  saveSettings, 
  fetchProfile, 
  updateProfile 
} from '../api/fakeApi';
import { UserSettings, UserProfile } from '../types';

export const useSettings = () => {
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [settingsData, profileData] = await Promise.all([
          fetchSettings(),
          fetchProfile()
        ]);
        setSettings(settingsData);
        setProfile(profileData);
      } catch (error) {
        console.error('Error loading settings:', error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const updateSettings = async (newSettings: Partial<UserSettings>) => {
    if(!settings) return;
    const updated = await saveSettings(newSettings);
    setSettings(updated);
  };

  const updateUserProfile = async (newProfile: Partial<UserProfile>) => {
    if(!profile) return;
    const updated = await updateProfile(newProfile);
    setProfile(updated);
  };

  return {
    settings,
    profile,
    loading,
    updateSettings,
    updateUserProfile
  };
};