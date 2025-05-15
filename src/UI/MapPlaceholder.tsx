import React from 'react';
import { Box, Typography } from '@mui/material';

const MapPlaceholder: React.FC = () => {
  return (
    <Box
      sx={{
        width: '100%',
        height: '100%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#e0e0e0',
      }}
    >
      <Typography variant="h6" color="text.secondary">
        Map Placeholder (Three.js component will be here)
      </Typography>
    </Box>
  );
};

export default MapPlaceholder;