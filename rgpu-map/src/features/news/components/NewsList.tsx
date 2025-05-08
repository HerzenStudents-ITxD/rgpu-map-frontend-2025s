import { useEffect, useState, useCallback } from 'react';
import { NewsCard } from './NewsCard';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsItem, NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
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
      if (!getAccessToken()) {
        throw new Error('No access token available');
      }
      const response = await api.community.newsList({ 
        page: 1, 
        pageSize: 10,
        isActive: true // Add filter for active news
      });
      
      console.log('News API response:', response.data); // Debug log

      if (!response.data.body || response.data.body.length === 0) {
        setNews([]);
        return;
      }

      const newsItems = response.data.body.map(item => {
        if (!item.newsId) {
          console.warn('Missing newsId in item:', item);
        }
        return {
          id: item.newsId || `temp-${Date.now()}-${Math.random()}`, // Fallback ID
          title: item.title || 'Untitled',
          content: item.content || 'No content',
          date: item.createdAt || new Date().toISOString(),
          group: {
            id: item.communityId || 'unknown',
            name: item.communityName || item.communityId || 'Unknown',
            avatar: item.photos?.[0] || null
          },
          imageUrl: item.photos?.[0] || null,
          participants: item.participants?.length || 0,
          location: item.location || null,
          isFeatured: item.isFeatured || false
        };
      });

      const uniqueNews = newsItems.filter(
        (item, index, self) => index === self.findIndex(i => i.id === item.id)
      );

      setNews(uniqueNews);
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(t('news.error') || err.message || 'Failed to load news');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchGroups = useCallback(async () => {
    if (isAuthenticated) {
      try {
        const groupsResponse = await api.community.getCommunity();
        console.log('Groups API response:', groupsResponse.data); // Debug log
        setGroups(groupsResponse.data.body?.map(g => ({
          id: g.community?.id || 'unknown',
          name: g.community?.name || 'Unknown',
          avatar: g.community?.avatar || null
        })) || []);
      } catch (err: any) {
        console.error('Error fetching groups:', err);
        setError(t('news.error') || err.message || 'Failed to load groups');
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
  if (news.length === 0) return <Typography sx={{ mt: 2 }}>{t('news.noNews') || 'No news available'}</Typography>;

  return (
    <div className="news-list">
      {news.map(item => (
        <NewsCard 
          key={`${item.id}-${item.group.id}-${item.date}`} // Ensure unique key
          item={item} 
          sx={{ mb: 3 }}
        />
      ))}
    </div>
  );
};