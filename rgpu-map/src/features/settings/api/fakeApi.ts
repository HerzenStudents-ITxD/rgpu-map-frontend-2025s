import { UserSettings, UserProfile, FeedbackFormData } from '../types';

let mockSettings: UserSettings = {
  theme: 'light',
  collectStats: false,
  language: 'ru'
};

let mockProfile: UserProfile = {
  id: 'user-123',
  name: 'Иван Иванов',
  email: 'user@university.ru',
  group: 'Студент'
};

export const fetchSettings = (): Promise<UserSettings> => {
  return new Promise(resolve => {
    const saved = localStorage.getItem('settings');
    if(saved) mockSettings = JSON.parse(saved);
    setTimeout(() => resolve(mockSettings), 500);
  });
};

export const saveSettings = (settings: Partial<UserSettings>): Promise<UserSettings> => {
  mockSettings = { ...mockSettings, ...settings };
  localStorage.setItem('settings', JSON.stringify(mockSettings));
  return Promise.resolve(mockSettings);
};

export const fetchProfile = (): Promise<UserProfile> => {
  return new Promise(resolve => {
    const saved = localStorage.getItem('profile');
    if(saved) mockProfile = JSON.parse(saved);
    setTimeout(() => resolve(mockProfile), 500);
  });
};

export const updateProfile = (profile: Partial<UserProfile>): Promise<UserProfile> => {
  mockProfile = { ...mockProfile, ...profile };
  localStorage.setItem('profile', JSON.stringify(mockProfile));
  return Promise.resolve(mockProfile);
};

export const sendFeedback = (data: FeedbackFormData): Promise<boolean> => {
  console.log('Feedback submitted:', data);
  return Promise.resolve(true);
};