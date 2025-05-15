import React, { useState } from 'react';
import { Container, Typography, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import useNewsPosts from '../modules/news/useNewsPosts';
import NewsPostCard from '../UI/NewsPostCard';
import CreatePostForm from '../UI/CreatePostForm';

const News: React.FC = () => {
  const { t } = useTranslation();
  const { posts, addPost, participate, buildRoute } = useNewsPosts();
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);

  const handleCreatePost = (post: { title: string; description: string; image?: string; routePoint?: string }) => {
    addPost(post);
    setIsFormOpen(false);
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('news.title')}
      </Typography>
      <Button
        variant="contained"
        onClick={() => setIsFormOpen(true)}
        sx={{ marginBottom: '20px', textTransform: 'none' }}
      >
        {t('news.publish')}
      </Button>
      {isFormOpen && (
        <CreatePostForm
          onSubmit={handleCreatePost}
          onCancel={() => setIsFormOpen(false)}
        />
      )}
      {posts.map((post) => (
        <NewsPostCard
          key={post.id}
          post={post}
          onParticipate={participate}
          onBuildRoute={buildRoute}
        />
      ))}
    </Container>
  );
};

export default News;