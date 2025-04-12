//src/main.tsx
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import { 
  BrowserRouter as Router, 
  Routes, 
  Route, 
  useParams, 
  useNavigate,
  Navigate 
} from 'react-router-dom';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightBar from './components/RightBar';
import { MapPage } from './pages/MapPage'
import Home from './pages/Home';
import { NewsPage}  from './pages/NewsPage';
import RoutesList from './pages/RoutesList';
import RouteBuilder from './pages/RouteBuilder';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import LanguageSelector from './modules/settings/LanguageSelector';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';
import { CustomThemeProvider } from './theme';
import { usePoints } from './modules/map/usePoints';
import { Point } from './types/points'; 
import './i18n';
import './index.css';
import AdminPanel from './pages/admin/AdminPanel';
import PointsAdmin from './pages/admin/PointsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';
import PointDetails from './pages/PointDetails';

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'language' | 'profile' | 'feedback';

const App: React.FC = () => {
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [currentView, setCurrentView] = useState<View>('home');
  const { points } = usePoints();
  const navigate = useNavigate();
  const { pointIndex } = useParams<{ pointIndex?: string }>();

  useEffect(() => {
    if (pointIndex && points.length > 0) {
      const index = parseInt(pointIndex, 10);
      if (!isNaN(index) && index >= 0 && index < points.length) {
        setSelectedPoint(points[index]);
      } else {
        setSelectedPoint(null);
        navigate('/');
      }
    } else {
      setSelectedPoint(null);
    }
  }, [pointIndex, points, navigate]);

  const handlePointClick = (point: Point) => {
    const index = points.findIndex((p) => p.point_id === point.point_id);
    if (index !== -1) {
      setSelectedPoint(point);
      navigate(`/point/${index}`);
    }
  };

  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home />;
      case 'news':
        return <NewsPage />;
      case 'routes':
        return <RoutesList />;
      case 'route-builder':
        return <RouteBuilder />;
      case 'schedule':
        return <Schedule />;
      case 'settings':
        return <Settings onViewChange={(view) => setCurrentView(view)} onThemeChange={function (theme: 'light' | 'dark'): void {
          throw new Error('Function not implemented.');
        } } />;
      case 'language':
        return <LanguageSelector onBack={() => setCurrentView('settings')} />;
      case 'profile':
        return <Profile onBack={() => setCurrentView('settings')} />;
      case 'feedback':
        return <Feedback onBack={() => setCurrentView('settings')} />;
      default:
        return <Home />;
    }
  };

  return (
    <CustomThemeProvider>
      <Routes>
        {/* Маршруты админ-панели */}
        <Route path="/admin" element={<AdminPanel />}>
          <Route index element={<Navigate to="points" replace />} />
          <Route path="points" element={<PointsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
        </Route>

        {/* Маршрут для деталей точки */}
        <Route 
          path="/point/:id" 
          element={
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
              <TopBar />
              <RightBar />
              <MapPage />
              <Sidebar selectedPoint={selectedPoint}>
                <PointDetails />
              </Sidebar>
              <Navbar onViewChange={handleViewChange} currentView={currentView} />
            </div>
          } 
        />
      
        <Route path="*" element={
          <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
            <div style={{ flex: 1, position: 'relative' }}>
              <TopBar />
              <RightBar />
              <MapPage />
              <Sidebar selectedPoint={selectedPoint}>
                {renderView()}
              </Sidebar>
            </div>
            <Navbar onViewChange={handleViewChange} currentView={currentView} />
          </div>
        } />
      </Routes>
    </CustomThemeProvider>
  );
};

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);