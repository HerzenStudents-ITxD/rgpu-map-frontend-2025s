import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface EditNameFormProps {
  open: boolean;
  onClose: () => void;
  name: string;
  lastName: string;
  onSave: (name: string, lastName: string) => void;
}

export const EditNameForm: React.FC<EditNameFormProps> = ({ open, onClose, name, lastName, onSave }) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({ name, lastName });

  useEffect(() => {
    setFormData({ name, lastName });
  }, [name, lastName]);

  const handleSubmit = () => {
    onSave(formData.name, formData.lastName);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{t('profile.editName')}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label={t('profile.lastName')}
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label={t('profile.name')}
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            margin="normal"
            required
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};