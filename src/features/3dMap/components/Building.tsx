// src/features/3dMap/components/Building.tsx
import { useGLTF } from '@react-three/drei';
import type { GLTF } from 'three-stdlib';
import { Building } from '../api/types';

interface BuildingProps {
  building: Building;
  onClick?: () => void;
}

export const Model = ({ building, onClick }: BuildingProps) => {
  const { scene } = useGLTF(building.model) as GLTF;

  return (
    <primitive 
      object={scene} 
      position={building.position}
      onClick={onClick}
      userData={{ interactive: building.metadata.isInteractive }}
    />
  );
};