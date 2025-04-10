// src/features/settings/components/ProfileForm.tsx
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
  Avatar
} from '@mui/material';
import { UserProfile } from '../types';
import { useSettings } from '../hooks/useSettings';


interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<UserProfile>;
}

export const ProfileForm = ({ open, onClose, profile, onUpdate }: ProfileFormProps) => {
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">{'Редактирование профиля'}</Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Avatar
              sx={{ width: 100, height: 100 }}
              src={formData.avatar}
            />
          </Box>

          <TextField
            fullWidth
            label="Имя"
            value={formData.name || ''}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Email"
            type="email"
            value={formData.email || ''}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            margin="normal"
            required
          />

          <TextField
            fullWidth
            label="Группа"
            value={formData.group || ''}
            onChange={(e) => setFormData({...formData, group: e.target.value})}
            margin="normal"
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Отмена</Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="primary"
        >
          Сохранить
        </Button>
      </DialogActions>
    </Dialog>
  );
};