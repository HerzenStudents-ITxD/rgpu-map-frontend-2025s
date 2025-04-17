import React from 'react';
import { Switch, FormControlLabel } from '@mui/material';
import { useTheme } from '../../../theme';

const ThemeSelector: React.FC = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <FormControlLabel
      control={<Switch checked={darkMode} onChange={toggleDarkMode} />}
      label="Тёмная тема"
    />
  );
};

export default ThemeSelector;