export interface UserSettings {
  theme: 'light' | 'dark';
  collectStats: boolean;
  language: string;
}

export interface UserProfile {
  id: string;
  name: string;
  lastName: string; // Добавлено поле для фамилии
  email: string;
  group: string;
  faculty?: string; // Добавлено поле для факультета
  studyForm?: string; // Добавлено поле для формы обучения
  studyLevel?: string; // Добавлено поле для ступени обучения
  studyYear?: string; // Добавлено поле для года обучения
  subgroup?: string; // Добавлено поле для подгруппы
}

export interface FeedbackFormData {
  subject: string;
  message: string;
  contact?: string;
}