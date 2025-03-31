import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { usePoints } from '../modules/map/usePoints';

interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  media?: string;
  connections?: string[];
}

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

    // Инициализация сцены, камеры и рендера
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    rendererRef.current = renderer; // Сохраняем renderer в ref
    containerRef.current.appendChild(renderer.domElement);
    setIsMounted(true);

    // Добавление освещения
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 1, 1);
    scene.add(directionalLight);

    // Создание точек
    const pointMeshes: THREE.Mesh[] = [];
    points.forEach((point) => {
      const geometry = new THREE.SphereGeometry(0.1, 32, 32);
      const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(point.x, point.y, point.z);
      (sphere as any).pointData = point; // Сохраняем данные точки в объекте
      scene.add(sphere);
      pointMeshes.push(sphere);
    });

    // Настройка камеры
    camera.position.z = 5;

    // Настройка Raycaster для кликов
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      // Преобразуем координаты клика в нормализованные координаты
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

      // Обновляем Raycaster
      raycaster.setFromCamera(mouse, camera);

      // Проверяем пересечения с точками
      const intersects = raycaster.intersectObjects(pointMeshes);
      if (intersects.length > 0) {
        const clickedPoint = (intersects[0].object as any).pointData as Point;
        onPointClick(clickedPoint);
      }
    };

    window.addEventListener('click', onMouseClick);

    // Анимация
    const animate = () => {
      if (!isMounted) return; // Прекращаем анимацию, если компонент размонтирован
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };
    animate();

    // Обработка изменения размера окна
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Очистка при размонтировании
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