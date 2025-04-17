// src/features/3dMap/components/Building.tsx
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import { MapPoint3D } from '../api/types';

interface BuildingProps {
  building: MapPoint3D;
  onClick: () => void;
}

export const Model = ({ building, onClick  }: BuildingProps) => {
  const { scene } = useGLTF(building.model) as GLTF;
  


  return (
    <primitive 
      object={scene} 
      position={building.position}
      userData={{ interactive: building.metadata.isInteractive }}
    />
  );
};