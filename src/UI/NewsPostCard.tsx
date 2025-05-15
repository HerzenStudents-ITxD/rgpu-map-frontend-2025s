import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface NewsPost {
  id: string;
  title: string;
  description: string;
  image?: string;
  hasParticipateButton?: boolean;
  routePoint?: string;
}

interface NewsPostCardProps {
  post: NewsPost;
  onParticipate?: (id: string) => void;
  onBuildRoute?: (routePoint: string) => void;
}

const NewsPostCard: React.FC<NewsPostCardProps> = ({ post, onParticipate, onBuildRoute }) => {
  const { t } = useTranslation();

  return (
    <Card sx={{ marginBottom: '20px', borderRadius: '8px' }}>
      {post.image && (
        <CardMedia
          component="img"
          height="140"
          image={post.image}
          alt={post.title}
          sx={{ objectFit: 'cover' }}
        />
      )}
      <CardContent>
        <Typography variant="h6" gutterBottom>
          {post.title}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {post.description}
        </Typography>
        <Box sx={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
          {post.hasParticipateButton && onParticipate && (
            <Button
              variant="outlined"
              onClick={() => onParticipate(post.id)}
              sx={{ textTransform: 'none' }}
            >
              {t('news.participate')}
            </Button>
          )}
          {post.routePoint && onBuildRoute && (
            <Button
              variant="contained"
              onClick={() => onBuildRoute(post.routePoint)}
              sx={{ textTransform: 'none' }}
            >
              {t('news.buildRoute')}
            </Button>
          )}
        </Box>
      </CardContent>
    </Card>
  );
};

export default NewsPostCard;