import { useEffect } from 'react';
import { Map } from './Map';
import { useMapStore } from './mapSlice';
import { mockBuildings } from '../api/mockBuildings';
import { useNavigate } from 'react-router-dom';
import { MapService } from '../api/mapService'; // Добавляем импорт сервиса
import { PointInfoListOperationResultResponse } from '@/features/real_api/MapServiceApi';
import { MapPoint3D } from '../api/types';

export const MapPage = () => {
  const { actions } = useMapStore();
  const navigate = useNavigate();

  useEffect(() => {
    // Загрузка зданий из моков
    mockBuildings.forEach(actions.addBuilding);
    
    // Загрузка точек с сервера
    const loadPoints = async () => {
      try {
        const response = await MapService.getPoints();
        const data = response.data as PointInfoListOperationResultResponse;
        
        if (data?.body) {
          // Фильтрация дубликатов
          const uniquePoints = data.body.filter(
            (point, index, self) =>
              self.findIndex(p => p.id === point.id) === index
          );

          uniquePoints.forEach(point => {
            const existing = useMapStore.getState().points.find(p => p.id === point.id);
            if (!existing) {
              const convertedPoint: MapPoint3D = {
                id: point.id,
                name: point.name?.ru || 'Unnamed Point',
                type: 'point',
                position: [point.x, point.y, point.z],
                metadata: {
                  isInteractive: true,
                  description: point.description?.ru || '',
                  fact: point.fact?.ru || ''
                }
              };
              actions.addPoint(convertedPoint);
            }
          });
        }
      } catch (error) {
        console.error('Error loading points:', error);
      }
    };

      loadPoints();
    }, []);

  const handleObjectClick = (id: number | string, type: 'building' | 'point') => {
    actions.selectItem(id);
    navigate(`/${type}/${id}`);
  };

  return (
    <div className="map-container">
      <Map 
        onBuildingClick={(id) => handleObjectClick(id, 'building')}
        onPointClick={(id) => handleObjectClick(id, 'point')}
      />
    </div>
  );
};