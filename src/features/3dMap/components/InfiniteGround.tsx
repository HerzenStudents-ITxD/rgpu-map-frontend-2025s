// src/features/3dMap/components/InfiniteGround.tsx
import { useFrame, useThree } from '@react-three/fiber';
import { useRef } from 'react';
import * as THREE from 'three';

const InfiniteGround = () => {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { camera } = useThree();

  useFrame(() => {
    // Обновляем позицию плоскости вслед за камерой
    meshRef.current.position.set(
      Math.floor(camera.position.x),
      -1.1, // Фиксированная позиция по Y (ниже всех объектов)
      Math.floor(camera.position.z)
    );
  });

  return (
    <mesh 
      ref={meshRef} 
      rotation={[-Math.PI / 2, 0, 0]}
      receiveShadow
    >
      <planeGeometry args={[1000, 1000]} />
      <meshStandardMaterial 
        color="#ebffe0"
        metalness={0}
        roughness={0.8}
      />
    </mesh>
  );
};

export default InfiniteGround;