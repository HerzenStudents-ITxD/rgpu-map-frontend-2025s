import React from 'react';
import { Container, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../theme';
import { useNavigate } from 'react-router-dom';

const LanguageSelectorPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = React.useState(i18n.language);

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language);
  };

  const handleSave = () => {
    i18n.changeLanguage(selectedLanguage);
    navigate('/login'); // Перенаправляем на страницу логина после сохранения
  };

  const backgroundImage = themeMode === 'light' 
    ? 'url(/png/light-pattern.png)' 
    : 'url(/png/dark-pattern.png)';

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: backgroundImage,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            backgroundColor: 'background.paper',
            borderRadius: '16px',
            boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
          }}
        >
          {/* Флаги */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Box
              component="img"
              src="/svg/ru-flag.svg"
              alt="Russian Flag"
              sx={{
                width: 60,
                height: 40,
                cursor: 'pointer',
                border: selectedLanguage === 'ru' ? '2px solid #3f51b5' : '2px solid transparent',
                borderRadius: '4px',
              }}
              onClick={() => handleLanguageChange('ru')}
            />
            <Box
              component="img"
              src="/svg/cn-flag.svg"
              alt="Chinese Flag"
              sx={{
                width: 60,
                height: 40,
                cursor: 'pointer',
                border: selectedLanguage === 'cn' ? '2px solid #3f51b5' : '2px solid transparent',
                borderRadius: '4px',
              }}
              onClick={() => handleLanguageChange('cn')} // Заменено 'zh' на 'cn'
            />
            <Box
              component="img"
              src="/svg/uk-flag.svg"
              alt="UK Flag"
              sx={{
                width: 60,
                height: 40,
                cursor: 'pointer',
                border: selectedLanguage === 'en' ? '2px solid #3f51b5' : '2px solid transparent',
                borderRadius: '4px',
              }}
              onClick={() => handleLanguageChange('en')}
            />
          </Box>

          {/* Кнопка "Сохранить" */}
          <Button
            variant="contained"
            onClick={handleSave}
            sx={{
              width: '100%',
              borderRadius: '8px',
              textTransform: 'uppercase',
              fontWeight: 600,
              bgcolor: '#3f51b5',
              '&:hover': {
                bgcolor: '#303f9f',
              },
            }}
          >
            {t('save')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LanguageSelectorPage;