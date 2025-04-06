// src/features/3dMap/api/mockBuildings.ts
import { Building } from './types';

export const mockBuildings: Building[] = [
  {
    id: 'main-campus',
    name: 'Главный корпус',
    model: '/models/main-campus.glb',
    position: [0, 0, 0],
    metadata: {
      floors: 5,
      isInteractive: true
    }
  }
];