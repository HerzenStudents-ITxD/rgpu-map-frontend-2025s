import { useState, useEffect } from 'react';
import { CommunityServiceApi, CreateCommunityRequest, CommunityInfo, CommunityResponseFindResultResponse, Operation, OperationType } from '../../features/real_api/communityServiceApi';

const communityServiceApi = new CommunityServiceApi();

export const useAdminCommunities = () => {
  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCommunities = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.getCommunity();
      setCommunities(response.data.body?.map(item => item.community!).filter((c): c is CommunityInfo => c !== undefined) || []);
    } catch (e) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const createCommunity = async (community: CreateCommunityRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.createCommunity(community);
      if (response.data.body) {
        await loadCommunities();
      } else {
        setError('Failed to create community');
      }
    } catch (e) {
      setError('Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const editCommunity = async (communityId: string, updates: { name?: string; isHidden?: boolean }) => {
    setLoading(true);
    setError(null);
    try {
      const operations: Operation[] = [];
      if (updates.name) operations.push({ operationType: OperationType.Replace, path: '/name', value: updates.name });
      if (updates.isHidden !== undefined) operations.push({ operationType: OperationType.Replace, path: '/isHidden', value: updates.isHidden });
      const success = await communityServiceApi.community.editPartialUpdate(operations, { communityId });
      if (success.data.body) {
        await loadCommunities();
      } else {
        setError('Failed to update community');
      }
    } catch (e) {
      setError('Failed to update community');
    } finally {
      setLoading(false);
    }
  };

  const deleteCommunity = async (communityId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await communityServiceApi.community.softdeleteDelete({ communityId });
      if (success.data.body) {
        await loadCommunities();
      } else {
        setError('Failed to delete community');
      }
    } catch (e) {
      setError('Failed to delete community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return { communities, loading, error, createCommunity, editCommunity, deleteCommunity };
};