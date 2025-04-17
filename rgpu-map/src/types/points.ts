// src/types/points.ts
export interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  type: number;
  metadata?: {
    name?: string;
    description?: string;
  };
}