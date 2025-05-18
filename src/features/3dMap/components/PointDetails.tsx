import { useParams } from 'react-router-dom';
import { useMapStore } from './mapSlice';

const PointDetails = () => {
  const { id } = useParams<{ id: string }>();
const { points } = useMapStore();

  // Поиск по строковому ID без преобразования
  const point = id ? points[id] : undefined;

  if (!point) {
    return <div className="point-details">Точка не найдена</div>;
  }

  return (
    <div className="point-details">
      <h2>{point.name}</h2>
      
      {/* Общая информация */}
      <p>Тип: {point.type}</p>
      <p>Позиция: {point.position.join(', ')}</p>

      {/* Метаданные точки */}
      {point.metadata.description && (
        <p>Описание: {point.metadata.description}</p>
      )}
      
      {point.metadata.fact && (
        <p>Интересный факт: {point.metadata.fact}</p>
      )}

      {point.metadata.labels?.length && (
        <div>
          Метки: 
          <ul>
            {point.metadata.labels.map((label, index) => (
              <li key={index}>{label}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default PointDetails;