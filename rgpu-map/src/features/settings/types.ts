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
  }