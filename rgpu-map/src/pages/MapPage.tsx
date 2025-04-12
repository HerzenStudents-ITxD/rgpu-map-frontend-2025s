import { useEffect } from 'react';
import { Map } from '../features/3dMap/components/Map';
import { useMapStore } from '../store/slices/mapSlice';
import { mockBuildings } from '../features/3dMap/api/mockBuildings';
import { mockPoints } from '../modules/map/mockPoints';
import { useNavigate } from 'react-router-dom';

export const MapPage = () => {
  const { addBuilding, addPoint, selectItem } = useMapStore((state) => state.actions);
  const navigate = useNavigate();

  useEffect(() => {
    mockBuildings.forEach(addBuilding);
    mockPoints.forEach(addPoint);
  }, [addBuilding, addPoint]);

  const handleBuildingClick = (id: number) => {
    selectItem(id);
    navigate(`/point/${id}`);
  };

  return (
    <div className="map-container" style={{ width: '100vw', height: '100vh' }}>
      <Map onBuildingClick={handleBuildingClick} />
    </div>
  );
};