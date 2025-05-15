import { useState, useEffect } from 'react';
import { mockPoints } from './mockPoints';
import { Point } from '../../types/points';

interface PointsResponse {
  points: Point[];
}

export const usePoints = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPoints = async () => {
      setLoading(true);
      setError(null);
      try {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        const response: PointsResponse = { points: mockPoints };
        setPoints(response.points);
      } catch (e) {
        setError('Failed to load points');
      } finally {
        setLoading(false);
      }
    };

    fetchPoints();
  }, []);

  return { points, loading, error };
};