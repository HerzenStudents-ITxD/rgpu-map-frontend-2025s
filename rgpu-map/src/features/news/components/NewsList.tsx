import { useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsItem } from '../types';
import { useTranslation } from 'react-i18next';

export const NewsList = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

  useEffect(() => {
    const fetchNewsItems = async () => {
      try {
        const response = await api.community.newsList({ page: 1, pageSize: 10 });
        const newsItems = response.data.body?.map(item => ({
          id: item.id || '',
          title: item.title || '',
          content: item.text || '',
          date: item.createdAt || new Date().toISOString(),
          group: {
            id: item.communityId || '',
            name: item.communityId || '',
            avatar: item.photos?.[0],
          },
          imageUrl: item.photos?.[0],
          participants: item.participants?.length,
          location: item.location,
          isFeatured: item.isFeatured,
        })) || [];
        setNews(newsItems);
      } catch (err) {
        setError(t('news.error') || 'Ошибка загрузки новостей');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsItems();
  }, [t]);

  if (loading) return <div className="loading">{t('news.loading') || 'Загрузка...'}</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="news-list">
      {news.map(item => (
        <NewsCard 
          key={item.id} 
          item={item} 
          sx={{ mb: 3 }}
        />
      ))}
    </div>
  );
};