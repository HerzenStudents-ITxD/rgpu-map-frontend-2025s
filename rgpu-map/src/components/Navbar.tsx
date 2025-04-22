import React from 'react';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import HomeIcon from '../../public/svg/HomeIcon.svg';
import NewsIcon from '../../public/svg/NewsIcon.svg';
import RoutesIcon from '../../public/svg/RoutesIcon.svg';
import ScheduleIcon from '../../public/svg/ScheduleIcon.svg';
import SettingsIcon from '../../public/svg/SettingsIcon.svg';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'language' | 'profile' | 'feedback';

interface NavbarProps {
  onViewChange: (view: View) => void;
  currentView: View;
}

const Navbar = ({ onViewChange, currentView }: NavbarProps) => {
  const { t } = useTranslation();
  const theme = useTheme();

  const iconStyle = {
    width: 24,
    height: 24,
    // Применяем фильтр для цвета #FAAE5B в темной теме
    filter: theme.palette.mode === 'dark'
      ? 'invert(68%) sepia(85%) saturate(400%) hue-rotate(0deg) brightness(95%) contrast(90%)'
      : 'none',
  };

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
        icon={<img src={HomeIcon} alt="Home" style={iconStyle} />}
      />
      <BottomNavigationAction
        label={t('navbar.news')}
        value="news"
        icon={<img src={NewsIcon} alt="News" style={iconStyle} />}
      />
      <BottomNavigationAction
        label={t('navbar.routebuilder')}
        value="route-builder"
        icon={<img src={RoutesIcon} alt="Routes" style={iconStyle} />}
      />
      <BottomNavigationAction
        label={t('navbar.schedule')}
        value="schedule"
        icon={<img src={ScheduleIcon} alt="Schedule" style={iconStyle} />}
      />
      <BottomNavigationAction
        label={t('navbar.settings')}
        value="settings"
        icon={<img src={SettingsIcon} alt="Settings" style={iconStyle} />}
      />
    </BottomNavigation>
  );
};

export default Navbar;