import React, { useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightBar from './components/RightBar';

import { MapPage } from './pages/MapPage';
import Home from './pages/Home';
import { NewsPage } from './pages/NewsPage';
import RoutesList from './pages/RoutesList';
import RouteBuilder from './pages/RouteBuilder';
import Schedule from './pages/Schedule';
import Settings from './pages/Settings';
import Profile from './pages/Profile';
import Feedback from './pages/Feedback';

import { CustomThemeProvider } from './theme';
import { useMapStore } from './store/slices/mapSlice';

import './i18n';
import './index.css';

import AdminPanel from './pages/admin/AdminPanel';
import PointsAdmin from './pages/admin/PointsAdmin';
import UsersAdmin from './pages/admin/UsersAdmin';

import PointDetails from './features/3dMap/components/PointDetails';
import BuildingDetails from './features/3dMap/components/BuildingDetails';

type View = 'home' | 'news' | 'routes' | 'route-builder' | 'schedule' | 'settings' | 'language' | 'profile' | 'feedback';

const App: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentView = searchParams.get('view') as View || 'home';
  const { buildings, points, actions } = useMapStore();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      actions.selectItem(null);
      return;
    }

    const itemId = parseInt(id, 10);
    const item = [...buildings, ...points].find((item) => item.id === itemId);

    actions.selectItem(item?.id || null);
  }, [id, buildings, points, actions]);

  const handleViewChange = (view: View) => {
    setSearchParams({ view });
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

        <Route
          path="/point/:id"
          element={
            <MainLayout onViewChange={handleViewChange} currentView={currentView}>
              <PointDetails />
            </MainLayout>
          }
        />

        <Route
          path="/building/:id"
          element={
            <MainLayout onViewChange={handleViewChange} currentView={currentView}>
              <BuildingDetails />
            </MainLayout>
          }
        />

        <Route
          path="/*"
          element={
            <MainLayout onViewChange={handleViewChange} currentView={currentView}>
              {currentView === 'home' && <Home />}
              {currentView === 'news' && <NewsPage />}
              {currentView === 'routes' && <RoutesList />}
              {currentView === 'route-builder' && <RouteBuilder />}
              {currentView === 'schedule' && <Schedule />}
              {currentView === 'settings' && <Settings onViewChange={handleViewChange} />}
              {currentView === 'profile' && <Profile />}
              {currentView === 'feedback' && <Feedback />}
            </MainLayout>
          }
        />
      </Routes>
    </CustomThemeProvider>
  );
};

interface MainLayoutProps {
  children?: ReactNode;
  onViewChange: (view: View) => void;
  currentView: View;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children, onViewChange, currentView }) => (
  <div className="main-layout">
    <TopBar />
    <RightBar />
    <MapPage />
    <Sidebar />
    <Navbar onViewChange={onViewChange} currentView={currentView} />
    {children}
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);