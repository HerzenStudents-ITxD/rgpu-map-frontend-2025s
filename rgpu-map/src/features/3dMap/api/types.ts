// src/features/3dMap/api/types.ts
export interface Building {
  id: number;
  name: string;
  position: [number, number, number];
  model: string;
  metadata: {
    floors?: number;
    isInteractive: boolean;
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
  
  export interface Building {
    id: number;
    name: string;
    position: [number, number, number];
    model: string;
    metadata: {
      floors?: number;
      isInteractive: boolean;
    };
  }

