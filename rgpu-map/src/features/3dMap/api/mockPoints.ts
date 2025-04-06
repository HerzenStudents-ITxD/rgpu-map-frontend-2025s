// src/features/3dMap/api/mockPoints.ts
export interface MapPoint3D {
    id: string;
    name: string;
    position: [number, number, number]; // [x, y, z]
    rotation?: [number, number, number]; // [x, y, z] в радианах
    model: string; // Путь к .glb
    metadata: {
      floors?: number;
      isInteractive: boolean;
    };
  }
  
  export const mockBuildings: MapPoint3D[] = [
    {
      id: 'main-building',
      name: 'Главный корпус',
      position: [0, 0, 0],
      model: '/models/main-campus.glb',
      metadata: { floors: 5, isInteractive: true }
    },
    // ...
  ];