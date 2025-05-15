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

// Кастомный компонент для значка
const CustomArrowIcon = (props: any) => (
  <Box
    component="img"
    src="/svg/arrow-drop-down.svg"
    alt="Custom Arrow Icon"
    {...props}
    sx={{
      width: '36px',
      height: '36px',
      position: 'absolute',
      right: '8px',
      top: '50%', // Центрируем по вертикали относительно поля Select
      transform: 'translateY(-30%)', // Точное центрирование по вертикали
      pointerEvents: 'none', // Чтобы иконка не мешала кликам по Select
      // Корректируем трансформацию при открытии списка
      '&.MuiSelect-iconOpen': {
        transform: 'translateY(-30%) rotate(180deg)', // Сначала центрируем, потом вращаем
      },
    }}
  />
);

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
  const studyYears = ['1 курс', "2 курс", '3 курс', '4 курс'];
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
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h5">{t('settings.profile')}</Typography>
      </DialogTitle>
      <DialogContent>
        {/* Рамка с именем пользователя */}
        <Box
          sx={{
            height: '60px',
            display: 'flex',
            alignItems: 'flex-end', // Прижимаем содержимое к нижнему краю
            border: '2px solid #6E6B62',
            borderRadius: '8px',
            px: 0,
            mb: 2,
            cursor: 'pointer',
          }}
          onClick={() => setEditNameOpen(true)}
        >
          <Box
            component="img"
            src="/svg/icon-man.svg"
            alt="User Icon"
            sx={{ width: 50, height: 50, mr: 2, mb: -0.1 }} // Небольшой отступ снизу для выравнивания
          />
          <Typography
            variant="body1"
            sx={{
              mb: 2,
              fontSize: '1.125rem', // Увеличиваем размер текста до 18px
              fontWeight: 500, // Делаем текст немного жирным
            }}
          >
            {formData.lastName} {formData.name}
          </Typography>
        </Box>

        {/* Выпадающие меню */}
        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.faculty')}
          </InputLabel>
          <Select
            value={formData.faculty || ''}
            onChange={(e) => setFormData({ ...formData, faculty: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {faculties.map((faculty) => (
              <MenuItem key={faculty} value={faculty}>
                {faculty}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.studyForm')}
          </InputLabel>
          <Select
            value={formData.studyForm || ''}
            onChange={(e) => setFormData({ ...formData, studyForm: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {studyForms.map((form) => (
              <MenuItem key={form} value={form}>
                {form}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.studyLevel')}
          </InputLabel>
          <Select
            value={formData.studyLevel || ''}
            onChange={(e) => setFormData({ ...formData, studyLevel: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {studyLevels.map((level) => (
              <MenuItem key={level} value={level}>
                {level}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.studyYear')}
          </InputLabel>
          <Select
            value={formData.studyYear || ''}
            onChange={(e) => setFormData({ ...formData, studyYear: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {studyYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.group')}
          </InputLabel>
          <Select
            value={formData.group || ''}
            onChange={(e) => setFormData({ ...formData, group: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {groups.map((group) => (
              <MenuItem key={group} value={group}>
                {group}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth sx={{ mt: 2, mb: 2 }}>
          <InputLabel shrink sx={{ top: -10, fontSize: '1rem' }}>
            {t('profile.subgroup')}
          </InputLabel>
          <Select
            value={formData.subgroup || ''}
            onChange={(e) => setFormData({ ...formData, subgroup: e.target.value as string })}
            sx={{ height: '50px', borderRadius: '8px' }}
            variant="outlined"
            displayEmpty
            IconComponent={CustomArrowIcon} // Используем кастомный значок
          >
            {subgroups.map((subgroup) => (
              <MenuItem key={subgroup} value={subgroup}>
                {subgroup}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          {t('cancel')}
        </Button>
        <Button onClick={handleSubmit} variant="contained" color="primary" sx={{ borderRadius: '8px' }}>
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