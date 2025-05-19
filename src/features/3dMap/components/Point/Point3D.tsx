import { Sphere } from '@react-three/drei';
import { useThree } from '@react-three/fiber';
import type { MapPoint3D } from '../../api/types';

interface Point3DProps {
  point: MapPoint3D;
  onClick?: (id: string) => void;
}

export const Point3D = ({ point, onClick }: Point3DProps) => {
  const { camera } = useThree();
  
  return (
    <Sphere
      position={point.position}
      scale={2}
      onClick={(e: any) => {
        e.stopPropagation(); // Предотвращаем всплытие
        onClick?.(point.id);
      }}
      onPointerOver={() => (document.body.style.cursor = 'pointer')}
      onPointerOut={() => (document.body.style.cursor = 'auto')}
    >
      <meshStandardMaterial 
        transparent 
        opacity={0.3}
      />
    </Sphere>
    
  );
};