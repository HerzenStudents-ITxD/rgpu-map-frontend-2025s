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
            main: themeMode === 'light' ? '#3f51b5' : '#90caf9',
            contrastText: '#ffffff',
          },
          secondary: {
            main: themeMode === 'light' ? '#f50057' : '#ff4081',
          },
          background: {
            default: themeMode === 'light' ? '#f5f5f5' : '#121212',
            paper: themeMode === 'light' ? '#ffffff' : '#1e1e1e',
          },
          text: {
            primary: themeMode === 'light' ? '#212121' : '#e0e0e0',
            secondary: themeMode === 'light' ? '#757575' : '#b0b0b0',
          },
        },
        typography: {
          fontFamily: themeMode === 'light'
            ? '"Roboto", "Helvetica", "Arial", sans-serif'
            : '"Inter", "Helvetica", "Arial", sans-serif', // Разные шрифты для тем
          h5: {
            fontWeight: themeMode === 'light' ? 600 : 500,
            color: themeMode === 'light' ? '#212121' : '#e0e0e0',
          },
          body1: {
            color: themeMode === 'light' ? '#212121' : '#e0e0e0',
          },
          body2: {
            color: themeMode === 'light' ? '#757575' : '#b0b0b0',
          },
        },
        components: {
          MuiButton: {
            styleOverrides: {
              root: {
                textTransform: 'none',
                borderRadius: 8,
              },
            },
          },
          MuiListItemButton: {
            styleOverrides: {
              root: {
                borderRadius: 8,
                '&:hover': {
                  backgroundColor: themeMode === 'light' ? '#e8eaf6' : '#2c2c2c',
                },
              },
            },
          },
          MuiTypography: {
            styleOverrides: {
              root: {
                color: themeMode === 'light' ? '#212121' : '#e0e0e0', // Цвет текста по умолчанию
              },
              h5: {
                fontWeight: themeMode === 'light' ? 600 : 500,
              },
              body1: {
                color: themeMode === 'light' ? '#212121' : '#e0e0e0',
              },
              body2: {
                color: themeMode === 'light' ? '#757575' : '#b0b0b0',
              },
            },
          },
          MuiListItemText: {
            styleOverrides: {
              primary: {
                color: themeMode === 'light' ? '#212121' : '#e0e0e0',
                fontWeight: themeMode === 'light' ? 500 : 400,
              },
              secondary: {
                color: themeMode === 'light' ? '#757575' : '#b0b0b0',
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