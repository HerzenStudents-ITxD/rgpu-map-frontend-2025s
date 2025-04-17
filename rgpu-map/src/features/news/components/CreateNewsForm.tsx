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
  Checkbox,
  FormControlLabel,
  SxProps,
  Theme,
} from '@mui/material';
import { createNews } from '../api/fakeApi';
import { NewsGroup } from '../types';

interface CreateNewsFormProps {
  groups: NewsGroup[];
  onClose: () => void;
  onNewsCreated: () => void; // Добавляем callback для уведомления
  sx?: SxProps<Theme>;
}

export const CreateNewsForm = ({ groups, onClose, onNewsCreated, sx }: CreateNewsFormProps) => {
  const [form, setForm] = useState({
    title: '',
    content: '',
    groupId: '',
    location: '',
    hasParticipateButton: false,
    image: null as File | null,
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm({ ...form, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = groups.find((g) => g.id === form.groupId);

    if (!group || !form.title) {
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
        hasParticipateButton: form.hasParticipateButton,
        image: form.image ? URL.createObjectURL(form.image) : undefined,
      });
      onNewsCreated(); // Вызываем callback после создания новости
      onClose();
    } catch (error) {
      alert('Ошибка при создании новости');
    }
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          ...(sx as any),
          borderRadius: 2,
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <Typography variant="h6">Новая запись</Typography>
        <Typography variant="body2" color="textSecondary">
          Студенческий совет ИНТО
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <FormControl fullWidth sx={{ mb: 2 }}>
            <InputLabel shrink>Группа *</InputLabel>
            <Select
              value={form.groupId}
              onChange={(e) => setForm({ ...form, groupId: e.target.value })}
              required
              label="Группа *"
              notched
            >
              {groups.map((g) => (
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
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            sx={{ mb: 2 }}
            required
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Текст записи"
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            fullWidth
            label="Местоположение"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            placeholder="Например: 20а корпус"
            sx={{ mb: 2 }}
            InputLabelProps={{ shrink: true }}
          />

          <Box sx={{ mb: 2 }}>
            <InputLabel shrink>Фото</InputLabel>
            <Button
              variant="outlined"
              component="label"
              sx={{ mt: 1, textTransform: 'none', borderColor: '#d32f2f', color: '#d32f2f' }}
            >
              Загрузить
              <input
                type="file"
                accept="image/*"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {form.image && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                Загружено: {form.image.name}
              </Typography>
            )}
          </Box>

          <FormControlLabel
            control={
              <Checkbox
                checked={form.hasParticipateButton}
                onChange={(e) =>
                  setForm({ ...form, hasParticipateButton: e.target.checked })
                }
              />
            }
            label="Добавить кнопку 'Участвую'"
            sx={{ mb: 2 }}
          />
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 2, pb: 1 }}>
        <Button
          onClick={onClose}
          variant="outlined"
          sx={{ textTransform: 'none', mr: 1 }}
        >
          Отменить
        </Button>
        <Button
          type="submit"
          variant="contained"
          onClick={handleSubmit}
          sx={{ textTransform: 'none' }}
        >
          Опубликовать
        </Button>
      </DialogActions>
    </Dialog>
  );
};