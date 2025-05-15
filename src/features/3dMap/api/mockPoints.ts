// src/features/3dMap/api/mockPoints.ts
import { MapPoint3D } from './types';

export const mock3DPoints: MapPoint3D[] = [
  {
    id: 1,
    name: "Главный вход",
    type: "point",
    position: [10.5, 0, 8.2],
    rotation: [0, Math.PI / 4, 0],
    metadata: {
      isInteractive: true,
      description: "Центральный вход в университетский комплекс",
      type_lvl: 1
    }
  },
  {
    id: 2,
    name: "Студенческое кафе",
    type: "point",
    position: [-5.3, 0, 15.7],
    metadata: {
      isInteractive: true,
      description: "Кафетерий с зоной отдыха",
      type_lvl: 2
    }
  },
  {
    id: 3,
    name: "Научная библиотека",
    type: "point",
    position: [20.1, 0, -3.8],
    rotation: [0, Math.PI / 2, 0],
    metadata: {
      isInteractive: true,
      description: "Основное книгохранилище с читальными залами",
      type_lvl: 3
    }
  },
  {
    id: 4,
    name: "Спортивный комплекс",
    type: "point",
    position: [-15.2, 0, 12.4],
    metadata: {
      isInteractive: true,
      description: "Закрытый стадион и тренажерные залы",
      type_lvl: 2
    }
  }
];