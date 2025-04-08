import { useState } from 'react';
import { 
  Button, 
  TextField, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions 
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
    contact: ''
  });

  const handleSubmit = async () => {
    await sendFeedback(form);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Обратная связь</DialogTitle>
      <DialogContent>
        <TextField
          fullWidth
          label="Тема"
          value={form.subject}
          onChange={(e) => setForm({...form, subject: e.target.value})}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label="Сообщение"
          value={form.message}
          onChange={(e) => setForm({...form, message: e.target.value})}
          margin="normal"
          multiline
          rows={4}
          required
        />
        <TextField
          fullWidth
          label="Контактная информация"
          value={form.contact}
          onChange={(e) => setForm({...form, contact: e.target.value})}
          margin="normal"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Отправить
        </Button>
      </DialogActions>
    </Dialog>
  );
};