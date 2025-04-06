// src/pages/MapPage.tsx
import { useEffect } from 'react';
import { Map } from '../features/3dMap/components/Map';
import { useMapActions } from '../store/slices/mapSlice';
import { mockBuildings } from '../features/3dMap/api/mockBuildings';

export const MapPage = () => {
  const { addBuilding } = useMapActions();

  useEffect(() => {
    mockBuildings.forEach(building => {
      addBuilding(building);
    });
  }, []);

  const handleBuildingClick = (buildingId: string) => {
    console.log('Selected building:', buildingId);
    // Дополнительная логика при клике
  };

  return (
    <div className="map-container" style={{ width: '100vw', height: '100vh' }}>
      <Map onBuildingClick={handleBuildingClick} />
    </div>
  );
};