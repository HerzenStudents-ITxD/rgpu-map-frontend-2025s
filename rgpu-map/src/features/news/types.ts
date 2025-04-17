// src/features/news/types.ts
export interface NewsGroup {
    id: string;
    name: string;
    avatar?: string; // Делаем необязательным
    color?: string; // Добавляем цвет для инициалов
  }
  
  export interface NewsItem {
    id: string;
    title: string;
    content: string;
    date: string;
    group: NewsGroup;
    imageUrl?: string;
    participants?: number;
    location?: string;
    isFeatured?: boolean;
    hasParticipateButton?: boolean; // Добавляем поле для кнопки "Участвую"
    image?: string; // Добавляем поле для изображения
  }