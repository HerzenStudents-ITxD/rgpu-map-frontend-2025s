import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction } from '@mui/material';
import { useTranslation } from 'react-i18next';
import HomeIcon from '@mui/icons-material/Home';
import NewsIcon from '@mui/icons-material/Article';
import MapIcon from '@mui/icons-material/Map';
import ScheduleIcon from '@mui/icons-material/Schedule';
import SettingsIcon from '@mui/icons-material/Settings';

const Navbar: React.FC = () => {
  const { t } = useTranslation();
  const [value, setValue] = useState<number>(0);

  return (
    <BottomNavigation
      value={value}
      onChange={(event, newValue: number) => setValue(newValue)}
      showLabels
    >
      <BottomNavigationAction
        label={t('navbar.home')}
        icon={<HomeIcon />}
        component={Link}
        to="/"
      />
      <BottomNavigationAction
        label={t('navbar.news')}
        icon={<NewsIcon />}
        component={Link}
        to="/news"
      />
      <BottomNavigationAction
        label={t('navbar.routes')}
        icon={<MapIcon />}
        component={Link}
        to="/routes"
      />
      <BottomNavigationAction
        label={t('navbar.schedule')}
        icon={<ScheduleIcon />}
        component={Link}
        to="/schedule"
      />
      <BottomNavigationAction
        label={t('navbar.settings')}
        icon={<SettingsIcon />}
        component={Link}
        to="/settings"
      />
    </BottomNavigation>
  );
};

export default Navbar;