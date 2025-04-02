export interface Point {
    point_id: string;
    user_id: string;
    x: number;
    y: number;
    z: number;
    media?: string;
    connections?: string[];
  }