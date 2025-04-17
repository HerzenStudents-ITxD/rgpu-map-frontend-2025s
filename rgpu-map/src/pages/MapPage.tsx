import { useEffect } from 'react';
import { Map } from '../features/3dMap/components/Map';
import { useMapStore } from '../store/slices/mapSlice';
import { mockBuildings } from '../features/3dMap/api/mockBuildings';
import { mock3DPoints } from '../features/3dMap/api/mockPoints';
import { useNavigate } from 'react-router-dom';

export const MapPage = () => {
  const { actions } = useMapStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка данных
    mockBuildings.forEach(actions.addBuilding);
    mock3DPoints.forEach(actions.addPoint);
  }, []);

  const handleObjectClick = (id: number, type: 'building' | 'point') => {
    actions.selectItem(id);
    navigate(`/${type}/${id}`);
  };

  return (
    <div className="map-container">
      <Map 
        onBuildingClick={(id) => handleObjectClick(id, 'building')}
        onPointClick={(id) => handleObjectClick(id, 'point')}
      />
    </div>
  );
};