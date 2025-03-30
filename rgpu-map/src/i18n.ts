import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Определяем типы для переводов
interface TranslationResources {
  settings: {
    title: string;
    language: string;
    save: string;
  };
  navbar: {
    home: string;
    news: string;
    routes: string;
    schedule: string;
    settings: string;
  };
}

// Определяем поддерживаемые языки
type SupportedLanguages = 'en' | 'ru' | 'cn';

// Ресурсы переводов
const resources: Record<SupportedLanguages, { translation: TranslationResources }> = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        language: 'Select Language',
        save: 'Save',
      },
      navbar: {
        home: 'Home',
        news: 'News',
        routes: 'Routes',
        schedule: 'Schedule',
        settings: 'Settings',
      },
    },
  },
  ru: {
    translation: {
      settings: {
        title: 'Настройки',
        language: 'Выбор языка',
        save: 'Сохранить',
      },
      navbar: {
        home: 'Главная',
        news: 'Новости',
        routes: 'Маршруты',
        schedule: 'Расписание',
        settings: 'Настройки',
      },
    },
  },
  cn: {
    translation: {
      settings: {
        title: '设置',
        language: '选择语言',
        save: '保存',
      },
      navbar: {
        home: '首页',
        news: '新闻',
        routes: '路线',
        schedule: '课程表',
        settings: '设置',
      },
    },
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ru',
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
    },
  });

// Экспортируем i18n для использования в других местах
export default i18n;

// Экспортируем типы для использования в хуке useTranslation
declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResources;
    };
  }
}