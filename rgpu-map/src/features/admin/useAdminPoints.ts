// hooks/useAdminPoints.ts
import { useState, useEffect } from 'react';
import { Api, PointInfo, CreatePointRequest, EditPointRequest } from '../real_api/MapServiceApi';

const mapApi = new Api();

export const useAdminPoints = () => {
  const [points, setPoints] = useState<PointInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadPoints = async () => {
    setLoading(true);
    try {
      const response = await mapApi.point.findList({ 
        IncludeDeactivated: true,
        Page: 1,
        PageSize: 100
      });
      setPoints(response.data?.body || []);
    } catch (e) {
      setError('Ошибка загрузки точек');
    } finally {
      setLoading(false);
    }
  };

  const createPoint = async (data: CreatePointRequest) => {
    setLoading(true);
    setError(null);
    try {
        const response = await mapApi.point.createCreate(data);
        if (response.error) {
        throw new Error(response.error.errors?.join(', ') || 'Ошибка сервера');
        }
        await loadPoints();
    } catch (e) {
        setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
        setLoading(false);
    }
  };  

  const updatePoint = async (pointId: string, data: EditPointRequest) => {
    setLoading(true);
    try {
      await mapApi.point.editUpdate(pointId, data);
      await loadPoints();
    } catch (e) {
      setError('Ошибка обновления точки');
    } finally {
      setLoading(false);
    }
  };

  const deletePoint = async (pointId: string) => {
    setLoading(true);
    try {
      await mapApi.point.pointDelete(pointId);
      await loadPoints();
    } catch (e) {
      setError('Ошибка удаления точки');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPoints();
  }, []);

  return { points, loading, error, setError, createPoint, updatePoint, deletePoint };
};