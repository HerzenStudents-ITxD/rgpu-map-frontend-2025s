import { Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { MapPoint3D } from '../api/types';

interface Point3DProps {
  point: MapPoint3D;
  onClick?: (id: string) => void;
}

export const Point3D = ({ point, onClick }: Point3DProps) => {
  const { camera } = useThree();
  
  const handleClick = () => {
    onClick?.(point.id); // Передаём GUID
  };

  return (
    <Sphere
      position={point.position}
      scale={1}
      onClick={handleClick}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <meshStandardMaterial 
        transparent 
        opacity={0.8}
      />
    </Sphere>
  );
};