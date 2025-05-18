// src/features/3dMap/api/mockPoints.ts
import { MapPoint3D } from './types';

export const mock3DPoints: MapPoint3D[] = [
  {
    id: "Главный вход",
    name: "Главный вход",
    type: "point",
    position: [10.5, 0, 8.2],
    rotation: [0, Math.PI / 4, 0],
    metadata: {
      isInteractive: true,
      description: "Центральный вход в университетский комплекс",
    }
  },
  {
    id: "Студенческое кафе",
    name: "Студенческое кафе",
    type: "point",
    position: [-5.3, 0, 15.7],
    metadata: {
      isInteractive: true,
      description: "Кафетерий с зоной отдыха",
    }
  },
  {
    id: "Научная библиотека",
    name: "Научная библиотека",
    type: "point",
    position: [20.1, 0, -3.8],
    rotation: [0, Math.PI / 2, 0],
    metadata: {
      isInteractive: true,
      description: "Основное книгохранилище с читальными залами",
    }
  },
  {
    id: "Спортивный комплекс",
    name: "Спортивный комплекс",
    type: "point",
    position: [-15.2, 0, 12.4],
    metadata: {
      isInteractive: true,
      description: "Закрытый стадион и тренажерные залы",
    }
  }
];