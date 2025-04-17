import React, { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate, useSearchParams, useLocation, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import './Sidebar.css';

// Импортируем компоненты
import Home from '../pages/Home';
import { NewsPage } from '../pages/NewsPage';
import RoutesList from '../pages/RoutesList';
import RouteBuilder from '../pages/RouteBuilder';
import Schedule from '../pages/Schedule';
import Settings from '../pages/Settings';
import Profile from '../pages/Profile';
import Feedback from '../pages/Feedback';
import LanguageSelector from '../modules/settings/LanguageSelector';
import PointDetails from '../features/3dMap/components/PointDetails';
import BuildingDetails from '../features/3dMap/components/BuildingDetails';

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'profile' | 'feedback' | 'language';

const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(true);
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { id } = useParams<{ id?: string }>();
  
  const view = searchParams.get('view') as View | null;
  const isPoint = location.pathname.startsWith('/point/');
  const isBuilding = location.pathname.startsWith('/building/');

  const toggleSidebar = () => setIsOpen(!isOpen);

  const renderContentView = () => {
    // Рендерим детали точки/здания если URL соответствует


    // Рендерим вкладки через параметр view
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
            onViewChange={(view) => navigate({ search: `view=${view}` })} 
            onThemeChange={(theme) => {/* ... */}} 
          />
        );
      case 'language':
        return <LanguageSelector onBack={() => navigate({ search: 'view=settings' })} />;
      case 'profile':
        return <Profile onBack={() => navigate({ search: 'view=settings' })} />;
      case 'feedback':
        return <Feedback onBack={() => navigate({ search: 'view=settings' })} />;
    }
    if (isPoint && id) return <PointDetails />;
    if (isBuilding && id) return <BuildingDetails />;
    return <Home />;
  };

  return (
    <>
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
        <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
          <Typography variant="h6">
            {isPoint && t('sidebar.pointDetails')}
            {isBuilding && t('sidebar.buildingDetails')}
            {view && t(`views.${view}`)}
          </Typography>
          <IconButton onClick={toggleSidebar} size="small">
            <ChevronLeftIcon />
          </IconButton>
        </Box>

        <Box sx={{ p: 2 }}>
          {renderContentView()}
        </Box>
      </Box>
    </>
  );
};

export default Sidebar;