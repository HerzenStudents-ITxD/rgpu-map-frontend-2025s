import { useState } from 'react';
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
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsGroup } from '../types';
import { useTranslation } from 'react-i18next';

interface CreateNewsFormProps {
  groups: NewsGroup[];
  onClose: () => void;
  sx?: SxProps<Theme>;
}

export const CreateNewsForm = ({ 
  groups,
  onClose,
  sx 
}: CreateNewsFormProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState({
    title: '',
    content: '',
    groupId: '',
    location: '',
    image: null as File | null,
    isFeatured: false,
  });
  const [error, setError] = useState<string | null>(null);
  const api = new CommunityServiceApi();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!form.groupId || !form.title || !form.content) {
      setError(t('news.error') || 'Заполните обязательные поля');
      return;
    }

    try {
      const images = form.image ? [URL.createObjectURL(form.image)] : undefined;
      await api.community.createNewsCreate({
        communityId: form.groupId,
        title: form.title,
        content: form.content,
        images,
        location: form.location || undefined,
        isFeatured: form.isFeatured,
      });
      onClose();
    } catch (error: any) {
      setError(t('news.error') || 'Ошибка при создании новости');
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setForm({ ...form, image: file });
  };

  return (
    <Dialog 
      open 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          ...(sx as any),
          borderRadius: 3,
          p: 3
        }
      }}
    >
      <DialogTitle>
        <Typography variant="h5">{t('news.createPost')}</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>{t('news.routePoint')} *</InputLabel>
            <Select
              value={form.groupId}
              onChange={(e) => setForm({...form, groupId: e.target.value})}
              required
              label={t('news.routePoint') + ' *'}
            >
              {groups.map(g => (
                <MenuItem key={g.id} value={g.id}>
                  {g.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t('news.titlePlaceholder') + ' *'}
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t('news.description') + ' *'}
            value={form.content}
            onChange={(e) => setForm({...form, content: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label={t('news.routePoint')}
            value={form.location}
            onChange={(e) => setForm({...form, location: e.target.value})}
            placeholder={t('news.routePoint')}
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
            >
              {t('news.addImage')}
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('feedback.selectedFile')}: {form.image.name}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.isFeatured}
                onChange={(e) => setForm({...form, isFeatured: e.target.checked})}
              />
            }
            label={t('news.participate')}
          />

          {error && (
            <Typography color="error" variant="body2" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ mr: 2 }}
        >
          {t('news.cancel')}
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          onClick={handleSubmit}
        >
          {t('news.publish')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};