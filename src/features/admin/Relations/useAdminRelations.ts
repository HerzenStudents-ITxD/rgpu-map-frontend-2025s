// hooks/useAdminRelations.ts
import { useState, useEffect } from 'react';
import { Api, PointInfo, CreateRelationRequest } from '../../real_api/MapServiceApi';

const mapApi = new Api();

export const useAdminRelations = () => {
  const [allPoints, setAllPoints] = useState<PointInfo[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PointInfo | null>(null);
  const [relations, setRelations] = useState<PointInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Загрузка всех точек
  const loadAllPoints = async () => {
    try {
      const response = await mapApi.point.findList();
      setAllPoints(response.data?.body || []);
    } catch (e) {
      setError('Ошибка загрузки точек');
    }
  };

  // Загрузка связанных точек
  const loadRelations = async (pointId: string) => {
    setLoading(true);
    try {
        const locale = 'ru'
      const response = await mapApi.route.availableList({ pointId, locale });
      setRelations(response.data?.body || []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка загрузки связей');
    } finally {
      setLoading(false);
    }
  };

  // Создание связи
  const createRelation = async (targetPointId: string) => {
    if (!selectedPoint?.id) return;

    setLoading(true);
    try {
      await mapApi.route.createCreate({
        firstPointId: selectedPoint.id,
        secondPointId: targetPointId
      });
      await loadRelations(selectedPoint.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка создания связи');
    } finally {
      setLoading(false);
    }
  };

  // Удаление связи
  const deleteRelation = async (relationId: string) => {
    setLoading(true);
    try {
      await mapApi.route.routeDelete(relationId);
      if (selectedPoint) await loadRelations(selectedPoint.id);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ошибка удаления связи');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAllPoints();
  }, []);

  useEffect(() => {
    if (selectedPoint?.id) {
      loadRelations(selectedPoint.id);
    }
  }, [selectedPoint]);

  return {
    allPoints,
    relations,
    loading,
    error,
    selectedPoint,
    setSelectedPoint,
    searchQuery,
    setSearchQuery,
    createRelation,
    deleteRelation,
    setError
  };
};