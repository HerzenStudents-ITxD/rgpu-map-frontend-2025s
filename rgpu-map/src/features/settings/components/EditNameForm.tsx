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
  FormControl,
  InputLabel,
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

  const isFormValid = () => {
    return formData.name.trim() !== '' && formData.lastName.trim() !== '';
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{t('profile.editName')}</Typography>
      </DialogTitle>
      <DialogContent>
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: '#f44336', mr: 0.5 }}>
              *
            </Typography>
            <InputLabel shrink sx={{ top: -10, fontSize: '1rem', position: 'static', transform: 'none' }}>
              {t('profile.lastName')}
            </InputLabel>
          </Box>
          <TextField
            fullWidth
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            required
            InputLabelProps={{ required: false }}
          />
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography sx={{ color: '#f44336', mr: 0.5 }}>
              *
            </Typography>
            <InputLabel shrink sx={{ top: -10, fontSize: '1rem', position: 'static', transform: 'none' }}>
              {t('profile.name')}
            </InputLabel>
          </Box>
          <TextField
            fullWidth
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            sx={{ mt: 0.5, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
            required
            InputLabelProps={{ required: false }}
          />
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          sx={{ borderRadius: '8px' }}
          disabled={!isFormValid()}
        >
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};