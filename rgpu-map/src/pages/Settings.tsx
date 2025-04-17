import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Switch } from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
<<<<<<< Updated upstream
=======
import { useSettings } from '../features/settings/hooks/useSettings';
import { FeedbackForm } from '../features/settings/components/FeedbackForm';
import { ProfileForm } from '../features/settings/components/ProfileForm';
import {ThemeSelector} from '../features/settings/components/ThemeSelector';
>>>>>>> Stashed changes

interface SettingsProps {
  onViewChange: (view: 'language' | 'profile' | 'feedback') => void;
}

const Settings: React.FC<SettingsProps> = ({ onViewChange }) => {
  const { t } = useTranslation();
  const [darkMode, setDarkMode] = useState(false);
  const [collectStats, setCollectStats] = useState(false);

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => onViewChange('language')}
            sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText primary={t('settings.changeLanguage')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => onViewChange('profile')}
            sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary={t('settings.profile')} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => onViewChange('feedback')}
            sx={{ borderRadius: '8px', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.04)' } }}
          >
            <ListItemIcon>
              <FeedbackIcon />
            </ListItemIcon>
            <ListItemText primary={t('settings.feedback')} />
          </ListItemButton>
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <DarkModeIcon />
          </ListItemIcon>
          <ListItemText primary={t('settings.darkMode')} />
          <Switch
            checked={darkMode}
            onChange={(e) => setDarkMode(e.target.checked)}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <InfoIcon />
          </ListItemIcon>
          <ListItemText
            primary={t('settings.collectStats')}
            secondary={t('settings.collectStatsInfo')}
          />
          <Switch
            checked={collectStats}
            onChange={(e) => setCollectStats(e.target.checked)}
          />
        </ListItem>
      </List>
    </Container>
  );
};

export default Settings;