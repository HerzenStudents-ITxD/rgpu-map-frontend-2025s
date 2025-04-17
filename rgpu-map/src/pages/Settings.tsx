//src/pages/Settings.tsx
import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Switch,
  CircularProgress
} from '@mui/material';
import LanguageIcon from '@mui/icons-material/Language';
import PersonIcon from '@mui/icons-material/Person';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import InfoIcon from '@mui/icons-material/Info';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../features/settings/hooks/useSettings';
import { FeedbackForm } from '../features/settings/components/FeedbackForm';
import { ProfileForm } from '../features/settings/components/ProfileForm';
import {ThemeSelector} from '../features/settings/components/ThemeSelector';

interface SettingsProps {
  onViewChange: (view: 'language' | 'profile' | 'feedback') => void;
  onThemeChange: (theme: 'light' | 'dark') => void;
}

const Settings: React.FC<SettingsProps> = ({ onViewChange, onThemeChange }) => {
  const { t } = useTranslation();
  const { settings, profile, loading, updateSettings, updateUserProfile } = useSettings();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleThemeChange = async (checked: boolean) => {
    const theme = checked ? 'dark' : 'light';
    await updateSettings({ theme });
    onThemeChange(theme);
  };

  if (loading || !settings || !profile) {
    return (
      <Container maxWidth="sm" sx={{ display: 'flex', justifyContent: 'center', pt: 4 }}>
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>
      
      <List>
        <ListItem disablePadding>
          <ListItemButton
            onClick={() => onViewChange('language')}
            sx={{ borderRadius: '8px' }}
          >
            <ListItemIcon>
              <LanguageIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('settings.changeLanguage')} 
              secondary={settings.language.toUpperCase()}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setProfileOpen(true)}
            sx={{ borderRadius: '8px' }}
          >
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText 
              primary={t('settings.profile')} 
              secondary={profile.group}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton
            onClick={() => setFeedbackOpen(true)}
            sx={{ borderRadius: '8px' }}
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
            checked={settings.theme === 'dark'}
            onChange={(e) => handleThemeChange(e.target.checked)}
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
            checked={settings.collectStats}
            onChange={(e) => updateSettings({ collectStats: e.target.checked })}
          />
        </ListItem>
      </List>

      <FeedbackForm 
        open={feedbackOpen} 
        onClose={() => setFeedbackOpen(false)} 
      />
      <ProfileForm
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onUpdate={updateUserProfile} // Передаём метод обновления
      />
    </Container>
  );
};

export default Settings;