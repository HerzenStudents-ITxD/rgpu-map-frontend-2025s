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
    images: [] as string[],
    isFeatured: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

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

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setLoading(true);
    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const error = validateImage(file);
        if (error) {
          setError(error);
          continue;
        }

        const reader = new FileReader();
        const promise = new Promise<string>((resolve) => {
          reader.onloadend = () => {
            const result = reader.result as string;
            // Extract base64 part
            const base64Data = result.split(',')[1] || result;
            resolve(base64Data);
          };
          reader.readAsDataURL(file);
        });

        newImages.push(await promise);
      }

      setForm({ ...form, images: [...form.images, ...newImages] });
      setError(null);
    } catch (err) {
      setError(t('news.uploadError') || 'Ошибка загрузки изображения');
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newImages = [...form.images];
    newImages.splice(index, 1);
    setForm({ ...form, images: newImages });
  };

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
        images: form.images.length > 0 ? form.images : null,
        pointId: form.pointId.trim() || null,
      };

      await api.news.createNewsCreate(requestData);
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

          <TextField
            fullWidth
            label={`${t('news.title')} *`}
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

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
                multiple
                onChange={handleImageUpload}
              />
            </Button>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mt: 2 }}>
              {form.images.map((image, index) => (
                <Box key={index} sx={{ position: 'relative' }}>
                  <img
                    src={`data:image/jpeg;base64,${image}`}
                    alt={`Preview ${index}`}
                    style={{ 
                      width: '100px',
                      height: '100px',
                      objectFit: 'cover',
                      borderRadius: '8px'
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    sx={{ 
                      position: 'absolute',
                      top: 0,
                      right: 0,
                      minWidth: 'auto',
                      p: 0.5
                    }}
                    onClick={() => handleRemoveImage(index)}
                  >
                    ×
                  </Button>
                </Box>
              ))}
            </Box>
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.isFeatured}
                onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
              />
            }
            label={t('news.featured')}
          />

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