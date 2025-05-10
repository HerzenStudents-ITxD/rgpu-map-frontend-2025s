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
  Checkbox
} from '@mui/material';
import { PointInfo } from '../real_api/MapServiceApi';
import { useAdminPoints } from './useAdminPoints';

interface PointFormData {
  name: {
    ru: string;
    en: string;
  };
  description: {
    ru: string;
    en: string;
  };
  fact: {
    ru: string;
    en: string;
  };
  x: number;
  y: number;
  z: number;
  icon: string;
  isActive: boolean;
}

const PointsPage: React.FC = () => {
  const { points, loading, error, setError, createPoint, updatePoint, deletePoint } = useAdminPoints();
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [editPoint, setEditPoint] = useState<PointInfo | null>(null);

  const [formData, setFormData] = useState<PointFormData>({
    name: { ru: '', en: '' },
    description: { ru: '', en: '' },
    fact: { ru: '', en: '' },
    x: 0,
    y: 0,
    z: 0,
    icon: 'default',
    isActive: true
  });

  const filteredPoints = points.filter(point => 
    Object.values(point.name || {}).some(value => 
      value.toLowerCase().includes(search.toLowerCase())
  ));

  const handleSubmit = useCallback(async () => {

    if (!formData.name.ru && !formData.name.en) {
      setError('Необходимо указать название хотя бы на одном языке');
      return;
    }

    const data = {
      ...formData,
      x: Number(formData.x),
      y: Number(formData.y),
      z: Number(formData.z),
      isActive: formData.isActive
    };
    
    if (editPoint) {
      await updatePoint(editPoint.id!, data);
    } else {
      await createPoint(data);
    }
    setOpenCreate(false);
    setEditPoint(null);
  }, [formData, editPoint]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление точками</Typography>
      
      {error && <Alert severity="error">{error}</Alert>}

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
              name: { ru: '', en: '' },
              description: { ru: '', en: '' },
              fact: { ru: '', en: '' },
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
              <TableCell>Факт</TableCell>
              <TableCell>Координаты</TableCell>
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
                <TableCell>
                  <Button onClick={() => {
                    setEditPoint(point);
                    setFormData({
                      name: {
                        ru: point.name?.ru || '', // Явное извлечение русской версии
                        en: point.name?.en || ''  // Явное извлечение английской версии
                      },
                      description: {
                        ru: point.description?.ru || '',
                        en: point.description?.en || ''
                      },
                      fact: {
                        ru: point.fact?.ru || '',
                        en: point.fact?.en || ''
                      },
                      x: point.x || 0,
                      y: point.y || 0,
                      z: point.z || 0,
                      icon: point.icon || 'default',
                      isActive: point.isActive || true
                    });
                    setOpenCreate(true);
                  }}>
                    Редактировать
                  </Button>
                  <Button 
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

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>{editPoint ? 'Редактирование точки' : 'Новая точка'}</DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2, display: 'grid', gap: 2, gridTemplateColumns: '1fr 1fr' }}>
            <TextField
              label="Название (рус)"
              value={formData.name.ru}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, ru: e.target.value }
              }))}
              fullWidth
            />
            <TextField
              label="Название (англ)"
              value={formData.name.en}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                name: { ...prev.name, en: e.target.value }
              }))}
              fullWidth
            />
            
            <TextField
              label="X координата"
              type="number"
              value={formData.x}
              onChange={(e) => setFormData(prev => ({ ...prev, x: parseFloat(e.target.value) }))}
            />
            <TextField
              label="Y координата"
              type="number"
              value={formData.y}
              onChange={(e) => setFormData(prev => ({ ...prev, y: parseFloat(e.target.value) }))}
            />
            <TextField
              label="Z координата"
              type="number"
              value={formData.z}
              onChange={(e) => setFormData(prev => ({ ...prev, z: parseFloat(e.target.value) }))}
            />
            
            <FormControl fullWidth>
              <InputLabel>Иконка</InputLabel>
              <Select
                value={formData.icon}
                onChange={(e) => setFormData(prev => ({ ...prev, icon: e.target.value }))}
              >
                <MenuItem value="empty">пустая</MenuItem>
                <MenuItem value="exit">КПП</MenuItem>
                <MenuItem value="landmark">Достопримечательность</MenuItem>
              </Select>
            </FormControl>
            <TextField
                label="Факт (рус)"
                value={formData.fact.ru}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fact: { ...prev.fact, ru: e.target.value }
                }))}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Факт (англ)"
                value={formData.fact.en}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  fact: { ...prev.fact, en: e.target.value }
                }))}
                fullWidth
                multiline
                rows={3}
              />

              {/* Добавляем Description */}
              <TextField
                label="Описание (рус)"
                value={formData.description.ru}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, ru: e.target.value }
                }))}
                fullWidth
                multiline
                rows={3}
              />
              <TextField
                label="Описание (англ)"
                value={formData.description.en}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  description: { ...prev.description, en: e.target.value }
                }))}
                fullWidth
                multiline
                rows={3}
              />

              {/* Добавляем IsActive */}
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
          <Button onClick={() => setOpenCreate(false)}>Отмена</Button>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            {editPoint ? 'Сохранить' : 'Создать'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PointsPage;