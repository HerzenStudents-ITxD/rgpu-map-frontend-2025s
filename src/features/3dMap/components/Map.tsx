// src/features/3dMap/components/Map.tsx
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from './Building';
import { useBuildings, useMapActions } from './mapSlice';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { Point3D } from './Point3D';
import { useMapStore } from './mapSlice';
import InfiniteGround from './InfiniteGround';
import RouteVisualizer from './RouteBuilder/RouteVisualizer';

interface MapProps {
  onBuildingClick?: (buildingId: number) => void;
  onPointClick?: (buildingId: string) => void;
}

export const Map = ({ onBuildingClick, onPointClick}: MapProps) => {
  const buildings = useBuildings();
  const points = useMapStore(state => state.points);
  const { selectItem  } = useMapActions();
  const navigate = useNavigate();

  const handlePointClick = (id: string) => {
    selectItem(id);
    onPointClick?.(id);
  };

  const handleBuildingClick = (id: number) => {
    selectItem(id); // Правильный вызов
    onBuildingClick?.(id);
  };
  
  return (
    <Canvas shadows ={{ type: THREE.PCFSoftShadowMap }}>
    <InfiniteGround />
    <RouteVisualizer />
    <ambientLight intensity={0.5} />
    <directionalLight
        castShadow
        position={[10, 10, 5]}
        intensity={1}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
    />
      {/* Отраженный свет */}
      <hemisphereLight
        groundColor={0xffffff}
        intensity={0.2}
      />
      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} castShadow />

      {buildings.map((building) => (
        <Model
          key={`building-${building.id}`} // Добавляем префикс типа
          building={building}
          onClick={() => handleBuildingClick(building.id)}
        />
      ))}

      {points.map(point => (
        <Point3D
          key={`point-${point.id}`}
          point={point}
          onClick={() => handlePointClick(point.id)}
        />
      ))}

      <OrbitControls enableZoom={true} />
    </Canvas>
  );
};