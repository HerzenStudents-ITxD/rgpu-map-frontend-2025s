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
  Avatar,
  Select,
  MenuItem,
  FormControl,
  InputLabel
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
  const [editNameOpen, setEditNameOpen] = useState(false);

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onUpdate(formData);
    onClose();
  };

  const handleNameEdit = () => {
    setEditNameOpen(true);
  };

  const handleNameSave = async (firstName: string, lastName: string) => {
    setFormData((prev) => ({
      ...prev,
      name: `${firstName} ${lastName}` // Обновляем полное имя
    }));
    await onUpdate({ name: `${firstName} ${lastName}` });
    setEditNameOpen(false);
  };

  const handleNameCancel = () => {
    setEditNameOpen(false);
  };

  // Разделение имени и фамилии для редактирования (примерная логика)
  const [firstName, lastName] = formData.name?.split(' ') || ['', ''];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">Редактирование профиля</Typography>
      </DialogTitle>
      <DialogContent>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
            <Box
              sx={{
                position: 'relative',
                '&:hover': { cursor: 'pointer' }
              }}
              onClick={handleNameEdit}
            >
              <Avatar
                sx={{ width: 100, height: 100 }}
                src={formData.avatar}
              />
              <Box
                sx={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(0,0,0,0.5)',
                  color: 'white',
                  opacity: 0,
                  '&:hover': { opacity: 1 },
                  transition: 'opacity 0.3s'
                }}
              >
                <Typography variant="body2">Изменить имя</Typography>
              </Box>
            </Box>
            <Box sx={{ ml: 2 }}>
              <Typography variant="body1" onClick={handleNameEdit} sx={{ '&:hover': { cursor: 'pointer' } }}>
                {formData.name || 'Имя Фамилия'}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                студент
              </Typography>
            </Box>
          </Box>

          <FormControl fullWidth margin="normal">
            <InputLabel>Факультет/Институт</InputLabel>
            <Select
              value={formData.institute || ''}
              onChange={(e) => setFormData({ ...formData, institute: e.target.value as string })}
              label="Факультет/Институт"
            >
              <MenuItem value="Институт Народов Севера">Институт Народов Севера</MenuItem>
              <MenuItem value="Институт Естественных Наук">Институт Естественных Наук</MenuItem>
              <MenuItem value="Институт Гуманитарных Наук">Институт Гуманитарных Наук</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Форма обучения</InputLabel>
            <Select
              value={formData.formEducation || ''}
              onChange={(e) => setFormData({ ...formData, formEducation: e.target.value as string })}
              label="Форма обучения"
            >
              <MenuItem value="Очная">Очная</MenuItem>
              <MenuItem value="Заочная">Заочная</MenuItem>
              <MenuItem value="Дистанционная">Дистанционная</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Ступень обучения</InputLabel>
            <Select
              value={formData.degree || ''}
              onChange={(e) => setFormData({ ...formData, degree: e.target.value as string })}
              label="Ступень обучения"
            >
              <MenuItem value="Бакалавриат">Бакалавриат</MenuItem>
              <MenuItem value="Магистратура">Магистратура</MenuItem>
              <MenuItem value="Аспирантура">Аспирантура</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Год обучения</InputLabel>
            <Select
              value={formData.course || ''}
              onChange={(e) => setFormData({ ...formData, course: e.target.value as string })}
              label="Год обучения"
            >
              <MenuItem value="1 курс">1 курс</MenuItem>
              <MenuItem value="2 курс">2 курс</MenuItem>
              <MenuItem value="3 курс">3 курс</MenuItem>
              <MenuItem value="4 курс">4 курс</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Группа</InputLabel>
            <Select
              value={formData.group || ''}
              onChange={(e) => setFormData({ ...formData, group: e.target.value as string })}
              label="Группа"
            >
              <MenuItem value="ИТМ-ИО-ЧНЭ">ИТМ-ИО-ЧНЭ</MenuItem>
              <MenuItem value="ИТМ-ИО-ЧНЭ-2">ИТМ-ИО-ЧНЭ-2</MenuItem>
              <MenuItem value="ИЭН-О-2023">ИЭН-О-2023</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth margin="normal">
            <InputLabel>Подгруппа</InputLabel>
            <Select
              value={formData.subGroup || ''}
              onChange={(e) => setFormData({ ...formData, subGroup: e.target.value as string })}
              label="Подгруппа"
            >
              <MenuItem value="Подгруппа 1">Подгруппа 1</MenuItem>
              <MenuItem value="Подгруппа 2">Подгруппа 2</MenuItem>
              <MenuItem value="Подгруппа 3">Подгруппа 3</MenuItem>
            </Select>
          </FormControl>
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

      {/* Модальное окно для редактирования имени */}
      <Dialog open={editNameOpen} onClose={handleNameCancel} maxWidth="xs" fullWidth>
        <DialogTitle>Изменить имя</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Имя"
            value={firstName || ''}
            onChange={(e) => setFormData({ ...formData, name: `${e.target.value} ${lastName}` })}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Фамилия"
            value={lastName || ''}
            onChange={(e) => setFormData({ ...formData, name: `${firstName} ${e.target.value}` })}
            margin="normal"
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleNameCancel}>Отмена</Button>
          <Button onClick={() => handleNameSave(firstName || '', lastName || '')} variant="contained" color="primary">
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Dialog>
  );
};