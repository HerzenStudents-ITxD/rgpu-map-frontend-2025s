import React from 'react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import SchoolIcon from '@mui/icons-material/School';
import PeopleIcon from '@mui/icons-material/People';
import PublicIcon from '@mui/icons-material/Public';
import MapIcon from '@mui/icons-material/Map';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';

const RightBar: React.FC = () => {
  const { t } = useTranslation();

  const handleAction = (action: string) => {
    console.log(`Action: ${action}`);
  };

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 0,
        top: 0,
        bottom: 0,
        width: '60px',
        backgroundColor: 'background.paper',
        boxShadow: '-2px 0 5px rgba(0,0,0,0.1)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '10px 0',
        zIndex: 1000,
      }}
    >
      <Tooltip title={t('rightBar.lectureBoard')}>
        <IconButton onClick={() => handleAction('Lecture Board')}>
          <SchoolIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('rightBar.teachers')}>
        <IconButton onClick={() => handleAction('Teachers')}>
          <PeopleIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('rightBar.planets')}>
        <IconButton onClick={() => handleAction('Planets')}>
          <PublicIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('rightBar.coordinates')}>
        <IconButton onClick={() => handleAction('Coordinates')}>
          <MapIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={t('rightBar.library')}>
        <IconButton onClick={() => handleAction('Library')}>
          <LibraryBooksIcon />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default RightBar;