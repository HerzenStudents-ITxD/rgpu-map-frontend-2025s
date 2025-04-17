export interface UserSettings {
    theme: 'light' | 'dark';
    collectStats: boolean;
    language: string;
  }
  
  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    group: string;
    avatar?: string;
  }
  
  export interface FeedbackFormData {
    subject: string;
    message: string;
    contact?: string;
    section: string;
    photo: File | null;
  }

  export interface UserProfile {
    id: string;
    name: string;
    email: string;
    group: string;
    avatar?: string;
    institute?: string;
    formEducation?: string;
    degree?: string;
    course?: string;
    subGroup?: string;

  }