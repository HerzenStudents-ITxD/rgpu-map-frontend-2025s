import { useState, useEffect } from 'react';
import { fetchPoints } from './mockPoints';

interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
  media?: string;
  connections?: string[];
}

interface PointsResponse {
  points: Point[];
}

export const usePoints = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadPoints = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: PointsResponse = await fetchPoints();
      setPoints(response.points);
    } catch (e) {
      setError('Failed to load points');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  return { points, loading, error, loadPoints };
};