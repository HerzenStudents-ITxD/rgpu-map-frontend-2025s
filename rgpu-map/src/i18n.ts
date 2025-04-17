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
    routebuilder: string;
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
  schedule: {
    title: string;
    noEvents: string;
  };
  routes: {
    title: string;
  };
  topBar: {
    search: string;
    locateMe: string;
  };
  rightBar: {
    lectureBoard: string;
    teachers: string;
    planets: string;
    coordinates: string;
    library: string;
  };
  sidebar: {
    pointDetails: string;
    pointId: string;
    coordinates: string;
    createdBy: string;
  };
  admin: {
    title: string;
    points: string;
    users: string;
    addPoint: string;
    pointsList: string;
    usersList: string;
    add: string;
    editPoint: string;
    save: string;
    cancel: string;
    role: string;
    guest: string;
    moderator: string;
    admin: string;
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
        routebuilder: 'Routes',
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
      schedule: {
        title: 'Schedule',
        noEvents: 'No events for this day',
      },
      routes: {
        title: 'Routes',
      },
      topBar: {
        search: 'Search',
        locateMe: 'Locate Me',
      },
      rightBar: {
        lectureBoard: 'Lecture Board',
        teachers: 'Teachers',
        planets: 'Planets',
        coordinates: 'Coordinates',
        library: 'Library',
      },
      sidebar: {
        pointDetails: 'Point Details',
        pointId: 'Point ID',
        coordinates: 'Coordinates',
        createdBy: 'Created By',
      },
      admin: {
        title: 'Admin Panel',
        points: 'Points',
        users: 'Users',
        addPoint: 'Add New Point',
        pointsList: 'Points List',
        usersList: 'Users List',
        add: 'Add',
        editPoint: 'Edit Point',
        save: 'Save',
        cancel: 'Cancel',
        role: 'Role',
        guest: 'Guest',
        moderator: 'Moderator',
        admin: 'Admin',
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
        routebuilder: 'Маршруты',
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
      schedule: {
        title: 'Расписание',
        noEvents: 'Нет событий на этот день',
      },
      routes: {
        title: 'Маршруты',
      },
      topBar: {
        search: 'Поиск',
        locateMe: 'Вы раз?',
      },
      rightBar: {
        lectureBoard: 'Лекционная доска',
        teachers: 'Учителя',
        planets: 'Планеты',
        coordinates: 'Координаты',
        library: 'Библиотека',
      },
      sidebar: {
        pointDetails: 'Информация о точке',
        pointId: 'ID точки',
        coordinates: 'Координаты',
        createdBy: 'Создано пользователем',
      },
      admin: {
        title: 'Панель администратора',
        points: 'Точки',
        users: 'Пользователи',
        addPoint: 'Добавить новую точку',
        pointsList: 'Список точек',
        usersList: 'Список пользователей',
        add: 'Добавить',
        editPoint: 'Редактировать точку',
        save: 'Сохранить',
        cancel: 'Отменить',
        role: 'Роль',
        guest: 'Гость',
        moderator: 'Модератор',
        admin: 'Админ',
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
        routebuilder: '路线',
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
      schedule: {
        title: '课程表',
        noEvents: '当天没有活动',
      },
      routes: {
        title: '路线',
      },
      topBar: {
        search: '搜索',
        locateMe: '你在哪里？',
      },
      rightBar: {
        lectureBoard: '讲义板',
        teachers: '老师',
        planets: '行星',
        coordinates: '坐标',
        library: '图书馆',
      },
      sidebar: {
        pointDetails: '点详细信息',
        pointId: '点ID',
        coordinates: '坐标',
        createdBy: '创建者',
      },
      admin: {
        title: '管理员面板',
        points: '点',
        users: '用户',
        addPoint: '添加新点',
        pointsList: '点列表',
        usersList: '用户列表',
        add: '添加',
        editPoint: '编辑点',
        save: '保存',
        cancel: '取消',
        role: '角色',
        guest: '访客',
        moderator: '版主',
        admin: '管理员',
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