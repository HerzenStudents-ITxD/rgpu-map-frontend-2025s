import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
  Typography
} from '@mui/material';
import { sendFeedback } from '../api/fakeApi';
import { FeedbackFormData } from '../types';

interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
}

export const FeedbackForm = ({ open, onClose }: FeedbackFormProps) => {
  const [form, setForm] = useState<FeedbackFormData>({
    subject: '',
    message: '',
    contact: '',
    section: '', // Добавляем поле для раздела
    photo: null as File | null // Добавляем поле для фото
  });

  const [error, setError] = useState({
    subject: false,
    message: false,
    contact: false,
    section: false
  });

  const sections = [
    '3D-карта',
    'Новости',
    'Расписание',
    'Настройки',
    'Админ-панель'
  ]; // Список разделов для выпадающего меню

  const handleChange = (field: keyof FeedbackFormData) => (e: React.ChangeEvent<HTMLInputElement | { value: unknown }>) => {
    const value = 'value' in e.target ? e.target.value : e.target.files ? e.target.files[0] : '';
    setForm((prev) => ({ ...prev, [field]: value }));
    setError((prev) => ({ ...prev, [field]: !value }));
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, photo: e.target.files![0] }));
    }
  };

  const handleSubmit = async () => {
    const requiredFields = ['section', 'contact', 'message'];
    const newError = requiredFields.reduce((acc, field) => ({
      ...acc,
      [field]: !form[field as keyof FeedbackFormData]
    }), {});
    setError(newError);

    if (Object.values(newError).some((err) => err)) return;

    const formData = new FormData();
    formData.append('subject', form.subject || '');
    formData.append('message', form.message || '');
    formData.append('contact', form.contact || '');
    formData.append('section', form.section || '');
    if (form.photo) formData.append('photo', form.photo);

    await sendFeedback(formData);
    onClose();
  };

  const isFormValid = !error.section && !error.contact && !error.message && form.section && form.contact && form.message;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Обратная связь</DialogTitle>
      <DialogContent>
        <Typography variant="caption" color="error" sx={{ mb: 1 }}>
          * Укажите раздел, в котором возникла проблема, вопрос или ошибка
        </Typography>
        <FormControl fullWidth margin="normal" error={error.section} required>
          <InputLabel>Не выбрано</InputLabel>
          <Select
            value={form.section}
            onChange={handleChange('section')}
            label="Не выбрано"
          >
            {sections.map((section, index) => (
              <MenuItem key={section} value={section}>{section}</MenuItem>
            ))}
          </Select>
          {error.section && <FormHelperText error>Поле обязательно</FormHelperText>}
        </FormControl>

        <TextField
          fullWidth
          label="Почта *"
          value={form.contact}
          onChange={handleChange('contact')}
          margin="normal"
          required
          error={error.contact}
          helperText={error.contact && 'Поле обязательно'}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handlePhotoChange}
          style={{ margin: '16px 0' }}
        />

        <TextField
          fullWidth
          label="Подробно опишите свою проблему *"
          value={form.message}
          onChange={handleChange('message')}
          margin="normal"
          multiline
          rows={4}
          required
          error={error.message}
          helperText={error.message && 'Поле обязательно'}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" disabled={!isFormValid}>
          Продолжить
        </Button>
      </DialogActions>
    </Dialog>
  );
};