import React from 'react';
import { Container, Typography, Switch, List, ListItem, ListItemText, Box, IconButton } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useNavigate, Outlet } from 'react-router-dom';
import { useTheme } from '../theme';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const [collectStats, setCollectStats] = React.useState<boolean>(() => {
    const saved = localStorage.getItem('collectStats');
    return saved ? JSON.parse(saved) : false;
  });

  React.useEffect(() => {
    localStorage.setItem('collectStats', JSON.stringify(collectStats));
  }, [collectStats]);

  const handleStatsToggle = () => {
    setCollectStats(!collectStats);
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
        <IconButton onClick={() => navigate(-1)} sx={{ marginRight: '10px' }}>
          <ArrowBackIcon />
        </IconButton>
        {t('settings.title')}
      </Typography>

      {/* Если это подстраница (например, /settings/language), рендерим Outlet */}
      <Outlet />

      {/* Основной список настроек */}
      {!window.location.pathname.includes('language') &&
        !window.location.pathname.includes('profile') &&
        !window.location.pathname.includes('feedback') && (
          <List>
            {/* Профиль */}
            <ListItem
              component="button"
              onClick={() => navigate('/settings/profile')}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText primary={t('settings.profile')} />
              <ArrowForwardIcon />
            </ListItem>

            {/* Темная тема */}
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText primary={t('settings.darkMode')} />
              <Switch checked={darkMode} onChange={toggleDarkMode} />
            </ListItem>

            {/* Сменить язык */}
            <ListItem
              component="button"
              onClick={() => navigate('/settings/language')}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText primary={t('settings.changeLanguage')} />
              <ArrowForwardIcon />
            </ListItem>

            {/* Обратная связь */}
            <ListItem
              component="button"
              onClick={() => navigate('/settings/feedback')}
              sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <ListItemText primary={t('settings.feedback')} />
              <ArrowForwardIcon />
            </ListItem>

            {/* Сбор статистики */}
            <ListItem sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <ListItemText
                primary={t('settings.collectStats')}
                secondary={t('settings.collectStatsInfo')}
              />
              <Switch checked={collectStats} onChange={handleStatsToggle} />
            </ListItem>
          </List>
        )}
    </Container>
  );
};

export default Settings;