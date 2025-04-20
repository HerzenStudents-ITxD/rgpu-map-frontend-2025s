import { useState } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { sendFeedback } from '../api/fakeApi';
import { FeedbackFormData } from '../types';

interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
}

export const FeedbackForm = ({ open, onClose }: FeedbackFormProps) => {
  const { t } = useTranslation();
  const [form, setForm] = useState<FeedbackFormData>({
    subject: '',
    message: '',
    contact: '',
  });
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);

  const sections = ['Главная', 'Новости', 'Маршруты', 'Расписание', 'Настройки'];

  const handleSectionChange = (event: any) => {
    setSelectedSections(event.target.value as string[]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setImage(event.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    await sendFeedback(form);
    onClose();
  };

  const isFormValid = () => {
    return selectedSections.length > 0 && form.contact && form.message;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>{t('settings.feedback')}</DialogTitle>
      <DialogContent>
        {/* Пояснение для разделов */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography color="error" sx={{ mr: 0.5 }}>
            *
          </Typography>
          <Typography>
            {t('feedback.selectSection')}
          </Typography>
        </Box>

        {/* Выпадающее меню с чекбоксами */}
        <FormControl fullWidth sx={{ mb: 2 }}>
          <InputLabel>{t('feedback.section')}</InputLabel>
          <Select
            multiple
            value={selectedSections}
            onChange={handleSectionChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {sections.map((section) => (
              <MenuItem key={section} value={section}>
                <Checkbox checked={selectedSections.indexOf(section) > -1} />
                <ListItemText primary={section} />
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Поле для email */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography color="error" sx={{ mr: 0.5 }}>
            *
          </Typography>
          <Typography>{t('feedback.email')}</Typography>
        </Box>
        <TextField
          fullWidth
          label={t('feedback.emailPlaceholder')}
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          margin="normal"
          required
          type="email"
        />

        {/* Поле для загрузки фото */}
        <Box sx={{ mb: 1 }}>
          <Typography>{t('feedback.uploadPhoto')}</Typography>
        </Box>
        <TextField
          fullWidth
          type="file"
          onChange={handleImageChange}
          margin="normal"
          inputProps={{ accept: 'image/*' }}
        />

        {/* Пояснение для сообщения */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Typography color="error" sx={{ mr: 0.5 }}>
            *
          </Typography>
          <Typography>
            {t('feedback.describeIssue')}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label={t('feedback.messagePlaceholder')}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          margin="normal"
          multiline
          rows={4}
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid()}
          sx={{
            bgcolor: '#616161',
            '&:hover': { bgcolor: '#424242' },
            '&.Mui-disabled': { bgcolor: '#e0e0e0', color: '#9e9e9e' },
          }}
        >
          {t('continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};