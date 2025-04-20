import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from '@mui/material';
import { UserProfile } from '../types';
import { useTranslation } from 'react-i18next';
import { EditNameForm } from './EditNameForm';

interface ProfileFormProps {
  open: boolean;
  onClose: () => void;
  profile: UserProfile;
  onUpdate: (updatedProfile: Partial<UserProfile>) => Promise<UserProfile>;
}

export const ProfileForm = ({ open, onClose, profile, onUpdate }: ProfileFormProps) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Partial<UserProfile>>(profile);
  const [editNameOpen, setEditNameOpen] = useState(false);

  // Данные для выпадающих меню (временные, можно заменить на данные с сервера)
  const faculties = ['Факультет ИТ', 'Факультет экономики', 'Факультет права'];
  const studyForms = ['Очная', 'Заочная', 'Очно-заочная'];
  const studyLevels = ['Бакалавриат', 'Магистратура', 'Аспирантура'];
  const studyYears = ['1 курс', '2 курс', '3 курс', '4 курс'];
  const groups = ['ИТ-21', 'ИТ-22', 'ЭК-21', 'ПР-21'];
  const subgroups = ['Подгруппа 1', 'Подгруппа 2'];

  useEffect(() => {
    setFormData(profile);
  }, [profile]);

  const handleSubmit = async () => {
    await onUpdate(formData);
    onClose();
  };

  const handleNameSave = (name: string, lastName: string) => {
    setFormData({ ...formData, name, lastName });
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h5">{t('settings.profile')}</Typography>
      </DialogTitle>
      <DialogContent>
        {/* Рамка с именем пользователя */}
        <Box
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'center',
            border: '1px solid #e0e0e0',
            borderRadius: '8px',
            px: 2,
            mb: 2,
            cursor: 'pointer',
          }}
          onClick={() => setEditNameOpen(true)}
        >
          <Box
            component="img"
            src="/svg/icon-man.svg"
            alt="User Icon"
            sx={{ width: 24, height: 24, mr: 2 }}
          />
          <Typography variant="body1">
            {formData.lastName} {formData.name}
          </Typography>
        </Box>

        {/* Выпадающие меню */}
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('profile.faculty')}</InputLabel>
          <Select
            value={formData.faculty || ''}
            onChange={(e) => setFormData({ ...formData, faculty: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {faculties.map((faculty) => (
              <MenuItem key={faculty} value={faculty}>
                {faculty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('profile.studyForm')}</InputLabel>
          <Select
            value={formData.studyForm || ''}
            onChange={(e) => setFormData({ ...formData, studyForm: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {studyForms.map((form) => (
              <MenuItem key={form} value={form}>
                {form}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('profile.studyLevel')}</InputLabel>
          <Select
            value={formData.studyLevel || ''}
            onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {studyLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('profile.studyYear')}</InputLabel>
          <Select
            value={formData.studyYear || ''}
            onChange={(e) => setFormData({ ...formData, studyYear: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {studyYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2 }}>
          <InputLabel>{t('profile.group')}</InputLabel>
          <Select
            value={formData.group || ''}
            onChange={(e) => setFormData({ ...formData, group: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel>{t('profile.subgroup')}</InputLabel>
          <Select
            value={formData.subgroup || ''}
            onChange={(e) => setFormData({ ...formData, subgroup: e.target.value as string })}
            sx={{ height: '42px', borderRadius: '8px' }}
          >
            {subgroups.map((subgroup) => (
              <MenuItem key={subgroup} value={subgroup}>
                {subgroup}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          {t('save')}
        </Button>
      </DialogActions>

      {/* Вложенное модальное окно для редактирования имени */}
      <EditNameForm
        open={editNameOpen}
        onClose={() => setEditNameOpen(false)}
        name={formData.name || ''}
        lastName={formData.lastName || ''}
        onSave={handleNameSave}
      />
    </Dialog>
  );
};