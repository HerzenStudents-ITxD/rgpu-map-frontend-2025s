// src/features/news/components/CreateNewsForm.tsx
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
import { createNews } from '../api/fakeApi';
import { NewsGroup } from '../types';

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
  const [form, setForm] = useState({
    title: '',
    content: '',
    groupId: '',
    location: '',
    image: null as File | null,
    isFeatured: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = groups.find(g => g.id === form.groupId);
    
    if (!group || !form.title || !form.content) {
      alert('Заполните обязательные поля');
      return;
    }

    try {
      await createNews({
        title: form.title,
        content: form.content,
        group,
        date: new Date().toISOString(),
        location: form.location || undefined,
        imageUrl: form.image ? URL.createObjectURL(form.image) : undefined,
        isFeatured: form.isFeatured,
      });
      onClose();
    } catch (error) {
      alert('Ошибка при создании новости');
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
        <Typography variant="h5">Новая новость</Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Группа *</InputLabel>
            <Select
              value={form.groupId}
              onChange={(e) => setForm({...form, groupId: e.target.value})}
              required
              label="Группа *"
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
            label="Заголовок *"
            value={form.title}
            onChange={(e) => setForm({...form, title: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Текст новости *"
            value={form.content}
            onChange={(e) => setForm({...form, content: e.target.value})}
            sx={{ mb: 3 }}
            required
          />

          <TextField
            fullWidth
            label="Местоположение"
            value={form.location}
            onChange={(e) => setForm({...form, location: e.target.value})}
            placeholder="Например: 20а корпус"
            sx={{ mb: 3 }}
          />

          <Box sx={{ mb: 3 }}>
            <Button
              variant="outlined"
              component="label"
            >
              Загрузить фото
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Выбрано: {form.image.name}
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
            label="Добавить кнопку участвую"
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button 
          onClick={onClose} 
          variant="outlined"
          sx={{ mr: 2 }}
        >
          Отменить
        </Button>
        <Button 
          type="submit" 
          variant="contained"
          onClick={handleSubmit}
        >
          Опубликовать
        </Button>
      </DialogActions>
    </Dialog>
  );
};