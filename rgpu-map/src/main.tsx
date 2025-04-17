//src/main.tsx
import React, { useState, useMemo, useEffect, ReactNode } from 'react';
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
  const [currentView, setCurrentView] = useState<View>('home');
  const { buildings, points, actions } = useMapStore();
  const { id } = useParams<{ id?: string }>();
  const navigate = useNavigate();

  useEffect(() => {
    if (!id) {
      actions.selectItem(null);
      return;
    }
    
    const itemId = parseInt(id, 10);
    const item = [
      ...buildings,
      ...points
    ].find(item => item.id === itemId);

    actions.selectItem(item?.id || null);
  }, [id, buildings, points]);


  const handleViewChange = (view: View) => {
    setCurrentView(view);
  };

  const renderView = (currentView: string) => {
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
      
        <Route path="/point/:id" element={
          <MainLayout 
          onViewChange={handleViewChange} 
          currentView={currentView}
        >
          <PointDetails />
        </MainLayout>
        } />
        
        <Route path="/building/:id" element={
          <MainLayout 
          onViewChange={handleViewChange} 
          currentView={currentView}
        >
          <BuildingDetails />
        </MainLayout>
        } />
        
        <Route path="/*" element={
          <MainLayout 
          onViewChange={handleViewChange} 
          currentView={currentView}
        >
          {renderView(currentView)}
        </MainLayout>
      } />
      </Routes>
    </CustomThemeProvider>
  );
};

interface MainLayoutProps {
  children: ReactNode;
  onViewChange: (view: View) => void;
  currentView: View;
}

const MainLayout = ({ 
  children, 
  onViewChange, 
  currentView 
}: MainLayoutProps) => (
  <div className="main-layout">
    <TopBar />
    <RightBar />
    <MapPage />
    <Sidebar>{children}</Sidebar>
    <Navbar 
      onViewChange={onViewChange} 
      currentView={currentView} 
    />
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