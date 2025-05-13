import { useEffect, useState, useCallback, useRef } from 'react';
import { NewsCard } from './NewsCard';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsItem, NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';
import { Alert, Box, CircularProgress, Typography } from '@mui/material';
import { getAccessToken } from '../../../utils/tokenService';

interface NewsListProps {
  groups: NewsGroup[];
  hiddenCommunities?: string[];
  onToggleCommunity?: (communityId: string) => void;
  isAuthenticated?: boolean;
}

export const NewsList = ({ 
  groups = [], 
  hiddenCommunities = [], 
  onToggleCommunity,
  isAuthenticated 
}: NewsListProps) => {
  const { t } = useTranslation();
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiRef = useRef(new CommunityServiceApi());
  const isMounted = useRef(true);

  const fetchNews = useCallback(async (abortController?: AbortController) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!getAccessToken()) {
        throw new Error(t('auth.required') || 'Authentication required');
      }

      const query = { page: 1, pageSize: 10 };
      const response = await apiRef.current.community.newsList(query, {
        signal: abortController?.signal
      });

      if (!isMounted.current) return;

      if (!response.data.body?.length) {
        setNews([]);
        return;
      }

      const newsItems = response.data.body.map(item => ({
        id: item.newsId || `temp-${Date.now()}`,
        title: item.title || t('news.untitled') || 'Untitled',
        text: item.text || t('news.noContent') || 'No text',
        date: item.createdAt || new Date().toISOString(),
        group: {
          id: item.communityId || 'unknown',
          name: groups.find(g => g.id === item.communityId)?.name || 'Unknown',
          avatar: item.photos?.[0] || null,
        },
        imageUrl: item.photos?.[0] || null,
        participants: item.participants?.length || 0,
        location: item.location || null,
        isFeatured: item.isFeatured || false,
      }));

      setNews(prev => 
        JSON.stringify(prev) === JSON.stringify(newsItems) ? prev : newsItems
      );
    } catch (err: any) {
      if (err.name === 'AbortError') return;
      console.error('Error:', err);
      setError(err.message || t('news.loadError') || 'Failed to load news');
    } finally {
      if (isMounted.current) setLoading(false);
    }
  }, [t, groups]);

  useEffect(() => {
    isMounted.current = true;
    const abortController = new AbortController();
    
    const loadData = () => {
      if (!isMounted.current) return;
      fetchNews(abortController);
    };

    // Дебаунс запросов
    const debounceTimer = setTimeout(loadData, 500);
    
    return () => {
      isMounted.current = false;
      abortController.abort();
      clearTimeout(debounceTimer);
    };
  }, [fetchNews]);

  const filteredNews = news.filter(item => 
    !hiddenCommunities.includes(item.group.id)
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>;
  }

  if (filteredNews.length === 0) {
    return <Typography sx={{ mt: 2 }}>{t('news.noNews') || 'No news available'}</Typography>;
  }

  return (
    <div className="news-list">
      {filteredNews.map(item => (
        <NewsCard 
          key={`${item.id}-${item.group.id}`} 
          item={item}
          onToggleCommunity={onToggleCommunity}
          isAuthenticated={isAuthenticated}
          sx={{ mb: 3 }}
        />
      ))}
    </div>
  );
};