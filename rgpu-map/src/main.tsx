import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Routes, Route, BrowserRouter, Router, Navigate } from 'react-router-dom';
import theme from './theme';
import Settings from './pages/Settings';
import './i18n';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import News from './pages/News';
import RoutesList from './pages/RoutesList';
import RouteBuilder from './pages/RouteBuilder';
import Schedule from './pages/Schedule';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/home" replace />} />
            <Route path="/home" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/routes" element={<RoutesList />} />
            <Route path="/route-builder" element={<RouteBuilder />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
          <Navbar />
        </BrowserRouter>
    </ThemeProvider>
  </React.StrictMode>,
);