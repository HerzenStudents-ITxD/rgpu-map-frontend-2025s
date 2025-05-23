// Общий базовый интерфейс
interface BaseMapEntity {
  name: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  metadata: {
    isInteractive: boolean;
  };
}

// Для зданий
export interface Building extends BaseMapEntity {
  id: number;
  type: 'building';
  model: string;
  metadata: {
    isInteractive: boolean;
    floors?: number;
  };
}

// Для 3D-точек
export interface MapPoint3D extends BaseMapEntity {
  id: string;
  type: 'point';
  metadata: {
    isInteractive: boolean;
    description?: string;
    fact?: string;
    labels?: string[];
  };
}
