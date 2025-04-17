// src/modules/map/usePoints.ts
import { useState, useEffect } from 'react';
import { Point } from '../../types/points';
import { v4 as uuidv4 } from 'uuid';

const STORAGE_KEY = 'university_map_points';

export const usePoints = () => {
  const [points, setPoints] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Загрузка точек из localStorage
  useEffect(() => {
    try {
      const savedPoints = localStorage.getItem(STORAGE_KEY);
      if (savedPoints) {
        setPoints(JSON.parse(savedPoints));
      }
      setLoading(false);
    } catch (err) {
      setError('Ошибка загрузки точек');
      setLoading(false);
    }
  }, []);

  // Обновление localStorage при изменении точек
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(points));
  }, [points]);

  const addPoint = async (point: Omit<Point, 'point_id'>) => {
    const newPoint: Point = {
      ...point,
      point_id: uuidv4(),
    };
    setPoints(prev => [...prev, newPoint]);
  };

  const editPoint = async (id: string, updates: Partial<Point>) => {
    setPoints(prev =>
      prev.map(p => 
        p.point_id === id ? { ...p, ...updates } : p
      )
    );
  };

  const deletePoint = async (id: string) => {
    setPoints(prev => 
      prev.filter(p => p.point_id !== id)
    );
  };

  return {
    points,
    loading,
    error,
    addPoint,
    editPoint,
    deletePoint,
  };
};