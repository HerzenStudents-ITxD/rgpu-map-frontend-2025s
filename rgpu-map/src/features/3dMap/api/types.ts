// src/features/3dMap/api/types.ts
export interface Building {
    id: string;
    name: string;
    model: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    metadata?: {
      floors?: number;
      isInteractive?: boolean;
    };
  }
  
  export interface MapState {
    buildings: Building[];
    selectedBuilding: string | null;
  }
  
  export interface MapActions {
    selectBuilding: (id: string | null) => void;
    addBuilding: (building: Building) => void;
  }

  export type BuildingClickHandler = (buildingId: string) => void;