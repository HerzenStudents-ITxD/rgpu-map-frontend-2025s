import React from 'react';
import { Container, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import LanguageSelector from '../modules/settings/LanguageSelector';

const Settings: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>
      <Typography variant="h6" gutterBottom>
        {t('settings.language')}
      </Typography>
      <LanguageSelector />
    </Container>
  );
};

export default Settings;