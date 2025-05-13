import { FC, useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Typography,
  SxProps,
  Theme,
  Checkbox,
  FormControlLabel,
} from '@mui/material';
import { CommunityServiceApi, CreateNewsRequest } from '../../real_api/communityServiceApi';
import { NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';

interface CreateNewsFormProps {
  groups: NewsGroup[];
  onClose: () => void;
  sx?: SxProps<Theme>;
}

export const CreateNewsForm: FC<CreateNewsFormProps> = ({ 
  groups,
  onClose,
  sx 
}) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    text: '',
    groupId: '',
    pointId: '',
    image: null as File | null,
    isFeatured: false,
  });
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

  const validateImage = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      return t('news.imageTooLarge') || 'Image size exceeds 5MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return t('news.invalidImageFormat') || 'Only JPEG and PNG images are allowed';
    }
    return null;
  };

  const readFileAsBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Валидация обязательных полей
    if (!form.groupId || !form.title || !form.text) {
      setError(t('news.fillRequiredFields') || 'Fill all required fields');
      return;
    }

    try {
      const requestData: CreateNewsRequest = {
        communityId: form.groupId,
        title: form.title.trim(),
        text: form.text.trim(),
        pointId: form.pointId.trim() || null,
        isFeatured: form.isFeatured,
        images: [],
      };

      // Обработка изображения
      if (form.image) {
        const validationError = validateImage(form.image);
        if (validationError) {
          setError(validationError);
          return;
        }
        const base64Image = await readFileAsBase64(form.image);
        requestData.images?.push(base64Image.split(',')[1]); // Отправляем только данные без префикса
      }

      console.log('Sending request:', JSON.stringify(requestData, null, 2));
      await api.community.createNewsCreate(requestData);
      onClose();
    } catch (err: any) {
      console.error('Error creating news:', err);
      setError(err.message || t('news.error') || 'Error creating news');
    }
  }, [form, t, readFileAsBase64, onClose]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  return (
    <Dialog open onClose={onClose} maxWidth="md" fullWidth sx={sx}>
      <DialogTitle>{t('news.createPost')}</DialogTitle>
      
      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          
          {/* Выбор сообщества */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('news.community')} *</InputLabel>
            <Select
              value={form.groupId}
              onChange={(e) => setForm({...form, groupId: e.target.value})}
              required
              label={`${t('news.community')} *`}
            >
              {groups.map(g => (
                <MenuItem key={g.id} value={g.id}>{g.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Поле заголовка */}
          <TextField
            fullWidth
            label={`${t('news.title')} *`}
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          {/* Поле контента */}
          <TextField
            fullWidth
            multiline
            rows={4}
            label={`${t('news.text')} *`}
            value={form.text}
            onChange={(e) => setForm({...form, text: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          {/* Поле Point ID */}
          <TextField
            fullWidth
            label="Point ID"
            value={form.pointId}
            onChange={(e) => setForm({...form, pointId: e.target.value})}
            sx={{ mb: 3 }}
          />

          {/* Загрузка изображения */}
          <Box sx={{ mb: 3 }}>
            <Button variant="outlined" component="label">
              {t('news.addImage')}
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {form.image.name}
              </Typography>
            )}
          </Box>

          {/* Чекбокс "Избранное" */}
          <FormControlLabel
            control={
              <Checkbox
                checked={form.isFeatured}
                onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
              />
            }
            label={t('news.featured')}
          />

          {/* Отображение ошибок */}
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>{t('news.cancel')}</Button>
        <Button variant="contained" onClick={handleSubmit}>
          {t('news.publish')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};