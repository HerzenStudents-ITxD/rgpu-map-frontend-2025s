//src/components/Sidebar.tsx
import React, { useState } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Point } from '../types/points'; // Импортируем Point
import './Sidebar.css';

interface SidebarProps {
  children: React.ReactNode;
  selectedPoint: Point | null;
}

const Sidebar: React.FC<SidebarProps> = ({ children, selectedPoint }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const handleClosePoint = () => {
    navigate('/');
  };

  return (
    <>
    {/* Кнопка восстановления когда sidebar скрыт */}
    {!isOpen && (
      <IconButton
        sx={{
          position: 'absolute',
          left: 8,
          top: 8,
          zIndex: 1200,
          backgroundColor: 'background.paper',
          boxShadow: 3,
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
        onClick={toggleSidebar}
      >
        <MenuIcon />
      </IconButton>
    )}
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: '300px',
        backgroundColor: 'background.paper',
        boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
        transition: 'width 0.3s',
        overflow: 'hidden',
        zIndex: 1000,
        transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <IconButton onClick={toggleSidebar}>
          <ChevronLeftIcon />
        </IconButton>
      </Box>

      <Box sx={{ padding: '0 10px' }}>
        {selectedPoint ? (
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h6" gutterBottom>
                {t('sidebar.pointDetails')}
              </Typography>
              <IconButton onClick={handleClosePoint}>
                <CloseIcon />
              </IconButton>
            </Box>
            <List>
              <ListItem>
                <ListItemText
                  primary={t('sidebar.pointId')}
                  secondary={selectedPoint.point_id}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t('sidebar.coordinates')}
                  secondary={`X: ${selectedPoint.x}, Y: ${selectedPoint.y}, Z: ${selectedPoint.z}`}
                />
              </ListItem>
              <ListItem>
                <ListItemText
                  primary={t('sidebar.createdBy')}
                  secondary={selectedPoint.user_id}
                />
              </ListItem>
            </List>
          </Box>
        ) : (
          children
        )}
      </Box>
    </Box>
    </>
  );
};

export default Sidebar;