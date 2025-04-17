// src/features/news/components/NewsCard.tsx
import { NewsItem } from '../types';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Stack,
  Chip,
  Button,
  SxProps,
  Theme,
} from '@mui/material';
import { AvatarBox } from './AvatarBox';

interface NewsCardProps {
  item: NewsItem;
  sx?: SxProps<Theme>;
}

export const NewsCard = ({ item, sx }: NewsCardProps) => (
  <Card sx={{ mb: 3, boxShadow: 3, ...sx }}>
    <CardContent>
      <Stack direction="row" spacing={2} alignItems="center">
        <AvatarBox imageUrl={item.group.avatar} name={item.group.name} color="#3f51b5" />
        <div>
          <Typography variant="h6">{item.group.name}</Typography>
          <Typography variant="body2" color="text.secondary">
            {new Date(item.date).toLocaleDateString('ru-RU', {
              day: 'numeric',
              month: 'long',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        </div>
      </Stack>

      <Typography variant="h5" sx={{ mt: 2 }}>
        {item.title}
      </Typography>

      {item.image && (
        <CardMedia
          component="img"
          height="200"
          image={item.image}
          alt="News image"
          sx={{ mt: 2, borderRadius: 1 }}
        />
      )}

      {item.location && (
        <Chip label={item.location} sx={{ mt: 1, mr: 1 }} />
      )}

      <Typography variant="body1" sx={{ mt: 2 }}>
        {item.content}
      </Typography>

      {item.hasParticipateButton && (
        <Button
          variant="contained"
          color="primary"
          sx={{ mt: 2, textTransform: 'none' }}
        >
          Участвую
        </Button>
      )}
    </CardContent>
  </Card>
);