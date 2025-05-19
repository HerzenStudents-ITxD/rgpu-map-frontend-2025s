import { Line } from '@react-three/drei';
import { useMapStore } from '../Map/mapSlice';

const RouteVisualizer = () => {
  const route = useMapStore(state => state.route);

  if (route.length < 2) return null;

  const points = route.map(point => point.position);

  return (
    <Line
      points={points}
      color="red"
      lineWidth={4}
      dashed={false}
      opacity={0.8}
    />
  );
};

export default RouteVisualizer;