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
  CircularProgress,
} from '@mui/material';
import LanguageIcon from '../../public/svg/Settings-language.svg';
import ProfileIcon from '../../public/svg/Settings-profile.svg';
import FeedbackIcon from '../../public/svg/Settings-feedback.svg';
import ThemeIcon from '../../public/svg/Settings-theme.svg';
import StatsIcon from '../../public/svg/Settings-statistics.svg';
import { useTranslation } from 'react-i18next';
import { useSettings } from '../features/settings/hooks/useSettings';
import { FeedbackForm } from '../features/settings/components/FeedbackForm';
import { ProfileForm } from '../features/settings/components/ProfileForm';
import { useThemeContext } from '../theme';

interface SettingsProps {
  onViewChange: (view: 'language' | 'profile' | 'feedback') => void;
}

const Settings: React.FC<SettingsProps> = ({ onViewChange }) => {
  const { t } = useTranslation();
  const { settings, profile, loading, updateSettings, updateUserProfile } = useSettings();
  const { themeMode, toggleTheme } = useThemeContext();
  const [feedbackOpen, setFeedbackOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const handleThemeChange = () => {
    toggleTheme();
    updateSettings({ theme: themeMode === 'light' ? 'dark' : 'light' });
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
          <ListItemButton onClick={() => onViewChange('language')} sx={{ borderRadius: '8px' }}>
            <ListItemIcon>
              <img src={LanguageIcon} alt="Language" />
            </ListItemIcon>
            <ListItemText
              primary={t('settings.changeLanguage')}
              secondary={settings.language.toUpperCase()}
            />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setProfileOpen(true)} sx={{ borderRadius: '8px' }}>
            <ListItemIcon>
              <img src={ProfileIcon} alt="Profile" />
            </ListItemIcon>
            <ListItemText primary={t('settings.profile')} secondary={profile.group} />
          </ListItemButton>
        </ListItem>

        <ListItem disablePadding>
          <ListItemButton onClick={() => setFeedbackOpen(true)} sx={{ borderRadius: '8px' }}>
            <ListItemIcon>
              <img src={FeedbackIcon} alt="Feedback" />
            </ListItemIcon>
            <ListItemText primary={t('settings.feedback')} />
          </ListItemButton>
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <img src={ThemeIcon} alt="Theme" />
          </ListItemIcon>
          <ListItemText primary={t('settings.darkMode')} />
          <Switch
            checked={themeMode === 'dark'}
            onChange={handleThemeChange}
          />
        </ListItem>

        <ListItem>
          <ListItemIcon>
            <img src={StatsIcon} alt="Statistics" />
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

      <FeedbackForm open={feedbackOpen} onClose={() => setFeedbackOpen(false)} />
      <ProfileForm
        open={profileOpen}
        onClose={() => setProfileOpen(false)}
        profile={profile}
        onUpdate={updateUserProfile}
      />
    </Container>
  );
};

export default Settings;