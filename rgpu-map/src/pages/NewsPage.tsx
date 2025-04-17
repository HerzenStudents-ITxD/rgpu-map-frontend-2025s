//src/pages/NewsPage
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
import { fetchGroups } from '../features/news/api/fakeApi';
import { NewsGroup } from '../features/news/types';
import '../features/news/components/News.css';

export const NewsPage = () => {
  const [showForm, setShowForm] = useState(false);
  const [groups, setGroups] = useState<NewsGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [newsUpdated, setNewsUpdated] = useState(0); // Счётчик для обновления новостей

  const loadGroups = async () => {
    try {
      const data = await fetchGroups();
      setGroups(data);
    } catch (err) {
      setError('Ошибка загрузки групп новостей');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGroups();
  }, []);

  const refreshNews = useCallback(() => {
    setNewsUpdated((prev) => prev + 1); // Увеличиваем счётчик для перезапроса новостей
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Stack spacing={3}>
        <Typography variant="h4" component="h1">
          Новости университета
        </Typography>

        {loading && <LinearProgress />}
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={() => setShowForm(true)}
          sx={{ 
            alignSelf: 'flex-start',
            px: 4,
            textTransform: 'none',
            fontSize: '1.1rem'
          }}
        >
          + Создать новость
        </Button>

        {showForm && (
          <CreateNewsForm 
            groups={groups} 
            onClose={() => setShowForm(false)}
            onNewsCreated={refreshNews} // Передаём callback
            sx={{ 
              boxShadow: 3,
              borderRadius: 2,
              p: 3,
              backgroundColor: 'background.paper'
            }}
          />
        )}

        <NewsList key={newsUpdated} /> {/* Перерисовываем NewsList при изменении newsUpdated */}
      </Stack>
    </Container>
  );
};