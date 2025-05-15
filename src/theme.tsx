// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

// Типы для контекста темы
interface ThemeContextType {
  themeMode: PaletteMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Хук для использования темы
export const useThemeContext = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a CustomThemeProvider');
  }
  return context;
};

interface CustomThemeProviderProps {
  children: ReactNode;
}

// Провайдер темы
export const CustomThemeProvider: React.FC<CustomThemeProviderProps> = ({ children }) => {
  // Инициализация темы из localStorage или системных настроек
  const [themeMode, setThemeMode] = useState<PaletteMode>(() => {
    const savedTheme = localStorage.getItem('themeMode');
    if (savedTheme) return savedTheme as PaletteMode;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  // Сохранение темы в localStorage при изменении
  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
  }, [themeMode]);

  // Переключение темы
  const toggleTheme = () => {
    setThemeMode((prevMode) => (prevMode === 'light' ? 'dark' : 'light'));
  };

  // Создание темы с кастомными цветами и стилями текста
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: themeMode,
          primary: {
            main: themeMode === 'light' ? '#3f51b5' : '#FAAE5B',
            contrastText: '#ffffff',
          },
          secondary: {
            main: themeMode === 'light' ? '#f50057' : '#FAAE5B',
          },
          background: {
            default: themeMode === 'light' ? '#f5f5f5' : '#252525',
            paper: themeMode === 'light' ? '#ffffff' : '#252525',
          },
          text: {
            primary: themeMode === 'light' ? '#212121' : '#FFE7C6',
            secondary: themeMode === 'light' ? '#757575' : '#6E6B62',
          },
          icon: {
            main: themeMode === 'light' ? '#212121' : '#FAAE5B',
          },
        },
        typography: {
          fontFamily: themeMode === 'light'
            ? '"Roboto", "Helvetica", "Arial", sans-serif'
            : '"Inter", "Helvetica", "Arial", sans-serif',
          h5: {
            fontWeight: themeMode === 'light' ? 600 : 500,
            color: themeMode === 'light' ? '#212121' : '#FFE7C6',
          },
          body1: {
            color: themeMode === 'light' ? '#212121' : '#FFE7C6',
          },
          body2: {
            color: themeMode === 'light' ? '#757575' : '#6E6B62',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
                backgroundColor: themeMode === 'light' ? undefined : '#FAAE5B',
                color: themeMode === 'light' ? undefined : '#252525',
                '&:hover': {
                  backgroundColor: themeMode === 'light' ? undefined : '#FAAE5B',
                  opacity: 0.9,
                },
              },
              outlined: {
                backgroundColor: 'transparent',
                color: themeMode === 'light' ? '#212121' : '#FFE7C6',
                borderColor: themeMode === 'light' ? '#e0e0e0' : '#6E6B62',
                '&:hover': {
                  backgroundColor: themeMode === 'light' ? 'rgba(0, 0, 0, 0.04)' : 'rgba(255, 255, 255, 0.08)',
                  borderColor: themeMode === 'light' ? '#bdbdbd' : '#8A877C',
                },
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                '&:hover': {
                  backgroundColor: themeMode === 'light' ? '#e8eaf6' : '#FAAE5B',
                  color: themeMode === 'light' ? undefined : '#252525',
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                color: themeMode === 'light' ? '#212121' : '#FFE7C6',
              },
              h5: {
                fontWeight: themeMode === 'light' ? 600 : 500,
              },
              body1: {
                color: themeMode === 'light' ? '#212121' : '#FFE7C6',
              },
              body2: {
                color: themeMode === 'light' ? '#757575' : '#6E6B62',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                color: themeMode === 'light' ? '#212121' : '#FFE7C6',
                fontWeight: themeMode === 'light' ? 500 : 400,
              },
              secondary: {
                color: themeMode === 'light' ? '#757575' : '#6E6B62',
              },
            },
          },
          MuiInputLabel: {
            styleOverrides: {
              root: {
                fontSize: '1rem',
                fontWeight: 400,
                color: themeMode === 'light' ? '#212121' : '#FFE7C6',
              },
            },
          },
        },
      }),
    [themeMode]
  );

  return (
    <ThemeContext.Provider value={{ themeMode, toggleTheme }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};