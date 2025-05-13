import { useState, useCallback } from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  SxProps, 
  Theme,
  Button,
  IconButton,
  Box,
} from '@mui/material';
import { AvatarBox } from './AvatarBox';
import { useTheme } from '@mui/material/styles';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { useTranslation } from 'react-i18next';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { NewsItem } from '../types';

interface NewsCardProps {
  item: NewsItem;
  sx?: SxProps<Theme>;
  onToggleCommunity: (communityId: string) => void;
  isAuthenticated: boolean;
}

export const NewsCard = ({ 
  item, 
  sx, 
  onToggleCommunity,
  isAuthenticated 
}: NewsCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [error, setError] = useState<string | null>(null);

  // Обработчик для участия в новости
  const handleParticipate = useCallback(async () => {
    try {
      const api = new CommunityServiceApi();
      await api.news.participateCreate({ newsId: item.id });
      setError(null);
    } catch (err: any) {
      setError(err.message || t('news.error') || 'Ошибка участия');
    }
  }, [item.id, t]);

  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: 3,
      overflow: 'visible',
      ...sx 
    }}>
      <CardContent>
        {/* Заголовок и аватар */}
        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <AvatarBox 
            imageUrl={item.group.avatar}
            name={item.group.name}
            size={48}
          />
          <Box>
            <Typography variant="h6">{item.group.name}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(item.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </Box>
        </Stack>

        {/* Изображение новости */}
        {item.imageUrl && (
          <Box sx={{ 
            mb: 2,
            borderRadius: 2,
            overflow: 'hidden',
            position: 'relative',
            height: 300
          }}>
            <img
              src={item.imageUrl}
              alt={item.title}
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Box>
        )}

        {/* Контент новости */}
        <Typography variant="h5" sx={{ mb: 1.5 }}>
          {item.title}
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 2 }}>
          {item.text}
        </Typography>

        {/* Мета-данные */}
        <Stack direction="row" spacing={1} sx={{ flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {item.location && (
            <Chip label={item.location} variant="outlined" />
          )}
          {item.pointId && (
            <Chip label={`ID точки: ${item.pointId}`} variant="outlined" />
          )}
        </Stack>

        {/* Кнопка участия */}
        {item.isFeatured && (
          <Button
            fullWidth
            variant="contained"
            color="primary"
            sx={{ borderRadius: 2 }}
            onClick={handleParticipate}
          >
            {t('news.participate')}
          </Button>
        )}

        {/* Отображение ошибок */}
        {error && (
          <Typography color="error" sx={{ mt: 1.5 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};