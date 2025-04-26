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
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{t('settings.feedback')}</Typography>
      </DialogTitle>
      <DialogContent>
        {/* Пояснение для разделов */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
          <Typography sx={{ color: '#f44336', mr: 0.5 }}>
            *
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
            {t('feedback.selectSection')}
          </Typography>
        </Box>

        {/* Выпадающее меню с чекбоксами */}
        <FormControl fullWidth sx={{ mt: 0, mb: 2 }}>
          <Select
            multiple
            value={selectedSections}
            onChange={handleSectionChange}
            renderValue={(selected) => (selected as string[]).join(', ')}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
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
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 0, mb: 0 }}>
          <Typography sx={{ color: '#f44336', mr: 0.5 }}>
            *
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
            {t('feedback.email')}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label={t('feedback.emailPlaceholder')}
          value={form.contact}
          onChange={(e) => setForm({ ...form, contact: e.target.value })}
          sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          required
          type="email"
          InputLabelProps={{ required: false }}
        />

        {/* Поле для загрузки фото */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 0 }}>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
            {t('feedback.photoLabel')}
          </Typography>
        </Box>
        <Box sx={{ mt: 1, mb: 2 }}>
          <Button
            variant="outlined"
            component="label"
            sx={{ borderRadius: '8px' }}
          >
            {t('feedback.uploadButton')}
            <input
              type="file"
              accept="image/*"
              hidden
              onChange={handleImageChange}
            />
          </Button>
          {image && (
            <Typography variant="body2" sx={{ mt: 1 }}>
              {t('feedback.selectedFile')}: {image.name}
            </Typography>
          )}
        </Box>

        {/* Пояснение для сообщения */}
        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 0 }}>
          <Typography sx={{ color: '#f44336', mr: 0.5 }}>
            *
          </Typography>
          <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
            {t('feedback.describeIssue')}
          </Typography>
        </Box>
        <TextField
          fullWidth
          label={t('feedback.messagePlaceholder')}
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          sx={{ mt: 1, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
          multiline
          rows={4}
          required
          InputLabelProps={{ required: false }}
        />
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid()}
          sx={{ borderRadius: '8px' }}
        >
          {t('continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};