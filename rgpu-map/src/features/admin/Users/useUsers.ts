import { useState, useEffect } from 'react';
import { HttpClient, ContentType } from '../../real_api/communityServiceApi';
import { getAccessToken } from '../../../utils/tokenService';
import { useTranslation } from 'react-i18next';

export interface User {
  user_id: string;
  email: string;
  role: 'guest' | 'moderator' | 'admin';
}

interface UserResponse {
  user_id: string;
  email: string;
  role: string;
}

interface UsersResponse {
  body: UserResponse[] | null;
  errors: string[];
}

class UsersApi extends HttpClient {
  constructor() {
    super({
      baseUrl: 'http://localhost:83',
      securityWorker: async () => ({
        headers: { Token: getAccessToken() || '' },
      }),
    });
  }

  getUsers = () =>
    this.request<UsersResponse, any>({
      path: '/Users/getall',
      method: 'GET',
      secure: true,
      format: 'json',
    });

  updateUserRole = (userId: string, role: User['role']) =>
    this.request<any, any>({
      path: '/Users/update-role',
      method: 'PUT',
      body: { userId, role },
      secure: true,
      type: ContentType.Json,
      format: 'json',
    });
}

export const useUsers = () => {
  const { t } = useTranslation();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const api = new UsersApi();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.getUsers();
        if (response.data.body) {
          setUsers(
            response.data.body.map((u) => ({
              user_id: u.user_id,
              email: u.email,
              role: u.role as User['role'],
            }))
          );
        } else {
          setError(t('admin.errorFetchingUsers') || 'Failed to fetch users');
        }
      } catch (err) {
        setError(t('admin.errorFetchingUsers') || 'Error fetching users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [t]);

  const changeUserRole = async (userId: string, newRole: User['role']) => {
    try {
      await api.updateUserRole(userId, newRole);
      setUsers((prev) =>
        prev.map((user) =>
          user.user_id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (err) {
      setError(t('admin.errorUpdatingRole') || 'Error updating user role');
    }
  };

  return {
    users,
    loading,
    error,
    changeUserRole,
  };
};