import React, { useEffect, ReactNode } from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router, Routes, Route, useParams, useNavigate, Navigate } from 'react-router-dom';
import { useSearchParams } from 'react-router-dom';

import Navbar from './components/Navbar';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import RightBar from './components/RightBar';

import { MapPage } from './features/3dMap/components/MapPage';
import LanguageSelectorPage from './pages/LanguageSelectorPage'; // Добавлен импорт
import LoginPage from './pages/LoginPage'; // Добавлен импорт

import { CustomThemeProvider } from './theme';
import { useMapStore } from './features/3dMap/components/Map/mapSlice';

import './i18n';
import './index.css';

import AgentsAdmin from './features/admin/Agents/AgentsAdmin';
import CommunitiesAdmin from './features/admin/Communities/CommunitiesAdmin';
import AdminPanel from './pages/AdminPanel';
import PointsAdmin from './features/admin/Points/PointsPage';
import UsersAdmin from './features/admin/Users/UsersAdmin';
import FeedbackAdmin from './features/admin/Feedback/FeedbackAdmin';
import FeedbackTypesAdmin from './features/admin/Feedback/FeedbackTypesAdmin';

import PointDetails from './features/3dMap/components/Point/PointDetails';
import BuildingDetails from './features/3dMap/components/Building/BuildingDetails';

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
        {/* Страница выбора языка */}
        <Route path="/language-selector" element={<LanguageSelectorPage />} />

        {/* Страница логина */}
        <Route path="/login" element={<LoginPage />} />

        {/* Маршруты админ-панели */}
        <Route path="/admin" element={<AdminPanel />}>
          <Route index element={<Navigate to="points" replace />} />
          <Route path="points" element={<PointsAdmin />} />
          <Route path="users" element={<UsersAdmin />} />
          <Route path="feedback" element={<FeedbackAdmin />} />
          <Route path="feedback-types" element={<FeedbackTypesAdmin />} />
          <Route path="communities" element={<CommunitiesAdmin />} />
          <Route path="agents" element={<AgentsAdmin />} />
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
            currentView={currentView} children={undefined}          />
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
  onViewChange, 
  currentView 
}: MainLayoutProps) => (
  <div className="main-layout">
    <TopBar />
    {/* <RightBar /> */}
    <MapPage />
    <Sidebar />
    <Navbar 
      onViewChange={onViewChange} 
      currentView={currentView} 
    />
  </div>
);

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(
  <React.StrictMode>
    <Router basename="/herzen-map">
      <App />
    </Router>
  </React.StrictMode>
);
