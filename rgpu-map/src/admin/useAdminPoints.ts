import { useState, useEffect } from 'react';
import { fetchPoints, createPoint, updatePoint } from './mockAdminData';
import { Point } from '../types/points';

interface PointsResponse {
  points: Point[];
}

export const useAdminPoints = () => {
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

  const addPoint = async (point: Omit<Point, 'point_id'>) => {
    setLoading(true);
    setError(null);
    try {
      const newPointId = await createPoint(point);
      if (newPointId) {
        await loadPoints();
      } else {
        setError('Failed to add point');
      }
    } catch (e) {
      setError('Failed to add point');
    } finally {
      setLoading(false);
    }
  };

  const editPoint = async (pointId: string, updatedPoint: Partial<Point>) => {
    setLoading(true);
    setError(null);
    try {
      const success = await updatePoint(pointId, updatedPoint);
      if (success) {
        await loadPoints();
      } else {
        setError('Failed to update point');
      }
    } catch (e) {
      setError('Failed to update point');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  return { points, loading, error, addPoint, editPoint };
};