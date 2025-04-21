import React from 'react';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../theme';
import { loginUser } from '../features/real_api/authApi';

const LoginPage: React.FC = () => {
  const { t } = useTranslation();
  const { themeMode } = useThemeContext();
  const [loginData, setLoginData] = React.useState(''); // Изменено с email на loginData
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  const handleLogin = async () => {
    try {
      const credentials = { loginData, password }; // Изменено с email на loginData
      const result = await loginUser(credentials);
      console.log('Login successful:', result);
      // Здесь можно сохранить токены и перенаправить пользователя
    } catch (err: any) {
      const errorMessage = err.message.includes('HTTP error')
        ? err.message
        : t('login.error');
      setError(errorMessage);
    }
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
            gap: 2,
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
            {t('login.title')}
          </Typography>

          <TextField
            label={t('login.loginDataPlaceholder')} // Изменено с emailPlaceholder на loginDataPlaceholder
            value={loginData}
            onChange={(e) => setLoginData(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          <TextField
            label={t('login.passwordPlaceholder')}
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            variant="outlined"
            sx={{
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
              },
            }}
          />

          {error && (
            <Typography color="error" variant="body2">
              {error}
            </Typography>
          )}

          <Button
            variant="contained"
            onClick={handleLogin}
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
            {t('login.button')}
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default LoginPage;