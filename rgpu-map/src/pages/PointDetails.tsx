import { useParams } from 'react-router-dom';
import { useMapStore } from '../store/slices/mapSlice';
import { Point } from '../types/points'; // Добавляем импорт типа

interface PointDetailsProps {
  point?: Point;
}

const PointDetails: React.FC<PointDetailsProps> = ({ point }) => {
  const { id } = useParams();
  const { buildings, points } = useMapStore();
  
  const item = buildings.find(b => b.id === Number(id)) || 
              points.find(p => p.point_id === id);

  return (
    <div className="point-details">
      {item && 'name' in item ? (
        <>
          <h2>{item.name}</h2>
          <p>Этажность: {item.metadata.floors}</p>
        </>
      ) : (
        <>
          <h2>Точка {id}</h2>
          <p>Координаты: ({item?.x}, {item?.y}, {item?.z})</p>
        </>
      )}
    </div>
  );
};

export default PointDetails;