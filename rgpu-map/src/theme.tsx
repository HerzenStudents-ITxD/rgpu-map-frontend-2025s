import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const CustomThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    console.log('Dark mode updated:', darkMode); // Логирование для отладки
  }, [darkMode]);

  const theme = useMemo(() => {
    const createdTheme = createTheme({
      palette: {
        mode: darkMode ? 'dark' : 'light',
        primary: {
          main: '#FF9800', // Оранжевый акцент с фото
        },
        background: {
          default: darkMode ? '#212121' : '#FFFFFF', // Тёмный фон
          paper: darkMode ? '#303030' : '#FFFFFF', // Фон для карточек
        },
        text: {
          primary: darkMode ? '#FFFFFF' : '#212121', // Белый текст на тёмном фоне
          secondary: darkMode ? '#B0BEC5' : '#757575', // Серый для второстепенного текста
        },
        divider: darkMode ? '#424242' : '#BDBDBD', // Разделитель
      },
      components: {
        MuiPaper: {
          styleOverrides: {
            root: {
              backgroundColor: darkMode ? '#303030' : '#FFFFFF',
            },
          },
        },
        MuiButton: {
          styleOverrides: {
            root: {
              color: darkMode ? '#FFFFFF' : '#212121',
              '&:hover': {
                backgroundColor: darkMode ? '#FF5722' : '#E0E0E0',
              },
            },
          },
        },
        MuiSelect: {
          styleOverrides: {
            root: {
              color: darkMode ? '#FFFFFF' : '#212121',
            },
            icon: {
              color: darkMode ? '#FFFFFF' : '#212121', // Цвет иконки стрелки
            },
          },
        },
        MuiInputLabel: {
          styleOverrides: {
            root: {
              color: darkMode ? '#B0BEC5' : '#757575', // Цвет метки
            },
          },
        },
        MuiListItem: {
          styleOverrides: {
            root: {
              '&:hover': {
                backgroundColor: darkMode ? '#424242' : '#F5F5F5',
              },
            },
          },
        },
        MuiTypography: {
          styleOverrides: {
            root: {
              color: darkMode ? '#FFFFFF' : '#212121', // Цвет текста
            },
          },
        },
      },
    });
    console.log('Theme updated:', createdTheme); // Логирование для отладки
    return createdTheme;
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};