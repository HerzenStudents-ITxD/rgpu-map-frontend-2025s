// useAdminUsers.ts
import { useState, useCallback } from 'react';
import { 
  UserInfo, 
  CreateUserRequest, 
  UserInfoFindResultResponse,
  UsersServiceApi
} from '../../real_api/usersServiceApi';

const usersService = new UsersServiceApi();

export const useAdminUsers = () => {
  const [users, setUsers] = useState<UserInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch users with pagination and search
  const fetchUsers = useCallback(async (
    skipCount: number = 0,
    takeCount: number = 10,
    searchTerm: string = '',
    isActive: boolean = true
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.user.findUsers({
        isascendingsort: true,
        fullnameincludesubstring: searchTerm,
        isactive: isActive,
        ispending: false,
        includecurrentavatar: true,
        includecommunications: true,
        skipcount: skipCount,
        takecount: takeCount
      });
      
      if (response.data?.body) {
        setUsers(response.data.body);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new user
  const createUser = useCallback(async (userData: CreateUserRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await usersService.user.createUser(userData);
      if (response.data?.body) {
        // Refresh the user list after creation
        await fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create user');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Edit user information
  const editUser = useCallback(async (userId: string, updates: Partial<UserInfo>) => {
    setLoading(true);
    setError(null);
    try {
      // Prepare operations for partial update
      const operations = [];
      
      if (updates.firstName !== undefined) {
        operations.push({
          operationType: 'Replace',
          path: '/firstName',
          value: updates.firstName
        });
      }
      
      if (updates.lastName !== undefined) {
        operations.push({
          operationType: 'Replace',
          path: '/lastName',
          value: updates.lastName
        });
      }
      
      if (updates.email !== undefined) {
        operations.push({
          operationType: 'Replace',
          path: '/email',
          value: updates.email
        });
      }

      if (operations.length > 0) {
        await usersService.user.editPartialUser(operations, { userId });
        // Refresh the user list after edit
        await fetchUsers();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update user');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  // Delete (deactivate) a user
  const deleteUser = useCallback(async (userId: string) => {
    setLoading(true);
    setError(null);
    try {
      await usersService.user.editUserActive({
        userId,
        isActive: false
      });
      // Refresh the user list after deletion
      await fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete user');
    } finally {
      setLoading(false);
    }
  }, [fetchUsers]);

  return {
    users,
    loading,
    error,
    totalCount,
    fetchUsers,
    createUser,
    editUser,
    deleteUser
  };
};

export default useAdminUsers;