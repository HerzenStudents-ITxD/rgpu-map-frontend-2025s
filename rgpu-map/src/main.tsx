import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate } from 'react-router-dom';
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
import { usePoints } from './modules/map/usePoints';
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

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'language' | 'profile' | 'feedback';

const App: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [currentView, setCurrentView] = useState<View>('home'); // Состояние для текущей сущности
  const { points } = usePoints();
  const navigate = useNavigate();
  const { pointIndex } = useParams<{ pointIndex?: string }>();

  // При загрузке страницы проверяем URL и выбираем точку, если есть pointIndex
  useEffect(() => {
    if (pointIndex && points.length > 0) {
      const index = parseInt(pointIndex, 10);
      if (!isNaN(index) && index >= 0 && index < points.length) {
        setSelectedPoint(points[index]);
      } else {
        setSelectedPoint(null);
        navigate('/'); // Если индекс некорректен, перенаправляем на главную
      }
    } else {
      setSelectedPoint(null);
    }
  }, [pointIndex, points, navigate]);

  const handlePointClick = (point: Point) => {
    const index = points.findIndex((p) => p.point_id === point.point_id);
    if (index !== -1) {
      setSelectedPoint(point);
      navigate(`/point/${index}`); // Обновляем URL с индексом точки
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  // Компонент для отображения текущей сущности
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'news':
        return <News />;
      case 'routes':
        return <RoutesList />;
      case 'route-builder':
        return <RouteBuilder />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings onViewChange={(view) => setCurrentView(view)} />;
      case 'language':
        return <LanguageSelector />;
      case 'profile':
        return <Profile />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Home />;
    }
  };

  return (
    <CustomThemeProvider>
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
        <div style={{ flex: 1, position: 'relative' }}>
          <TopBar />
          <RightBar />
          <Map onPointClick={handlePointClick} />
          <Sidebar selectedPoint={selectedPoint}>
            {renderView()}
          </Sidebar>
        </div>
        <Navbar onViewChange={handleViewChange} currentView={currentView} />
      </div>
    </CustomThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/point/:pointIndex" element={<App />} />
      </Routes>
    </Router>
  </React.StrictMode>
);