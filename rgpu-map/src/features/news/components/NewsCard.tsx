import { useState, useCallback } from 'react';
import { NewsItem } from '../types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  SxProps, 
  Theme,
  Button,
} from '@mui/material';
import { AvatarBox } from './AvatarBox';
import { useTheme } from '@mui/material/styles';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { useTranslation } from 'react-i18next';
import RouteIconLight from '../../../../public/svg/News-route-l.svg';
import RouteIconDark from '../../../../public/svg/News-route-d.svg';

interface NewsCardProps {
  item: NewsItem;
  sx?: SxProps<Theme>;
}

export const NewsCard = ({ item, sx }: NewsCardProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const routeIcon = theme.palette.mode === 'light' ? RouteIconLight : RouteIconDark;
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

  const handleParticipate = useCallback(async () => {
    try {
      await api.community.participateCreate({ newsId: item.id });
      setError(null);
    } catch (err: any) {
      setError(t('news.error') || err.message || 'Ошибка при участии');
    }
  }, [item.id, t]);

  return (
    <Card sx={{ 
      mb: 3, 
      boxShadow: 3, 
      ...sx 
    }}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <AvatarBox 
            imageUrl={item.group.avatar}
            name={item.group.name || 'N/A'}
            color="#3f51b5"
          />
          <div>
            <Typography variant="h6">{item.group.name || 'N/A'}</Typography>
            <Typography variant="body2" color="text.secondary">
              {new Date(item.date).toLocaleDateString('ru-RU', {
                day: 'numeric',
                month: 'long',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </Typography>
          </div>
        </Stack>

        <Typography variant="h6" sx={{ mt: 2 }}>
          {item.title}
        </Typography>
        
        <Stack direction="row" spacing={1} sx={{ mt: 1, alignItems: 'center' }}>
          {item.location && (
            <>
              <Chip label={item.location} />
              <Button
                sx={{ minWidth: 'auto', p: 1 }}
                aria-label="Location icon"
              >
                <img
                  src={routeIcon}
                  alt="Location"
                  style={{ width: 24, height: 24, fill: theme.palette.ico?.nmain }}
                />
              </Button>
            </>
          )}
        </Stack>

        <Typography variant="body1" sx={{ mt: 2 }}>
          {item.content}
        </Typography>

        {item.isFeatured && (
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, textTransform: 'none' }}
            onClick={handleParticipate}
          >
            {t('news.participate')}
          </Button>
        )}

        {error && (
          <Typography color="error" variant="body2" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};