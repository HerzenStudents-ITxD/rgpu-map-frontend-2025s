// src/store/slices/mapSlice.ts
import { create } from 'zustand';
import type { Building, MapPoint3D } from '../api/types';

interface MapState {
  buildings: Building[];
  points: MapPoint3D[];
  selectedId: number | string | null;
  actions: {
    selectItem: (id: number | string | null) => void;
    addBuilding: (building: Building) => void;
    addPoint: (point: MapPoint3D) => void;
  };
}

export const useMapStore = create<MapState>((set) => ({
  buildings: [],
  points: [],
  selectedId: null,
  actions: {
    selectItem: (id) => set({ selectedId: id }),
    addBuilding: (building) => 
      set((state) => ({ buildings: [...state.buildings, building] })),
    addPoint: (point) => 
      set((state) => ({ points: [...state.points, point] })),
  },
}));

export const useSelectedBuilding = () => 
  useMapStore((state) => {
    if (state.selectedId === null) return null;
    return state.buildings.find(b => b.id === state.selectedId);
  });

export const useMapActions = () => useMapStore((state) => state.actions);
export const useBuildings = () => useMapStore((state) => state.buildings);
