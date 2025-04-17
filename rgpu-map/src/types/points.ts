// src/types/points.ts
export type PointType = 1 | 2 | 3;

export interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  type: PointType;
  connections?: string[];
  media?: string;
}