// useAdminRoles.ts
import { useState, useCallback } from 'react';
import { 
  RoleInfo, 
  CreateRoleRequest, 
  RoleInfoFindResultResponse,
  RightsServiceApi
} from '../../real_api/rightsServiceApi';

const rightsService = new RightsServiceApi();

export const useAdminRoles = () => {
  const [roles, setRoles] = useState<RoleInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalCount, setTotalCount] = useState(0);

  // Fetch roles with pagination and search
  const fetchRoles = useCallback(async (
    skipCount: number = 0,
    takeCount: number = 10,
    includeDeactivated: boolean = false,
    locale: string = 'en'
  ) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rightsService.roles.findRoles({
        includedeactivated: includeDeactivated,
        locale,
        skipcount: skipCount,
        takecount: takeCount
      });
      
      if (response.data?.body) {
        setRoles(response.data.body);
        setTotalCount(response.data.totalCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch roles');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create a new role
  const createRole = useCallback(async (roleData: CreateRoleRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await rightsService.roles.createRole(roleData);
      if (response.data?.body) {
        // Refresh the role list after creation
        await fetchRoles();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create role');
    } finally {
      setLoading(false);
    }
  }, [fetchRoles]);

  // Toggle role active status
  const editRole = useCallback(async (roleId: string, isActive: boolean) => {
    setLoading(true);
    setError(null);
    try {
      await rightsService.roles.editRoleStatus({
        roleId,
        isActive
      });
      // Refresh the role list after edit
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update role status');
    } finally {
      setLoading(false);
    }
  }, [fetchRoles]);

  // Delete a role (deactivate it)
  const deleteRole = useCallback(async (roleId: string) => {
    setLoading(true);
    setError(null);
    try {
      await rightsService.roles.editRoleStatus({
        roleId,
        isActive: false
      });
      // Refresh the role list after deletion
      await fetchRoles();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete role');
    } finally {
      setLoading(false);
    }
  }, [fetchRoles]);

  return {
    roles,
    loading,
    error,
    totalCount,
    fetchRoles,
    createRole,
    editRole,
    deleteRole
  };
};