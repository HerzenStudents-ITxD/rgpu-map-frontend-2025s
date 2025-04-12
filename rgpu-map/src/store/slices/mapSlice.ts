// src/store/slices/mapSlice.ts
import { create } from 'zustand';
import type { MapPoint3D } from '../../features/3dMap/api/types';

interface MapState {
  buildings: MapPoint3D[];
  selectedBuilding: number | null;
  actions: {
    selectBuilding: (id: number | null) => void;
    addBuilding: (building: MapPoint3D) => void;
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
export const useSelectedBuilding = () => useMapStore((state) => state.selectedBuilding);