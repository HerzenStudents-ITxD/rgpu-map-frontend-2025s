// src/features/news/types.ts
export interface NewsGroup {
  id: string;
  name: string;
  avatar?: string | null; // base64 строка
}
  
export interface NewsItem {
  id: string;
  title: string;
  content: string;
  date: string;
  group: NewsGroup;
  imageUrl?: string | null; // Первое изображение из photos (base64)
  participants: number;
  location?: string | null;
  pointId?: string | null; // Новое поле для ID связанной точки
  isFeatured: boolean;
}