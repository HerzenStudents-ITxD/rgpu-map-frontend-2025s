import React, { useState } from 'react';
import { Box, IconButton, Typography, List, ListItem, ListItemText } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import CloseIcon from '@mui/icons-material/Close';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Point } from '../types/points';
import './Sidebar.css';

// Импортируем компоненты для вкладок
import Home from '../pages/Home';
import { NewsPage } from '../pages/NewsPage';
import RoutesList from '../pages/RoutesList';
import RouteBuilder from '../pages/RouteBuilder';
import Schedule from '../pages/Schedule';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Feedback from '../pages/Feedback';
import LanguageSelector from '../modules/settings/LanguageSelector';

interface SidebarProps {
  selectedPoint: Point | null;
}

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'profile' | 'feedback' | 'language';

const Sidebar: React.FC<SidebarProps> = ({ selectedPoint }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [searchParams] = useSearchParams();
  const view = searchParams.get('view') as View | null;

  const toggleSidebar = () => setIsOpen(!isOpen);

  const handleClosePoint = () => navigate('/');

  /**
   * Рендерит контент в зависимости от параметра `view` в URL
   */
  const renderContentView = () => {
    switch (view) {
      case 'home':
        return <Home />;
      case 'news':
        return <NewsPage />;
      case 'routes':
        return <RoutesList />;
      case 'route-builder':
        return <RouteBuilder />;
      case 'schedule':
        return <Schedule />;
        case 'settings':
          return (
            <Settings 
              onViewChange={(view) => {
                const newParams = new URLSearchParams(searchParams);
                newParams.set('view', view);
                navigate({ search: newParams.toString() });
              }} 
              onThemeChange={(theme) => { /* Реализуйте смену темы */ }} 
            />
          );
        case 'language':
          return <LanguageSelector onBack={() => navigate({ search: 'view=settings' })} />;
        case 'profile':
          return <Profile onBack={() => navigate({ search: 'view=settings' })} />;
        case 'feedback':
          return <Feedback onBack={() => navigate({ search: 'view=settings' })} />;
      default:
        // Если view не указан, показываем детали точки или домашнюю страницу
        return selectedPoint ? null : <Home />;
    }
  };

  return (
    <>
      {/* Кнопка открытия sidebar */}
      {!isOpen && (
        <IconButton
          sx={{
            position: 'absolute',
            left: 8,
            top: 8,
            zIndex: 1200,
            backgroundColor: 'background.paper',
            boxShadow: 3,
            '&:hover': { backgroundColor: 'action.hover' }
          }}
          onClick={toggleSidebar}
        >
          <MenuIcon />
        </IconButton>
      )}

      {/* Основной контейнер sidebar */}
      <Box
        sx={{
          position: 'absolute',
          left: 0,
          top: 0,
          bottom: 0,
          width: '300px',
          backgroundColor: 'background.paper',
          boxShadow: '2px 0 5px rgba(0,0,0,0.1)',
          transition: 'transform 0.3s',
          overflowY: 'auto',
          zIndex: 1000,
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)'
        }}
      >
        {/* Заголовок и кнопки */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Box>
            {selectedPoint && (
              <IconButton onClick={handleClosePoint} size="small">
                <CloseIcon />
              </IconButton>
            )}
            <IconButton onClick={toggleSidebar} size="small">
              <ChevronLeftIcon />
            </IconButton>
          </Box>
        </Box>

        {/* Контент */}
        <Box sx={{ p: 2 }}>
          {selectedPoint && !view ? (
            // Детали точки/здания
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
          ) : (
            // Контент вкладок (home/news/routes и т.д.)
            renderContentView()
          )}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;