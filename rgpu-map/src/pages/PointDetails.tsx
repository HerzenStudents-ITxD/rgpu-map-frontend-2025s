// src/pages/PointDetails.tsx
import { useParams } from 'react-router-dom';
import { useBuildings } from '../store/slices/mapSlice';

const PointDetails = () => {
  const { id } = useParams();
  const buildings = useBuildings();
  const point = buildings.find(b => b.id === Number(id));

  return (
    <div className="point-details">
      <h2>{point?.name}</h2>
      {point?.metadata.floors && (
        <p>Этажность: {point.metadata.floors}</p>
      )}
      {/* Дополнительная информация о точке */}
    </div>
  );
};

export default PointDetails;