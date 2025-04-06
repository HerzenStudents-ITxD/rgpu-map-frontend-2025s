// src/features/3dMap/components/Map.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from './Building';
import { useBuildings, useMapActions } from '../../../store/slices/mapSlice';

interface MapProps {
  onBuildingClick?: (buildingId: string) => void;
}

export const Map = ({ onBuildingClick }: MapProps) => {
  const buildings = useBuildings();
  const { selectBuilding } = useMapActions();

  const handleBuildingClick = (id: string) => {
    selectBuilding(id);
    onBuildingClick?.(id);
  };

  return (
    <Canvas shadows camera={{ position: [0, 10, 20], fov: 25 }}>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />
      {buildings.map((building) => (
        <Model
          key={building.id}
          building={building}
          onClick={() => handleBuildingClick(building.id)}
        />
      ))}
      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};