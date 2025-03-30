import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, BrowserRouter, Router } from 'react-router-dom';
import theme from './theme';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element= {<App />} />
          </Routes>
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);