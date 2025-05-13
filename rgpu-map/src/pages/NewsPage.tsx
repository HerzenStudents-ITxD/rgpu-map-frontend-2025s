import { useState, useEffect, useCallback } from 'react';
import { 
  Button, 
  Container, 
  LinearProgress, 
  Alert,
  Stack,
  Typography 
} from '@mui/material';
import { NewsList } from '../features/news/components/NewsList';
import { CreateNewsForm } from '../features/news/components/CreateNewsForm';
import { CommunityServiceApi } from '../features/real_api/communityServiceApi';
import { NewsGroup } from '../features/news/types';
import { useTranslation } from 'react-i18next';
import { getAccessToken } from '../utils/tokenService';
import '../features/news/components/News.css';

export const NewsPage = () => {
  const { t } = useTranslation();
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState<NewsGroup[]>([]);
  const [hiddenCommunities, setHiddenCommunities] = useState<string[]>(() => {
    const saved = localStorage.getItem('hiddenCommunities');
    return saved ? JSON.parse(saved) : [];
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const api = new CommunityServiceApi();

  const toggleCommunityVisibility = useCallback((communityId: string) => {
    setHiddenCommunities(prev => {
      const newHidden = prev.includes(communityId)
        ? prev.filter(id => id !== communityId)
        : [...prev, communityId];
      localStorage.setItem('hiddenCommunities', JSON.stringify(newHidden));
      return newHidden;
    });
  }, []);

  const loadGroups = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.community.getCommunity();
      const communities = response.data.body?.map(item => ({
        id: item.community?.id || '',
        name: item.community?.name || 'N/A',
        avatar: item.community?.avatar || null
      })) || [];
      setGroups(communities);
    } catch (err: any) {
      console.error('Error fetching groups:', err);
      setError(t('news.error') || err.message || 'Ошибка загрузки групп новостей');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getAccessToken());
    checkAuth();
    loadGroups();
  }, [loadGroups]);

  const handleFormClose = useCallback(() => {
    setShowForm(false);
    loadGroups();
  }, [loadGroups]);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          {t('news.title')}
        </Typography>

        {loading && <LinearProgress />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {isAuthenticated && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => setShowForm(true)}
            sx={{ 
              alignSelf: 'flex-start',
              px: 4,
              textTransform: 'none',
              fontSize: '1rem'
            }}
          >
            {t('news.createPost')}
          </Button>
        )}

        {showForm && (
          <CreateNewsForm 
            groups={groups} 
            onClose={handleFormClose}
            sx={{ 
              boxShadow: 3,
              borderRadius: 2,
              p: 3,
              backgroundColor: 'background.paper'
            }}
          />
        )}

        <NewsList 
          groups={groups}
          hiddenCommunities={hiddenCommunities}
          onToggleCommunity={toggleCommunityVisibility}
          isAuthenticated={isAuthenticated}
        />
      </Stack>
    </Container>
  );
};