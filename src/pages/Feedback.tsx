import React from 'react';
import { Container, Typography, Box, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useTranslation } from 'react-i18next';

interface FeedbackProps {
  onBack: () => void;
}

const Feedback: React.FC<FeedbackProps> = ({ onBack }) => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="sm" sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <IconButton onClick={onBack}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" sx={{ ml: 1 }}>
          {t('settings.feedback')}
        </Typography>
      </Box>
      <Typography variant="body1">
        Feedback form will be implemented here.
      </Typography>
    </Container>
  );
};

export default Feedback;