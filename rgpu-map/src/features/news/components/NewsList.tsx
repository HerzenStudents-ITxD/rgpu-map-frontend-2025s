import { useEffect, useState } from 'react';
import { NewsCard } from './NewsCard';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsItem, NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';
import { Button, Box } from '@mui/material';
import { CreateNewsForm } from './CreateNewsForm';
import { getAccessToken } from '../../../utils/tokenService';

export const NewsList = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [groups, setGroups] = useState<NewsGroup[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const api = new CommunityServiceApi();

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getAccessToken());
    checkAuth();
    
    const fetchNews = async () => {
      try {
        const response = await api.community.newsList({ page: 1, pageSize: 10 });
        
        // Преобразование данных API
        const newsItems = response.data.body?.map(item => ({
          id: item.id || Date.now().toString(),
          title: item.title || '',
          content: item.text || '',
          date: item.createdAt || new Date().toISOString(),
          group: {
            id: item.communityId || '',
            name: item.communityId || '',
            avatar: item.photos?.[0]
          },
          imageUrl: item.photos?.[0],
          participants: item.participants?.length || 0,
          location: item.location || '',
          isFeatured: item.isFeatured || false
        })) || [];
        
        // Удаление дубликатов
        const uniqueNews = newsItems.filter(
          (item, index, self) => index === self.findIndex(i => i.id === item.id)
        );
        
        setNews(uniqueNews);
        
        // Загрузка групп только для авторизованных
        if (isAuthenticated) {
          const groupsResponse = await api.community.getCommunity();
          setGroups(groupsResponse.data.body?.map(g => ({
            id: g.community?.id || '',
            name: g.community?.name || ''
          })) || []);
        }
      } catch (err) {
        setError(t('news.error') || 'Ошибка загрузки новостей');
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, [isAuthenticated, t]);

  if (loading) return <div>{t('news.loading')}</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="news-list">
      {/* Гарантированно одна кнопка */}
      {isAuthenticated && (
        <Box sx={{ 
          position: 'sticky', 
          top: 0, 
          zIndex: 1,
          bgcolor: 'background.paper',
          py: 2,
          display: !showCreateForm ? 'block' : 'none'
        }}>
          <Button
            variant="contained"
            onClick={() => setShowCreateForm(true)}
            sx={{ 
              display: 'block',
              mx: 'auto',
              maxWidth: 200
            }}
          >
            {t('news.createPost')}
          </Button>
        </Box>
      )}

      {showCreateForm && (
        <CreateNewsForm 
          groups={groups}
          onClose={() => setShowCreateForm(false)}
        />
      )}

      {news.map(item => (
        <NewsCard 
          key={`${item.id}-${item.group.id}`}
          item={item} 
          sx={{ mb: 3 }}
        />
      ))}
    </div>
  );
};