import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

interface TranslationResources {
  settings: {
    title: string;
    language: string;
    save: string;
    profile: string;
    darkMode: string;
    changeLanguage: string;
    feedback: string;
    collectStats: string;
    collectStatsInfo: string;
  };
  navbar: {
    home: string;
    news: string;
    routes: string;
    schedule: string;
    settings: string;
  };
  news: {
    title: string;
    publish: string;
    createPost: string;
    titlePlaceholder: string;
    description: string;
    addImage: string;
    imageAdded: string;
    routePoint: string;
    cancel: string;
    participate: string;
    buildRoute: string;
  };
}

type SupportedLanguages = 'en' | 'ru' | 'cn';

const resources: Record<SupportedLanguages, { translation: TranslationResources }> = {
  en: {
    translation: {
      settings: {
        title: 'Settings',
        language: 'Select Language',
        save: 'Save',
        profile: 'Profile',
        darkMode: 'Dark Mode',
        changeLanguage: 'Change Language',
        feedback: 'Feedback',
        collectStats: 'Collect Statistics',
        collectStatsInfo: 'Why collect statistics?',
      },
      navbar: {
        home: 'Home',
        news: 'News',
        routes: 'Routes',
        schedule: 'Schedule',
        settings: 'Settings',
      },
      news: {
        title: 'News',
        publish: 'Publish',
        createPost: 'Create Post',
        titlePlaceholder: 'Title',
        description: 'Description',
        addImage: 'Add Image',
        imageAdded: 'Image Added',
        routePoint: 'Route Point',
        cancel: 'Cancel',
        participate: 'Participate',
        buildRoute: 'Build Route',
      },
    },
  },
  ru: {
    translation: {
      settings: {
        title: 'Настройки',
        language: 'Выбор языка',
        save: 'Сохранить',
        profile: 'Профиль',
        darkMode: 'Темная тема',
        changeLanguage: 'Сменить язык',
        feedback: 'Обратная связь',
        collectStats: 'Сбор статистики',
        collectStatsInfo: 'Зачем собирать статистику?',
      },
      navbar: {
        home: 'Главная',
        news: 'Новости',
        routes: 'Маршруты',
        schedule: 'Расписание',
        settings: 'Настройки',
      },
      news: {
        title: 'Новости',
        publish: 'Опубликовать',
        createPost: 'Создать пост',
        titlePlaceholder: 'Заголовок',
        description: 'Описание',
        addImage: 'Добавить картинку',
        imageAdded: 'Картинка добавлена',
        routePoint: 'Точка маршрута',
        cancel: 'Отменить',
        participate: 'Участвую',
        buildRoute: 'Проложить маршрут',
      },
    },
  },
  cn: {
    translation: {
      settings: {
        title: '设置',
        language: '选择语言',
        save: '保存',
        profile: '个人资料',
        darkMode: '深色模式',
        changeLanguage: '更改语言',
        feedback: '反馈',
        collectStats: '收集统计数据',
        collectStatsInfo: '为什么要收集统计数据？',
      },
      navbar: {
        home: '首页',
        news: '新闻',
        routes: '路线',
        schedule: '课程表',
        settings: '设置',
      },
      news: {
        title: '新闻',
        publish: '发布',
        createPost: '创建帖子',
        titlePlaceholder: '标题',
        description: '描述',
        addImage: '添加图片',
        imageAdded: '图片已添加',
        routePoint: '路线点',
        cancel: '取消',
        participate: '参与',
        buildRoute: '建立路线',
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

export default i18n;

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: {
      translation: TranslationResources;
    };
  }
}