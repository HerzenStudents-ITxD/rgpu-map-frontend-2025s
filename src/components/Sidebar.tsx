import React, { useState } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Point } from '../types/points'; // Импортируем Point

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
    <Box
      sx={{
        position: 'absolute',
        left: 0,
        top: 0,
        bottom: 0,
        width: isOpen ? '300px' : '0',
        backgroundColor: 'background.paper',
        boxShadow: isOpen ? '2px 0 5px rgba(0,0,0,0.1)' : 'none',
        transition: 'width 0.3s',
        overflow: 'hidden',
        zIndex: 1000,
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', padding: '10px' }}>
        <IconButton onClick={toggleSidebar}>
          {isOpen ? <ChevronLeftIcon /> : <ChevronRightIcon />}
        </IconButton>
      </Box>
      {isOpen && (
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
      )}
    </Box>
  );
};

export default Sidebar;