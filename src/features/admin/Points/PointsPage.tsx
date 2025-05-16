// pages/admin/PointsPage.tsx
import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Checkbox,
  Tabs,
  Tab
} from '@mui/material';
import { PointInfo } from '../../real_api/MapServiceApi';
import { useAdminPoints } from './useAdminPoints';

interface PointFormData {
  name: Record<string, string>;
  description: Record<string, string>;
  fact: Record<string, string>;
  x: number;
  y: number;
  z: number;
  icon: string | null;
  isActive: boolean;
}

const languageTabs = ['ru', 'en', 'cn'] as const;
type Language = typeof languageTabs[number];

const PointsPage: React.FC = () => {
  const { points, loading, error, setError, createPoint, updatePoint, deletePoint } = useAdminPoints();
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [editPoint, setEditPoint] = useState<PointInfo | null>(null);
  const [currentLang, setCurrentLang] = useState<Language>('ru');

  const [formData, setFormData] = useState<PointFormData>({
    name: { ru: '', en: '', cn: '' },
    description: { ru: '', en: '', cn: '' },
    fact: { ru: '', en: '', cn: '' },
    x: 0,
    y: 0,
    z: 0,
    icon: null,
    isActive: true
  });

  const filteredPoints = points.filter(point => 
    Object.values(point.name || {}).some(value => 
      value.toLowerCase().includes(search.toLowerCase())
  ));

const handleFileUpload = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      // Валидация типа и размера файла
      if (!file.type.startsWith('image/')) {
        setError('Можно загружать только изображения');
        return;
      }
      
      if (file.size > 2 * 1024 * 1024) {
        setError('Максимальный размер файла - 2MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          icon: reader.result as string
        }));
      };
      reader.readAsDataURL(file);
    },
    [setError]
  );

  const handleCloseDialog = () => {
    setOpenCreate(false);
    setEditPoint(null);
    setError('');
  };

  const handleSubmit = useCallback(async () => {
    if (!Object.values(formData.name).some(v => v.trim())) {
      setError('Необходимо указать название хотя бы на одном языке');
      return;
    }

    const data = {
      ...formData,
      x: Number(formData.x),
      y: Number(formData.y),
      z: Number(formData.z),
      isActive: formData.isActive,
      icon: formData.icon?.startsWith('data:image') 
        ? formData.icon.split(',')[1] // Отправляем только данные
        : formData.icon
    };

    if (data.icon && !/^[A-Za-z0-9+/]+={0,2}$/.test(data.icon)) {
      setError('Некорректный формат изображения');
      return;
    }

    
    try {
      if (editPoint) {
        await updatePoint(editPoint.id!, data);
      } else {
        await createPoint(data);
      }
      handleCloseDialog();
    } catch (err) {
      setError('Ошибка при сохранении точки');
    }
  }, [formData, editPoint]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление точками</Typography>
      
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mb: 3, display: 'flex', gap: 2 }}>
        <TextField
          label="Поиск точек"
          variant="outlined"
          fullWidth
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Button 
          variant="contained" 
          onClick={() => {
            setFormData({
              name: { ru: '', en: '', cn: '' },
              description: { ru: '', en: '', cn: '' },
              fact: { ru: '', en: '', cn: '' },
              x: 0,
              y: 0,
              z: 0,
              icon: 'default',
              isActive: true
            });
            setOpenCreate(true);
          }}
        >
          Новая точка
        </Button>
      </Box>

      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Название</TableCell>
              <TableCell>Координаты</TableCell>
              <TableCell>Факт</TableCell>
              <TableCell>Активна</TableCell>
              <TableCell>Автор</TableCell>
              <TableCell>Дата создания</TableCell>
              <TableCell>Действия</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPoints.map(point => (
              <TableRow key={point.id}>
                <TableCell>{point.name?.ru || point.name?.en || 'Без названия'}</TableCell>
                <TableCell>{`X: ${point.x}, Y: ${point.y}, Z: ${point.z}`}</TableCell>
                <TableCell>{point.fact?.ru || point.fact?.en || '-'}</TableCell>
                <TableCell>{point.isActive ? 'Да' : 'Нет'}</TableCell>
                <TableCell>{point.createdBy || 'Система'}</TableCell>
                <TableCell>
                  {point.createdAtUtc ? 
                    new Date(point.createdAtUtc).toLocaleDateString() : '-'}
                </TableCell>
                <TableCell sx={{ display: 'flex', gap: 1 }}>
                  <Button 
                    variant="outlined"
                    onClick={() => {
                      setEditPoint(point);
                      setFormData({
                        name: point.name || { ru: '', en: '' },
                        description: point.description || { ru: '', en: '' },
                        fact: point.fact || { ru: '', en: '' },
                        x: point.x || 0,
                        y: point.y || 0,
                        z: point.z || 0,
                        icon: point.icon || 'default',
                        isActive: point.isActive ?? true
                      });
                      setOpenCreate(true);
                    }}
                  >
                    Редактировать
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error"
                    onClick={() => point.id && deletePoint(point.id)}
                  >
                    Удалить
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openCreate} onClose={handleCloseDialog} maxWidth="md" fullWidth>
        <DialogTitle>{editPoint ? 'Редактирование точки' : 'Новая точка'}</DialogTitle>
        <DialogContent>
          <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
            <Tabs 
              value={currentLang} 
              onChange={(_, newValue) => setCurrentLang(newValue)}
            >
              <Tab label="Русский" value="ru" />
              <Tab label="English" value="en" />
              <Tab label="中文" value="cn" />
            </Tabs>
          </Box>

          <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              label="Название"
              value={formData.name[currentLang] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, [currentLang]: e.target.value }
              }))}
              fullWidth
            />

            <TextField
              label="Факт"
              value={formData.fact[currentLang] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                fact: { ...prev.fact, [currentLang]: e.target.value }
              }))}
              fullWidth
              multiline
              rows={3}
            />

            <TextField
              label="Описание"
              value={formData.description[currentLang] || ''}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                description: { ...prev.description, [currentLang]: e.target.value }
              }))}
              fullWidth
              multiline
              rows={3}
            />
          </Box>

          <Box sx={{ mt: 3, display: 'grid', gap: 2, gridTemplateColumns: 'repeat(3, 1fr)' }}>
            <TextField
              label="X координата"
              type="number"
              value={formData.x}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                x: parseFloat(e.target.value) || 0 
              }))}
            />
            <TextField
              label="Y координата"
              type="number"
              value={formData.y}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                y: parseFloat(e.target.value) || 0 
              }))}
            />
            <TextField
              label="Z координата"
              type="number"
              value={formData.z}
              onChange={(e) => setFormData(prev => ({ 
                ...prev, 
                z: parseFloat(e.target.value) || 0 
              }))}
            />
          </Box>

           <Box sx={{ mt: 3, display: 'flex', gap: 2, alignItems: 'center' }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ minWidth: 120 }}
              >
                Загрузить иконку
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={handleFileUpload}
                />
              </Button>

              {formData.icon && (
                <Box sx={{ position: 'relative' }}>
                  <img 
                    src={formData.icon}
                    alt="Preview" 
                    style={{ 
                      width: 50, 
                      height: 50,
                      objectFit: 'contain',
                      borderRadius: 4 
                    }}
                  />
                  <Button
                    size="small"
                    color="error"
                    sx={{
                      position: 'absolute',
                      top: -8,
                      right: -8,
                      minWidth: 24,
                      height: 24,
                      borderRadius: '50%'
                    }}
                    onClick={() => setFormData(prev => ({ ...prev, icon: null }))}
                  >
                    ×
                  </Button>
                </Box>
              )}

              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.isActive}
                    onChange={(e) => setFormData(prev => ({
                      ...prev,
                      isActive: e.target.checked
                    }))}
                  />
                }
                label="Активная точка"
              />
            </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Отмена</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained" 
            color="primary"
            disabled={!Object.values(formData.name).some(v => v.trim())}
          >
            {editPoint ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PointsPage;