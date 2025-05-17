// src/features/3dMap/components/Map.tsx
import { Canvas } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import { Model } from './Building';
import { useBuildings, useMapActions } from '../../../store/slices/mapSlice';
import { useGLTF } from '@react-three/drei';
import { Outlines} from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import { MapPoint3D } from '../api/types';


interface MapProps {
  onBuildingClick?: (buildingId: number) => void;
  onPointClick?: (buildingId: number) => void;
}

const UniversityModel = () => {
  const { scene } = useGLTF(`${import.meta.env.BASE_URL}models/main-campus.glb`) as GLTF;
  return (
    <group>
      <primitive 
        object={scene} 
        position={[0, 0, 0]}
        castShadow
        receiveShadow
      />
    </group>
  );
};



export const Map = ({ onBuildingClick }: MapProps) => {
  const buildings = useBuildings();
  const { selectItem  } = useMapActions();
  const navigate = useNavigate();

  const handleBuildingClick = (id: number) => {
    selectItem(id); // Правильный вызов
    onBuildingClick?.(id);
  };
  return (
    <Canvas shadows ={{ type: THREE.PCFSoftShadowMap }}>
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
          key={building.id}
          building={building}
          onClick={() => handleBuildingClick(building.id)}
        />
      ))}
      

      <OrbitControls enableZoom={true} />
      <UniversityModel />
    </Canvas>
  );
};