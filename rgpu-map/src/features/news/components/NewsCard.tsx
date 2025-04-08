// src/features/news/components/NewsCard.tsx
import { NewsItem } from '../types';
import { 
  Card, 
  CardContent, 
  Typography, 
  Stack, 
  Chip, 
  SxProps, 
  Theme 
} from '@mui/material';
import { AvatarBox } from './AvatarBox';

interface NewsCardProps {
  item: NewsItem;
  sx?: SxProps<Theme>; // Явно объявляем пропс
}

export const NewsCard = ({ item, sx }: NewsCardProps) => (
  <Card sx={{ 
    mb: 3, 
    boxShadow: 3, 
    ...sx // Применяем переданные стили
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

      <Typography variant="h5" sx={{ mt: 2 }}>
        {item.title}
      </Typography>
      
      {item.location && (
        <Chip 
          label={item.location} 
          sx={{ mt: 1, mr: 1 }}
        />
      )}
      
      <Typography variant="body1" sx={{ mt: 2 }}>
        {item.content}
      </Typography>
    </CardContent>
  </Card>
);