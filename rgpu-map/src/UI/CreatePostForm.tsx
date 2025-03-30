import React, { useState } from 'react';
import { Box, TextField, Button, Typography, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';

interface CreatePostFormProps {
  onSubmit: (post: { title: string; description: string; image?: string; routePoint?: string }) => void;
  onCancel: () => void;
}

const CreatePostForm: React.FC<CreatePostFormProps> = ({ onSubmit, onCancel }) => {
  const { t } = useTranslation();
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [image, setImage] = useState<string | undefined>(undefined);
  const [routePoint, setRoutePoint] = useState<string>('');

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setImage(imageUrl);
    }
  };

  const handleSubmit = () => {
    onSubmit({ title, description, image, routePoint });
    setTitle('');
    setDescription('');
    setImage(undefined);
    setRoutePoint('');
  };

  return (
    <Box sx={{ padding: '20px', backgroundColor: '#f5f5f5', borderRadius: '8px', marginBottom: '20px' }}>
      <Typography variant="h6" gutterBottom>
        {t('news.createPost')}
      </Typography>
      <TextField
        label={t('news.title')}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        fullWidth
        sx={{ marginBottom: '10px' }}
      />
      <TextField
        label={t('news.description')}
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        fullWidth
        multiline
        rows={3}
        sx={{ marginBottom: '10px' }}
      />
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Button component="label" startIcon={<AddPhotoAlternateIcon />}>
          {t('news.addImage')}
          <input type="file" hidden accept="image/*" onChange={handleImageUpload} />
        </Button>
        {image && <Typography variant="body2" sx={{ marginLeft: '10px' }}>{t('news.imageAdded')}</Typography>}
      </Box>
      <TextField
        label={t('news.routePoint')}
        value={routePoint}
        onChange={(e) => setRoutePoint(e.target.value)}
        fullWidth
        sx={{ marginBottom: '10px' }}
      />
      <Box sx={{ display: 'flex', gap: '10px' }}>
        <Button variant="outlined" onClick={onCancel} sx={{ textTransform: 'none' }}>
          {t('news.cancel')}
        </Button>
        <Button variant="contained" onClick={handleSubmit} sx={{ textTransform: 'none' }}>
          {t('news.publish')}
        </Button>
      </Box>
    </Box>
  );
};

export default CreatePostForm;