// src/features/3dMap/api/mockPoints.ts
import { MapPoint3D } from './types';

export const mock3DPoints: MapPoint3D[] = [
  {
    id: 1, // Конвертируем point_id из строки в число
    name: 'Главная аудитория',
    position: [1, 1, 1], // Используем x, y, z из исходных данных
    model: '/models/main-auditory.glb',
    metadata: {
      floors: 2,
      isInteractive: true,
      url: '/point/1',
      type: 1 // Сохраняем исходный тип
    }
  },
  {
    id: 2,
    name: 'Спортивный комплекс',
    position: [-1, -1, 1],
    model: '/models/sport-complex.glb',
    metadata: {
      isInteractive: true,
      url: '/point/2',
      type: 1
    }
  },
  {
    id: 3,
    name: 'Научная библиотека',
    position: [2, -2, 0],
    model: '/models/library.glb',
    metadata: {
      floors: 4,
      isInteractive: true,
      url: '/point/3',
      type: 1
    }
  }
];