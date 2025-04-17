// src/features/news/components/NewsList.tsx
import { useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { fetchNews } from '../api/fakeApi';
import { NewsItem } from '../types';

export const NewsList = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNews()
      .then((data) => {
        setNews(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []); // useEffect вызывается при каждом монтировании

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="news-list">
      {news.map((item) => (
        <NewsCard 
          key={item.id} 
          item={item} 
          sx={{ mb: 3 }}
        />
      ))}
    </div>
  );
};