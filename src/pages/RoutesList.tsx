import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import DirectionsIcon from '@mui/icons-material/Directions';

const routesData = [
  { name: 'Мое местоположение', location: 'Аудитория 366' },
  { name: 'Аудитория 366', location: 'Аудитория 366' },
  { name: 'Аудитория 366', location: 'Аудитория 366' },
  { name: 'Аудитория 366', location: 'Аудитория 366' },
];

const RoutesList: React.FC = () => {
  const { t } = useTranslation();

  const handleBuildRoute = (location: string) => {
    console.log(`Building route to: ${location}`);
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('routes.title')}
      </Typography>
      <List>
        {routesData.map((route, index) => (
          <ListItem
            key={index}
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <ListItemText primary={route.name} secondary={route.location} />
            <IconButton onClick={() => handleBuildRoute(route.location)}>
              <DirectionsIcon />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default RoutesList;