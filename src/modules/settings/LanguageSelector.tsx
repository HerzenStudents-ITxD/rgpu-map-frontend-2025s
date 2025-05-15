// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React from 'react';
import { Container, Typography, List, ListItem, ListItemText, IconButton, Box } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';
import FlagCard from '../../UI/FlagCard';

interface LanguageSelectorProps {
  onBack: () => void;
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({ onBack }) => {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 1 }}>
          {t('settings.language')}
        </Typography>
      </Box>
      <List>
        <ListItem onClick={() => changeLanguage('en')}>
          <FlagCard flag="uk-flag.png" />
          <ListItemText primary="English" sx={{ ml: 2 }} />
        </ListItem>
        <ListItem onClick={() => changeLanguage('ru')}>
          <FlagCard flag="ru-flag.png" />
          <ListItemText primary="Русский" sx={{ ml: 2 }} />
        </ListItem>
        <ListItem onClick={() => changeLanguage('cn')}>
          <FlagCard flag="cn-flag.png" />
          <ListItemText primary="中文" sx={{ ml: 2 }} />
        </ListItem>
      </List>
    </Container>
  );
};

export default LanguageSelector;