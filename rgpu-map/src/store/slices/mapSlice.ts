// src/store/slices/mapSlice.ts
import { create } from 'zustand';
import type { Building } from '../../features/3dMap/api/types';

interface MapState {
  buildings: Building[];
  selectedBuilding: string | null;
  actions: {
    selectBuilding: (id: string | null) => void;
    addBuilding: (building: Building) => void;
  };
}

export const useMapStore = create<MapState>((set) => ({
  buildings: [],
  selectedBuilding: null,
  actions: {
    selectBuilding: (id) => set({ selectedBuilding: id }),
    addBuilding: (building) => 
      set((state) => ({ buildings: [...state.buildings, building] })),
  },
}));

export const useMapActions = () => useMapStore((state) => state.actions);
export const useBuildings = () => useMapStore((state) => state.buildings);