// src/store/slices/buildingsSlice.ts
import { create } from 'zustand';
import { Building } from '../../features/3dMap/api/types';

interface BuildingsState {
  buildings: Building[];
  selectedBuilding: number | null;
  actions: {
    selectBuilding: (id: number | null) => void;
    addBuilding: (building: Building) => void;
  };
}

export const useBuildingsStore = create<BuildingsState>((set) => ({
  buildings: [],
  selectedBuilding: null,
  actions: {
    selectBuilding: (id) => set({ selectedBuilding: id }),
    addBuilding: (building) => set((state) => ({ buildings: [...state.buildings, building] })),
  },
}));