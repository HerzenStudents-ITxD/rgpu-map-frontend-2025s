import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePoints } from '../modules/map/usePoints';
import { Point } from '../types/points'; // Импортируем Point

interface MapProps {
  onPointClick: (point: Point) => void;
}

const Map: React.FC<MapProps> = ({ onPointClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const { points, loading, error } = usePoints();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (!containerRef.current) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer;
    containerRef.current.appendChild(renderer.domElement);
    setIsMounted(true);

    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    const pointMeshes: THREE.Mesh[] = [];
    points.forEach((point) => {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(point.x, point.y, point.z);
      (sphere as any).pointData = point;
      scene.add(sphere);
      pointMeshes.push(sphere);
    });

    camera.position.z = 5;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(pointMeshes);
      if (intersects.length > 0) {
        const clickedPoint = (intersects[0].object as any).pointData as Point;
        onPointClick(clickedPoint);
      }
    };

    window.addEventListener('click', onMouseClick);

    const animate = () => {
      if (!isMounted) return;
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      setIsMounted(false);
      window.removeEventListener('click', onMouseClick);
      window.removeEventListener('resize', handleResize);
      if (containerRef.current && renderer.domElement && containerRef.current.contains(renderer.domElement)) {
        containerRef.current.removeChild(renderer.domElement);
      }
      scene.clear();
      renderer.dispose();
      rendererRef.current = null;
    };
  }, [points, onPointClick, isMounted]);

  if (loading) return <div>Loading points...</div>;
  if (error) return <div>Error: {error}</div>;

  return <div ref={containerRef} style={{ width: '100%', height: '100%' }} />;
};

export default Map;