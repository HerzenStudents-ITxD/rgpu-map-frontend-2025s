// src/features/news/components/NewsCard.tsx
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
import RouteIconLight from '../../../../public/svg/News-route-l.svg';
import RouteIconDark from '../../../../public/svg/News-route-d.svg';

interface NewsCardProps {
  item: NewsItem;
  sx?: SxProps<Theme>;
}

export const NewsCard = ({ item, sx }: NewsCardProps) => {
  const theme = useTheme();
  const routeIcon = theme.palette.mode === 'light' ? RouteIconLight : RouteIconDark;

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
            name={item.group.name}
            color="#3f51b5"
          />
          <div>
            <Typography variant="h6">{item.group.name}</Typography>
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
                  style={{ width: 24, height: 24, fill: theme.palette.icon.main }}
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
          >
            Участвую!
          </Button>
        )}
      </CardContent>
    </Card>
  );
};