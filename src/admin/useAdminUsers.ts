import { useState, useEffect } from 'react';
import { fetchUsers, updateUserRole } from './mockAdminData';

interface Role {
  role_id: string;
  rools: string;
}

interface User {
  user_id: string;
  email: string;
  role_id: string;
  createdAt: string;
  createdBy: string;
}

interface UsersResponse {
  users: User[];
  roles: Role[];
}

export const useAdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const response: UsersResponse = await fetchUsers();
      setUsers(response.users);
      setRoles(response.roles);
    } catch (e) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const changeUserRole = async (userId: string, newRoleId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await updateUserRole(userId, newRoleId);
      if (success) {
        setUsers((prev) =>
          prev.map((user) =>
            user.user_id === userId ? { ...user, role_id: newRoleId, createdAt: new Date().toISOString() } : user
          )
        );
      } else {
        setError('Failed to update user role');
      }
    } catch (e) {
      setError('Failed to update user role');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  return { users, roles, loading, error, changeUserRole };
};