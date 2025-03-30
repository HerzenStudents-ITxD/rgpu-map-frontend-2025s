import { useState, useEffect } from 'react';

interface NewsPost {
  id: string;
  title: string;
  description: string;
  image?: string;
  hasParticipateButton?: boolean;
  routePoint?: string;
}

const mockPosts: NewsPost[] = [
  {
    id: '1',
    title: 'ТАРТУ-ФЕСТИВАЛЬ 2024',
    description: 'Новогоднее мероприятие 12 по 22 декабря 25, 26, 27, 28, 29 декабря. Можно участвовать, если тебе 20а.',
    image: 'https://via.placeholder.com/300x140',
    hasParticipateButton: true,
    routePoint: 'Аудитория 20а',
  },
  {
    id: '2',
    title: 'УЧАСТНИК СТУДЕНЧЕСКИЙ СОВЕТ ИНТО',
    description: 'Проверь свои способности в студенческом совете ИНТО!',
    hasParticipateButton: true,
  },
];

const useNewsPosts = () => {
  const [posts, setPosts] = useState<NewsPost[]>([]);

  // Имитация подгрузки с сервера
  useEffect(() => {
    setPosts(mockPosts);
  }, []);

  const addPost = (newPost: Omit<NewsPost, 'id'>) => {
    const post: NewsPost = {
      ...newPost,
      id: Date.now().toString(),
      hasParticipateButton: true, // По умолчанию добавляем кнопку "Участвую"
    };
    setPosts([post, ...posts]);
  };

  const participate = (id: string) => {
    console.log(`Participating in post with id: ${id}`);
  };

  const buildRoute = (routePoint: string) => {
    console.log(`Building route to: ${routePoint}`);
  };

  return { posts, addPost, participate, buildRoute };
};

export default useNewsPosts;