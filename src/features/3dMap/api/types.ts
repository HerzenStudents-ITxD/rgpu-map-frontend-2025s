// Общий базовый интерфейс
interface BaseMapEntity {
  id: number;
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  metadata: {
    isInteractive: boolean;
  };
}

// Для зданий
export interface Building extends BaseMapEntity {
  type: 'building';
  model: string;
  metadata: {
    isInteractive: boolean;
    floors?: number;
  };
}

// Для 3D-точек
export interface MapPoint3D extends BaseMapEntity {
  type: 'point';
  metadata: {
    isInteractive: boolean;
    description: string;
    type_lvl: number;
  };
}
