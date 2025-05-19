import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  List,
  ListItem,
  TextField,
  Button,
  CircularProgress,
  Box,
  Chip,
  InputAdornment,
  IconButton
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import PlaceIcon from '@mui/icons-material/Place';
import RouteIcon from '@mui/icons-material/Route';
import { useMapStore } from '../Map/mapSlice';
import { MapService } from '../../api/mapService';
import { MapPoint3D } from '../../api/types';
import './RouteBuilder.css';

export const RouteBuilder: React.FC = () => {
  const { points, route, actions } = useMapStore();
  const [startSearch, setStartSearch] = useState('');
  const [endSearch, setEndSearch] = useState('');
  const [loading, setLoading] = useState(false);
  const [filteredStart, setFilteredStart] = useState<MapPoint3D[]>([]);
  const [filteredEnd, setFilteredEnd] = useState<MapPoint3D[]>([]);
  const [selectedStart, setSelectedStart] = useState<MapPoint3D | null>(null);
  const [selectedEnd, setSelectedEnd] = useState<MapPoint3D | null>(null);

  // Сброс выбранных точек при очистке поиска
  useEffect(() => {
    if (!startSearch) setSelectedStart(null);
  }, [startSearch]);

  useEffect(() => {
    if (!endSearch) setSelectedEnd(null);
  }, [endSearch]);

  const handleSearch = (type: 'start' | 'end', value: string) => {
    const filtered = points.filter(p => 
      p.name.toLowerCase().includes(value.toLowerCase())
    );
    
    type === 'start' 
      ? setFilteredStart(filtered)
      : setFilteredEnd(filtered);
  };

  const handleBuildRoute = async () => {
    if (!selectedStart?.id || !selectedEnd?.id) return;
    
    setLoading(true);
    try {
      const response = await MapService.getRoute({
        startPointId: selectedStart.id,
        endPointId: selectedEnd.id,
        locale: 'ru'
      });

      if (!response?.body?.length) {
        throw new Error('Маршрут между выбранными точками не найден');
      }

      const convertedRoute = response.body.map(point => ({
        id: point.id!,
        name: point.name?.ru || 'Точка маршрута',
        type: 'point' as const,
        position: [point.x, point.y, point.z] as [number, number, number],
        metadata: {
          isInteractive: false,
          description: point.description?.ru || '',
          fact: point.fact?.ru || ''
        }
      }));

      actions.setRoute(convertedRoute);
    } catch (error) {
      console.error('Ошибка построения маршрута:', error);
      alert(error instanceof Error ? error.message : 'Ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>
        Построение маршрута
      </Typography>

      <List>
        {/* Поле поиска начальной точки */}
        <ListItem >
          <Box width="100%">
            <TextField
              fullWidth
              label="Начальная точка"
              value={selectedStart?.name || startSearch}
              onChange={(e) => {
                setStartSearch(e.target.value);
                handleSearch('start', e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="primary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
            {filteredStart.map(point => (
              <Chip
                key={point.id}
                label={point.name}
                onClick={() => {
                  setSelectedStart(point);
                  setStartSearch(point.name);
                  setFilteredStart([]);
                }}
                sx={{ m: 0.5 }}
                variant="outlined"
                color={selectedStart?.id === point.id ? 'primary' : 'default'}
              />
            ))}
          </Box>
        </ListItem>

        {/* Поле поиска конечной точки */}
        <ListItem sx={{ mb: 3 }}>
          <Box width="100%">
            <TextField
              fullWidth
              label="Конечная точка"
              value={selectedEnd?.name || endSearch}
              onChange={(e) => {
                setEndSearch(e.target.value);
                handleSearch('end', e.target.value);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PlaceIcon color="secondary" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <IconButton size="small">
                    <SearchIcon fontSize="small" />
                  </IconButton>
                )
              }}
            />
            {filteredEnd.map(point => (
              <Chip
                key={point.id}
                label={point.name}
                onClick={() => {
                  setSelectedEnd(point);
                  setEndSearch(point.name);
                  setFilteredEnd([]);
                }}
                sx={{ m: 0.5 }}
                variant="outlined"
                color={selectedEnd?.id === point.id ? 'secondary' : 'default'}
              />
            ))}
          </Box>
        </ListItem>

        {/* Кнопка построения маршрута */}
        <ListItem>
          <Button
            fullWidth
            variant="contained"
            startIcon={<RouteIcon />}
            onClick={handleBuildRoute}
            disabled={!selectedStart || !selectedEnd || loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              bgcolor: 'primary.main',
              '&:hover': { bgcolor: 'primary.dark' }
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: 'white' }} />
            ) : (
              'Построить маршрут'
            )}
          </Button>
        </ListItem>

        {/* Список точек маршрута */}
        {route.length > 0 && (
          <ListItem sx={{ mt: 3, flexDirection: 'column', alignItems: 'start' }}>
            <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 500 }}>
              Маршрут содержит {route.length} точек:
            </Typography>
            <Box width="100%" sx={{ maxHeight: 300, overflow: 'auto' }}>
              {route.map((point, index) => (
                <Box
                  key={point.id}
                  sx={{
                    p: 1.5,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: 'action.hover',
                    display: 'flex',
                    alignItems: 'center'
                  }}
                >
                  <PlaceIcon color="action" sx={{ mr: 1.5 }} />
                  <Box>
                    <Typography variant="body1">
                      {index + 1}. {point.name}
                    </Typography>
                    {point.metadata.description && (
                      <Typography variant="body2" color="text.secondary">
                        {point.metadata.description}
                      </Typography>
                    )}
                  </Box>
                </Box>
              ))}
            </Box>
          </ListItem>
        )}
      </List>
    </Container>
  );
};