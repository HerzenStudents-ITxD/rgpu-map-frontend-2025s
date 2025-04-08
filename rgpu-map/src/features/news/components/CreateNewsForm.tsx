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
  Theme
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
    location: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const group = groups.find(g => g.id === form.groupId);
    
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
        location: form.location || undefined
      });
      onClose();
    } catch (error) {
      alert('Ошибка при создании новости');
    }
  };

  return (
    <Dialog 
      open 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      sx={{
        '& .MuiDialog-paper': {
          ...(sx as any), // Каст для совместимости стилей
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
            label="Текст новости"
            value={form.content}
            onChange={(e) => setForm({...form, content: e.target.value})}
            sx={{ mb: 3 }}
          />

          <TextField
            fullWidth
            label="Местоположение"
            value={form.location}
            onChange={(e) => setForm({...form, location: e.target.value})}
            placeholder="Например: 20а корпус"
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