import { useState, useEffect } from 'react';

// Используем interface вместо type для лучшей поддержки

export interface User { // Добавлен экспорт
  user_id: string;
  email: string;
  role: 'guest' | 'moderator' | 'admin';
}

export const useUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const mockUsers: User[] = [
      { user_id: '1', email: 'admin@univ.ru', role: 'admin' },
      { user_id: '2', email: 'moderator@univ.ru', role: 'moderator' }
    ];

    const timer = setTimeout(() => {
      setUsers(mockUsers);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const changeUserRole = (userId: string, newRole: User['role']) => {
    setUsers(prev => prev.map(user => 
      user.user_id === userId ? { ...user, role: newRole } : user
    ));
  };

  return { 
    users, 
    loading, 
    error, 
    changeUserRole 
  };
};