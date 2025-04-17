import React from 'react';
import { Box, TextField } from '@mui/material';

const RouteBuilder: React.FC = () => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        maxWidth: 400,
        margin: '0 auto',
        p: 2
      }}
    >
      <TextField
        label="Откуда?"
        variant="outlined"
        fullWidth
        InputProps={{
          type: 'search',
        }}
      />
      <TextField
        label="Куда?"
        variant="outlined"
        fullWidth
        InputProps={{
          type: 'search',
        }}
      />
    </Box>
  );
};

export default RouteBuilder;