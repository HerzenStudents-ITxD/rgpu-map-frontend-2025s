import { FC, useState, useCallback, ChangeEvent } from 'react';
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
  CircularProgress,
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
    image: null as string | null,
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

  // Валидация изображения
  const validateImage = (file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    
    if (file.size > maxSize) {
      return t('news.imageTooLarge') || 'Максимальный размер файла 5MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return t('news.invalidImageFormat') || 'Допустимые форматы: JPEG, PNG, GIF';
    }
    return null;
  };

  // Конвертация файла в base64
  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const error = validateImage(file);
    if (error) {
      setError(error);
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onloadend = () => {
        setForm({ ...form, image: reader.result as string });
        setLoading(false);
      };
      reader.readAsDataURL(file);
    } catch (err) {
      setError(t('news.uploadError') || 'Ошибка загрузки изображения');
      setLoading(false);
    }
  };

  // Отправка формы
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.groupId || !form.title || !form.text) {
      setError(t('news.fillRequiredFields') || 'Заполните обязательные поля');
      return;
    }

    try {
      const requestData: CreateNewsRequest = {
        communityId: form.groupId,
        title: form.title.trim(),
        text: form.text.trim(),
        pointId: form.pointId.trim() || null,
        isFeatured: form.isFeatured,
        images: form.image ? [form.image] : [],
      };

      await api.community.createNewsCreate(requestData);
      onClose();
    } catch (err: any) {
      setError(err.message || t('news.error') || 'Ошибка создания новости');
    }
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

          {/* Поле текста */}
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

          {/* Загрузка изображения */}
          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
              fullWidth
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} />
              ) : (
                t('news.uploadImage') || 'Загрузить изображение'
              )}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleImageUpload}
              />
            </Button>
            {form.image && (
              <Box sx={{ mt: 2, textAlign: 'center' }}>
                <img
                  src={form.image}
                  alt="Preview"
                  style={{ 
                    maxWidth: '100%', 
                    maxHeight: '200px',
                    borderRadius: '8px'
                  }}
                />
              </Box>
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
        <Button 
          variant="contained" 
          onClick={handleSubmit}
          disabled={loading}
        >
          {t('news.publish')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};