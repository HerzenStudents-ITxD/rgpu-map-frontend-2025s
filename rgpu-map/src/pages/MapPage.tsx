import { useEffect } from 'react';
import { Map } from '../features/3dMap/components/Map';
import { useMapActions } from '../store/slices/mapSlice';
import { mockBuildings } from '../features/3dMap/api/mockBuildings';
import { useNavigate } from 'react-router-dom';

export const MapPage = () => {
  const { addBuilding, selectBuilding } = useMapActions();
  const navigate = useNavigate();

  useEffect(() => {
    mockBuildings.forEach(building => {
      addBuilding(building);
    });
  }, [addBuilding]);

  const handleBuildingClick = (id: number) => {
    selectBuilding(id);
    navigate(`/point/${id}`);
  };

  return (
    <div className="map-container" style={{ width: '100vw', height: '100vh' }}>
      <Map onBuildingClick={handleBuildingClick} />
    </div>
  );
};