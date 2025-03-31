import React, { useState } from 'react';
import { Box, IconButton } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet } from 'react-router-dom';

interface SidebarProps {
  children?: React.ReactNode; // Явно указываем, что children опциональны
}

const Sidebar: React.FC<SidebarProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
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
          {children || <Outlet />}
        </Box>
      )}
    </Box>
  );
};

export default Sidebar;