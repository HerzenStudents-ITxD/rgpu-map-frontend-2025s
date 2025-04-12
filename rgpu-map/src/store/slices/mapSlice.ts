// src/store/slices/mapSlice.ts
import { create } from 'zustand';
import { Building } from '../../features/3dMap/api/types';
import { Point } from '../../types/points';

interface MapState {
  buildings: Building[];
  points: Point[];
  selectedId: string | number | null;
  actions: {
    selectItem: (id: string | number | null) => void;
    addBuilding: (building: Building) => void;
    addPoint: (point: Point) => void;
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

// Экспорт хуков для удобного использования
export const useMapActions = () => useMapStore((state) => state.actions);
export const useBuildings = () => useMapStore((state) => state.buildings);
export const usePoints = () => useMapStore((state) => state.points);
export const useSelectedId = () => useMapStore((state) => state.selectedId);