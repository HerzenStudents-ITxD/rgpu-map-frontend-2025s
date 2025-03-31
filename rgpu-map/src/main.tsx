import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightBar from './components/RightBar';
import Map from './UI/Map';
import Home from './pages/Home';
import News from './pages/News';
import RoutesList from './pages/RoutesList';
import RouteBuilder from './pages/RouteBuilder';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import LanguageSelector from './modules/settings/LanguageSelector';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import { CustomThemeProvider } from './theme';
import './i18n';
import './index.css';

interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  media?: string;
  connections?: string[];
}

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

const App: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);

  const handlePointClick = (point: Point) => {
    setSelectedPoint(point);
  };

  return (
    <CustomThemeProvider>
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <div style={{ flex: 1, position: 'relative' }}>
            <TopBar />
            <RightBar />
            <Map onPointClick={handlePointClick} />
            <Sidebar selectedPoint={selectedPoint}>
              <Routes>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" element={<Home />} />
                <Route path="/news" element={<News />} />
                <Route path="/routes" element={<RoutesList />} />
                <Route path="/route-builder" element={<RouteBuilder />} />
                <Route path="/schedule" element={<Schedule />} />
                <Route path="/settings" element={<Settings />}>
                  <Route index element={<Settings />} />
                  <Route path="language" element={<LanguageSelector />} />
                  <Route path="profile" element={<Profile />} />
                  <Route path="feedback" element={<Feedback />} />
                </Route>
              </Routes>
            </Sidebar>
          </div>
          <Navbar />
        </div>
      </Router>
    </CustomThemeProvider>
  );
};

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);