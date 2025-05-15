import React from 'react';
import { Box, TextField, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import MyLocationIcon from '@mui/icons-material/MyLocation';

const TopBar: React.FC = () => {
  const { t } = useTranslation();

  const handleLocateMe = () => {
    console.log('Locating user...');
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
        <TextField
          fullWidth
          placeholder={t('topBar.search')}
          variant="outlined"
          size="small"
        />
        <IconButton onClick={handleLocateMe}>
          <MyLocationIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default TopBar;