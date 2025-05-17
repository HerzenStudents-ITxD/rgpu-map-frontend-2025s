import React from 'react';
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
  Tooltip
} from '@mui/material';
import { PointInfo } from '../../real_api/MapServiceApi';
import { useAdminRelations } from './useAdminRelations';

const RelationsPage: React.FC = () => {
  const {
    allPoints,
    relations,
    loading,
    error,
    selectedPoint,
    setSelectedPoint,
    searchQuery,
    setSearchQuery,
    createRelation,
    deleteRelation,
    setError
  } = useAdminRelations();

  const filteredPoints = allPoints.filter(point =>
    Object.values(point.name || {}).some(name =>
      name.toLowerCase().includes(searchQuery.toLowerCase())
  ));

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление связями</Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
          {error}
        </Alert>
      )}

      <Box sx={{ mb: 3 }}>
        <TextField
          label="Поиск точек по названию"
          variant="outlined"
          fullWidth
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </Box>

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Название</TableCell>
            <TableCell>Координаты</TableCell>
            <TableCell>Факт</TableCell>
            <TableCell>Активна</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {allPoints.map(point => (
            <TableRow 
              key={point.id} 
              hover 
              sx={{ cursor: 'pointer' }}
            >
              <TableCell>
                <Tooltip 
                  title={
                    `ID: ${point.id}\n` +
                    `Создатель: ${point.createdBy || 'Система'}\n` +
                    `Дата: ${point.createdAtUtc ? new Date(point.createdAtUtc).toLocaleDateString() : '-'}`
                  }
                  arrow
                >
                  <span>{point.name?.ru || 'Без названия'}</span>
                </Tooltip>
              </TableCell>
              <TableCell>{`X: ${point.x}, Y: ${point.y}, Z: ${point.z}`}</TableCell>
              <TableCell>{point.fact?.ru || '-'}</TableCell>
              <TableCell>{point.isActive ? 'Да' : 'Нет'}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined"
                  onClick={() => setSelectedPoint(point)}
                >
                  Управление связями
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog
        open={!!selectedPoint}
        onClose={() => setSelectedPoint(null)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          Управление связями для точки: {selectedPoint?.name?.ru}
        </DialogTitle>
        
        <DialogContent>
          <Typography variant="h6" sx={{ mb: 2 }}>Текущие связи:</Typography>
          
          <Table sx={{ mb: 4 }}>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Координаты</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {relations.map(relation => (
                <TableRow key={relation.id}>
                  <TableCell>
                    <Tooltip
                      title={`ID: ${relation.id}\nСоздатель: ${relation.createdBy || 'Система'}`}
                      arrow
                    >
                      <span>{relation.name?.ru || 'Без названия'}</span>
                    </Tooltip>
                  </TableCell>
                  <TableCell>{`X: ${relation.x}, Y: ${relation.y}, Z: ${relation.z}`}</TableCell>
                  <TableCell>
                    <Button
                      color="error"
                      onClick={() => deleteRelation(relation.id!)}
                      disabled={loading}
                    >
                      {loading ? <CircularProgress size={24} /> : 'Удалить связь'}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <Typography variant="h6" sx={{ mb: 2 }}>Доступные для связи точки:</Typography>
          
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Название</TableCell>
                <TableCell>Координаты</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPoints
                .filter(p => 
                p.id !== selectedPoint?.id && 
                !relations.some(rel => rel.id === p.id) // Добавлено исключение связанных точек
                )
                .map(point => (
                  <TableRow key={point.id}>
                    <TableCell>
                      <Tooltip
                        title={`ID: ${point.id}\nСоздатель: ${point.createdBy || 'Система'}`}
                        arrow
                      >
                        <span>{point.name?.ru || 'Без названия'}</span>
                      </Tooltip>
                    </TableCell>
                    <TableCell>{`X: ${point.x}, Y: ${point.y}, Z: ${point.z}`}</TableCell>
                    <TableCell>
                      <Button
                        variant="contained"
                        onClick={() => createRelation(point.id!)}
                        disabled={loading}
                      >
                        {loading ? <CircularProgress size={24} /> : 'Создать связь'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </DialogContent>
        
        <DialogActions>
          <Button onClick={() => setSelectedPoint(null)}>Закрыть</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RelationsPage;