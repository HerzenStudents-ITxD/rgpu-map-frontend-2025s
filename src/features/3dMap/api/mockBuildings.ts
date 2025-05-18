// src/features/3dMap/api/mockBuildings.ts
import { Building } from './types';

export const mockBuildings: Building[] = [
  {
    id: 0,
    name: 'AllCampus',
    model: '/herzen-map/models/AllCampus.glb',
    position: [0, 0, 0],
    metadata: {
      isInteractive: true
    },
    type: 'building'
  },
    {
    id: 10,
    name: 'Главный корпус',
    model: '/herzen-map/models/3CampusCasing.glb',
    position: [0, 0, 0],
    metadata: {
      floors: 4,
      isInteractive: true
    },
    type: 'building'
  },
    {
    id: 11,
    name: 'Главный корпус',
    model: '/herzen-map/models/3CampusCasing1F.glb',
    position: [0, 0, 0],
    metadata: {
      isInteractive: true
    },
    type: 'building'
  },
    {
    id: 12,
    name: 'Главный корпус',
    model: '/herzen-map/models/3CampusCasing2F.glb',
    position: [0, 0, 0],
    metadata: {
      isInteractive: true
    },
    type: 'building'
  },
    {
    id: 13,
    name: 'Главный корпус',
    model: '/herzen-map/models/3CampusCasing3F.glb',
    position: [0, 0, 0],
    metadata: {
      isInteractive: true
    },
    type: 'building'
  },
    {
    id: 14,
    name: 'Главный корпус',
    model: '/herzen-map/models/3CampusCasing4F.glb',
    position: [0, 0, 0],
    metadata: {
      isInteractive: true
    },
    type: 'building'
  }
];