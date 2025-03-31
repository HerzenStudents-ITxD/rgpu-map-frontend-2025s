interface Point {
    point_id: string;
    user_id: string;
    x: number;
    y: number;
    z: number;
    media?: string; // Для будущей интеграции с МЕДИА_ТОЧКИ
    connections?: string[]; // Для будущей интеграции с СВЯЗИ_ТОЧЕК
  }
  
  // Имитация данных для GET запроса
  const mockPoints: Point[] = [
    {
      point_id: "point1",
      user_id: "user1",
      x: 1,
      y: 1,
      z: 1,
    },
    {
      point_id: "point2",
      user_id: "user1",
      x: -1,
      y: -1,
      z: 1,
    },
    {
      point_id: "point3",
      user_id: "user2",
      x: 2,
      y: -2,
      z: 0,
    },
  ];
  
  // Функция для имитации GET запроса с задержкой
  export const fetchPoints = async () => {
    try {
      // Имитация задержки в 1 секунду
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return { points: mockPoints };
    } catch (e) {
      console.error(e);
      return { points: [] };
    }
  };
  
  // Функция для имитации POST запроса с задержкой (добавление новой точки)
  export const createPoint = async (point: Omit<Point, 'point_id'>) => {
    try {
      // Имитация задержки в 1 секунду
      await new Promise((resolve) => setTimeout(resolve, 1000));
  
      const newPoint: Point = {
        point_id: `point${mockPoints.length + 1}`,
        user_id: point.user_id,
        x: point.x,
        y: point.y,
        z: point.z,
      };
  
      mockPoints.push(newPoint);
      return newPoint.point_id;
    } catch (e) {
      console.error(e);
      return null;
    }
  };