// hooks/useAdminPoints.ts
import { useState, useEffect } from 'react';
import { 
  Api, 
  PointInfo, 
  CreatePointRequest, 
  EditPointRequest 
} from '../../real_api/MapServiceApi';

// Инициализация API клиента для работы с точками
const mapApi = new Api();

export const useAdminPoints = () => {
  // Состояния компонента
  const [points, setPoints] = useState<PointInfo[]>([]); // Список точек
  const [loading, setLoading] = useState(false); // Флаг загрузки
  const [error, setError] = useState<string | null>(null); // Ошибки операций

  const validateBase64 = (str: string | null): boolean => {
    try {
      // Если значение отсутствует или пустая строка - считаем валидным
      if (!str) return true;
      
      // Проверяем чистый Base64 (без data:image/...)
      return /^[A-Za-z0-9+/]+={0,2}$/.test(str) && btoa(atob(str)) === str;
    } catch {
      return false;
    }
  };

  const processIconData = (data: CreatePointRequest | EditPointRequest) => {
    let icon: string | null = data.icon ?? null;

    // Преобразование 'default' в null
    if (icon === 'default') icon = null;

    // Валидация только для существующих иконок
    if (icon) {
      if (icon.startsWith('data:image')) {
        const [, base64] = icon.split(',');
        if (base64 && !validateBase64(base64)) {
          throw new Error('Некорректный формат изображения');
        }
        icon = base64 || null;
      } else if (!validateBase64(icon)) {
        throw new Error('Некорректный формат изображения');
      }
    }

    return {
      ...data,
      icon,
      name: data.name || { ru: '', en: '' },
      x: data.x || 0,
      y: data.y || 0,
      z: data.z || 0
    };
  };

  const loadPoints = async () => {
    setLoading(true);
    try {

      const response = await mapApi.point.findList();
    
      setPoints(response.data?.body || []);
    } catch (e: unknown) {

      setError(e instanceof Error ? e.message : 'Ошибка загрузки точек');
    } finally {
      setLoading(false);
    }
  };


  const createPoint = async (data: CreatePointRequest) => {
    console.log('[DEBUG] Creating point with data:', data);
    setLoading(true);
    setError(null);
    try {
      const processedData = processIconData(data);
      const response = await mapApi.point.createCreate(processedData);
      console.log('[DEBUG] Processed data:', processedData);
      console.log('[DEBUG] Create response:', response);
      if (response.data?.errors?.length) {
        throw new Error(response.data.errors.join(', '));
      }
      
      await loadPoints();
    } catch (e: unknown) {
      console.error('[ERROR] Create failed:', e);
      setError(e instanceof Error ? e.message : 'Неизвестная ошибка');
    } finally {
      setLoading(false);
    }
  };  

  const updatePoint = async (pointId: string, data: EditPointRequest) => {
    setLoading(true);
    try {
      const response = await mapApi.point.editUpdate(pointId, data);


      if (response.data?.errors?.length) {
        throw new Error(response.data.errors.join(', '));
      }
      

      await loadPoints();
    } catch (e: unknown) {

      setError(e instanceof Error ? e.message : 'Ошибка обновления точки');
    } finally {
      setLoading(false);
    }
  };


  const deletePoint = async (pointId: string) => {
    setLoading(true);
    try {
      const response = await mapApi.point.pointDelete(pointId);
      
      if (response.data?.errors?.length) {
        throw new Error(response.data.errors.join(', '));
      }
      
      await loadPoints();
    } catch (e: unknown) {

      setError(e instanceof Error ? e.message : 'Ошибка удаления точки');
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    loadPoints();
  }, []);


  return { 
    points,    
    loading,     
    error,      
    setError,     
    createPoint,  
    updatePoint,  
    deletePoint  
  };
};  