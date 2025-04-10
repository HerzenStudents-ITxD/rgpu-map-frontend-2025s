import React, { useState } from 'react';
import { 
  Container,
  Box,
  TextField,
  Button,
  ButtonProps,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Typography,
  CircularProgress,
  Alert,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import { usePoints } from '../../modules/map/usePoints';
import { useTranslation } from 'react-i18next';
import { Point, PointType } from '../../types/points';
import { Link, LinkProps } from 'react-router-dom';


type ButtonLinkProps = ButtonProps & LinkProps;

const PointsAdmin: React.FC = () => {
  const { t } = useTranslation();
  const { points, loading, error, addPoint, editPoint, deletePoint } = usePoints();
  
  const [newPoint, setNewPoint] = useState<Omit<Point, 'point_id'>>({
    user_id: 'admin',
    x: 0,
    y: 0,
    z: 0,
    type: 1,
    connections: [],
  });

  const [editingPoint, setEditingPoint] = useState<Point | null>(null);

  // Добавление точки
  const handleAddPoint = async () => {
    if (newPoint.x && newPoint.y && newPoint.z) {
      await addPoint(newPoint);
      setNewPoint({
        user_id: 'admin',
        x: 0,
        y: 0,
        z: 0,
        type: 1,
        connections: [],
      });
    }
  };

  // Редактирование точки
  const handleSavePoint = async () => {
    if (editingPoint) {
      await editPoint(editingPoint.point_id, editingPoint);
      setEditingPoint(null);
    }
  };

  // Изменение типа точки
  const handleTypeChange = (value: string) => {
    const numericValue = parseInt(value, 10);
    if ([1, 2, 3].includes(numericValue)) {
      setNewPoint(prev => ({
        ...prev,
        type: numericValue as PointType
      }));
    }
  };

  // Удаление точки
  const handleDeletePoint = async (id: string) => {
    await deletePoint(id);
  };

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      {/* Заголовок и навигация */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('admin.pointsManagement')}</Typography>
        <Button
          component={Link}
          to="/admin/users"
          variant="contained"
          sx={{ minWidth: 200 }}
        >
          {t('admin.manageUsers')}
        </Button>
      </Box>

      {/* Форма добавления */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 1,
        mb: 3
      }}>
        <Typography variant="h6" gutterBottom>
          {t('admin.addNewPoint')}
        </Typography>
        
        <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 2 }}>
          <TextField
            label="X"
            type="number"
            value={newPoint.x}
            onChange={e => setNewPoint({...newPoint, x: Number(e.target.value)})}
          />
          <TextField
            label="Y"
            type="number"
            value={newPoint.y}
            onChange={e => setNewPoint({...newPoint, y: Number(e.target.value)})}
          />
          <TextField
            label="Z"
            type="number"
            value={newPoint.z}
            onChange={e => setNewPoint({...newPoint, z: Number(e.target.value)})}
          />
          <FormControl fullWidth>
            <InputLabel>{t('admin.pointType')}</InputLabel>
            <Select
              value={newPoint.type.toString()}
              onChange={(e) => handleTypeChange(e.target.value)}
              label={t('admin.pointType')}
            >
              <MenuItem value="1">{t('admin.classroom')}</MenuItem>
              <MenuItem value="2">{t('admin.corridor')}</MenuItem>
              <MenuItem value="3">{t('admin.stairs')}</MenuItem>
            </Select>
          </FormControl>
          <Button 
            variant="contained" 
            onClick={handleAddPoint}
            sx={{ height: 56 }}
          >
            {t('admin.addPoint')}
          </Button>
        </Box>
      </Box>

      {/* Состояния загрузки/ошибки */}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      {/* Список точек */}
      <Box sx={{ 
        backgroundColor: 'background.paper',
        p: 3,
        borderRadius: 2,
        boxShadow: 1
      }}>
        <Typography variant="h6" gutterBottom>
          {t('admin.existingPoints')}
        </Typography>
        <List>
          {points.map(point => (
            <ListItem 
              key={point.point_id}
              secondaryAction={
                <>
                  <IconButton 
                    onClick={() => setEditingPoint(point)}
                    color="primary"
                    sx={{ mr: 1 }}
                  >
                    <Edit />
                  </IconButton>
                  <IconButton 
                    onClick={() => handleDeletePoint(point.point_id)}
                    color="error"
                  >
                    <Delete />
                  </IconButton>
                </>
              }
              sx={{
                borderBottom: '1px solid',
                borderColor: 'divider',
                '&:last-child': { borderBottom: 'none' }
              }}
            >
              <ListItemText
                primary={`${t('admin.point')} #${point.point_id}`}
                secondary={
                  <>
                    <Box>
                      {t('admin.coordinates')}: 
                      X={point.x}, Y={point.y}, Z={point.z}
                    </Box>
                    <Box sx={{ mt: 1 }}>
                      {t('admin.type')}: {{
                        1: t('admin.classroom'),
                        2: t('admin.corridor'),
                        3: t('admin.stairs')
                      }[point.type]}
                    </Box>
                    {point.connections && point.connections.length > 0 && (
                      <Box sx={{ mt: 1 }}>
                        {t('admin.connections')}: 
                        {point.connections.map(id => (
                          <Chip 
                            key={id} 
                            label={id} 
                            sx={{ mr: 1, mt: 1 }}
                          />
                        ))}
                      </Box>
                    )}
                  </>
                }
              />
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Модальное окно редактирования */}
      {editingPoint && (
        <Box sx={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          bgcolor: 'background.paper',
          p: 4,
          borderRadius: 2,
          boxShadow: 24,
          width: 600,
          zIndex: 1300
        }}>
          <Typography variant="h6" gutterBottom>
            {t('admin.editPoint')}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <TextField
              label="X"
              type="number"
              value={editingPoint.x}
              onChange={e => setEditingPoint({
                ...editingPoint,
                x: Number(e.target.value)
              })}
            />
            <TextField
              label="Y"
              type="number"
              value={editingPoint.y}
              onChange={e => setEditingPoint({
                ...editingPoint,
                y: Number(e.target.value)
              })}
            />
            <TextField
              label="Z"
              type="number"
              value={editingPoint.z}
              onChange={e => setEditingPoint({
                ...editingPoint,
                z: Number(e.target.value)
              })}
            />
            <FormControl fullWidth>
              <InputLabel>{t('admin.pointType')}</InputLabel>
              <Select
                value={editingPoint.type.toString()}
                onChange={e => setEditingPoint({
                  ...editingPoint,
                  type: parseInt(e.target.value, 10) as PointType
                })}
                label={t('admin.pointType')}
              >
                <MenuItem value="1">{t('admin.classroom')}</MenuItem>
                <MenuItem value="2">{t('admin.corridor')}</MenuItem>
                <MenuItem value="3">{t('admin.stairs')}</MenuItem>
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                onClick={handleSavePoint}
                fullWidth
              >
                {t('admin.saveChanges')}
              </Button>
              <Button
                variant="outlined"
                onClick={() => setEditingPoint(null)}
                fullWidth
              >
                {t('admin.cancel')}
              </Button>
            </Box>
          </Box>
        </Box>
      )}
    </Container>
  );
};

export default PointsAdmin;