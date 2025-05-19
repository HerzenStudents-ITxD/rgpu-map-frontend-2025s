import React, { useState, useEffect } from 'react';
import { Box, TextField, IconButton, Autocomplete, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import { useMapStore } from '../features/3dMap/components/Map/mapSlice'; // Укажите правильный путь
import { MapPoint3D } from '../features/3dMap/api/types'; // Укажите правильный путь
import { useNavigate } from 'react-router-dom';

const TopBar: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { points, actions } = useMapStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState<MapPoint3D[]>([]);

  // Поиск точек при изменении текста
  useEffect(() => {
    const results = points.filter(point =>
      point.name.toLowerCase().slice(0, 5).includes(searchTerm.toLowerCase())); // Ограничиваем результаты
    setSearchResults(results);
  }, [searchTerm, points]);

  const handleLocateMe = () => {
    console.log('Locating user...');
  };

  const handlePointSelect = (point: MapPoint3D | null) => {
    if (point) {
      actions.selectItem(point.id);
      navigate(`/point/${point.id}`); // Добавляем навигацию
    }
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        top: 0,
        left: '320px',
        right: '60px',
        padding: '10px',
        backgroundColor: 'background.paper',
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <Autocomplete
          fullWidth
          options={searchResults}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <ListItem {...props} onClick={() => handlePointSelect(option)}>
              <ListItemText 
                primary={option.name} 
                secondary={`(${option.position.join(', ')})`} 
              />
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t('topBar.search')}
              variant="outlined"
              size="small"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          )}
          sx={{ flexGrow: 1 }}
        />
        
        <IconButton onClick={handleLocateMe}>
          <MyLocationIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;