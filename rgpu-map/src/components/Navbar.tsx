import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NewsIcon from '@mui/icons-material/Announcement';
import RoutesIcon from '@mui/icons-material/Map';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';
import { useTranslation } from 'react-i18next';

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'language' | 'profile' | 'feedback';

interface NavbarProps {
  onViewChange: (view: View) => void;
  currentView: View;
}

const Navbar = ({ onViewChange, currentView }: NavbarProps) => {
  const { t } = useTranslation();

  return (
    <BottomNavigation
      value={currentView}
      onChange={(_, newValue) => onViewChange(newValue)}
      showLabels
      sx={{ width: '100%', position: 'fixed', bottom: 0 }}
    >
      <BottomNavigationAction
        label={t('navbar.home')}
        value="home"
        icon={<HomeIcon />}
      />
      <BottomNavigationAction
        label={t('navbar.news')}
        value="news"
        icon={<NewsIcon />}
      />
      <BottomNavigationAction
        label={t('navbar.routebuilder')}
        value="route-builder"
        icon={<RoutesIcon />}
      />
      <BottomNavigationAction
        label={t('navbar.schedule')}
        value="schedule"
        icon={<ScheduleIcon />}
      />
      <BottomNavigationAction
        label={t('navbar.settings')}
        value="settings"
        icon={<SettingsIcon />}
      />
    </BottomNavigation>
  );
};

export default Navbar;