import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Box, TextField, Button, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useThemeContext } from '../theme';
import { loginUser } from '../features/real_api/authApi';
import { setTokens, getAccessToken } from '../utils/tokenService';
import { RightsServiceApi } from '../features/real_api/rightsServiceApi';

const LoginPage: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { themeMode } = useThemeContext();
  const navigate = useNavigate();
  const [loginData, setLoginData] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);

  // Initialize the RightsServiceApi
  const rightsService = new RightsServiceApi();

  const checkAdminRights = async (token: string, locale: string = 'ru'): Promise<boolean> => {
    try {
      const apiUrl = window.location.hostname === 'localhost'
        ? `http://localhost:81/Rights/get?locale=${locale}`
        : `/herzen-map/api/rights/Rights/get?locale=${locale}`;

      const response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Token': token,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 403) return false;
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return true;
    } catch (err) {
      console.error('Error checking admin rights:', err);
      return false;
    }
  };

  const handleLogin = async () => {
    try {
      const credentials = { loginData, password };
      const result = await loginUser(credentials);
      console.log('Login successful:', result);

      // Сохраняем токены
      setTokens(result.accessToken, result.refreshToken);

      // Проверяем права администратора, используя текущую локализацию
      const isAdmin = await checkAdminRights(result.accessToken, i18n.language);

      // Перенаправляем в зависимости от прав
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/map');
      }
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
            label={t('login.loginDataPlaceholder')}
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