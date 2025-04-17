// src/features/3dMap/store/mapSlice.ts
import { create } from 'zustand';
import { Building, MapState, MapActions } from '../features/3dMap/api/types';

export const useMapStore = create<MapState & { actions: MapActions }>((set) => ({
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