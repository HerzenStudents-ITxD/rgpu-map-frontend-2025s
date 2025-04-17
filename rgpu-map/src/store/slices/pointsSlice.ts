// src/store/slices/pointsSlice.ts
import { create } from 'zustand';
import { Point } from '../../types/points';

interface PointsState {
  points: Point[];
  selectedPoint: string | null;
  actions: {
    selectPoint: (id: string | null) => void;
    addPoint: (point: Point) => void;
  };
}

export const usePointsStore = create<PointsState>((set) => ({
  points: [],
  selectedPoint: null,
  actions: {
    selectPoint: (id) => set({ selectedPoint: id }),
    addPoint: (point) => set((state) => ({ points: [...state.points, point] })),
  },
}));