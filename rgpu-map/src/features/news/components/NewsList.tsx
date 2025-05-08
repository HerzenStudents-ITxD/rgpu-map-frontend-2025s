import { useEffect, useState, useCallback } from 'react';
import { NewsCard } from './NewsCard';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsItem, NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';
import { Alert, Box, CircularProgress } from '@mui/material';
import { getAccessToken } from '../../../utils/tokenService';

export const NewsList = () => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [groups, setGroups] = useState<NewsGroup[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const api = new CommunityServiceApi();

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.community.newsList({ page: 1, pageSize: 10 });

      const newsItems = response.data.body?.map(item => ({
        id: item.newsId || Date.now().toString(),
        title: item.title || 'N/A',
        content: item.content || 'N/A',
        date: item.createdAt || new Date().toISOString(),
        group: {
          id: item.communityId || '',
          name: item.communityId || 'N/A',
          avatar: item.photos?.[0] || null
        },
        imageUrl: item.photos?.[0] || null,
        participants: item.participants?.length || 0,
        location: item.location || null,
        isFeatured: item.isFeatured || false
      })) || [];

      const uniqueNews = newsItems.filter(
        (item, index, self) => index === self.findIndex(i => i.id === item.id)
      );

      setNews(uniqueNews);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(t('news.error') || err.message || 'Ошибка загрузки новостей');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchGroups = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const groupsResponse = await api.community.getCommunity();
        setGroups(groupsResponse.data.body?.map(g => ({
          id: g.community?.id || '',
          name: g.community?.name || 'N/A',
          avatar: g.community?.avatar || null
        })) || []);
      } catch (err: any) {
        console.error('Error fetching groups:', err);
        setError(t('news.error') || err.message || 'Ошибка загрузки групп');
      }
    }
  }, [isAuthenticated, t]);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getAccessToken());
    checkAuth();
    fetchNews();
    fetchGroups();
  }, [fetchNews, fetchGroups]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;

  return (
    <div className="news-list">
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