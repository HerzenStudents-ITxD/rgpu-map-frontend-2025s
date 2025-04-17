// src/features/news/api/fakeApi.ts
import { NewsItem, NewsGroup } from '../types';

const mockGroups: NewsGroup[] = [
  {
    id: '1',
    name: 'Профком',
    avatar: '/images/groups/profkom.jpg'
  },
  {
    id: '2',
    name: 'Студенческий совет ИИТТО',
    avatar: '/images/groups/iitto.jpg'
  }
];

const mockNews: NewsItem[] = [
  {
    id: '1',
    title: 'ТАЙНЫЙ ГЕРЦЕН-МОРОЗ 2024',
    content: 'Новогодний обмен подарками...',
    date: new Date().toISOString(),
    group: mockGroups[0],
    participants: 24,
    location: '20а корпус',
    isFeatured: true
  }
];

export const fetchNews = (): Promise<NewsItem[]> => {
  return new Promise(resolve => setTimeout(() => resolve(mockNews), 500));
};

export const fetchGroups = (): Promise<NewsGroup[]> => {
  return Promise.resolve(mockGroups);
};

export const createNews = (item: Omit<NewsItem, 'id'>): Promise<NewsItem> => {
  const newItem = { ...item, id: Math.random().toString(36).substr(2, 9) };
  mockNews.unshift(newItem);
  return Promise.resolve(newItem);
};