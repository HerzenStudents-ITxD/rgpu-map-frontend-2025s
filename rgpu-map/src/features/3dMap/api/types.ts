// src/features/3dMap/api/types.ts
export interface Building {
    id: number;
    name: string;
    model: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    metadata?: {
      floors?: number;
      isInteractive?: boolean;
      url?: string;
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

  // src/features/3dMap/api/types.ts
  
  export interface MapPoint3D {
    id: number;
    name: string;
    position: [number, number, number];
    rotation?: [number, number, number];
    model: string;
    metadata: {
      floors?: number;
      isInteractive: boolean;
      url: string;
      type: number; 
    };
  }

