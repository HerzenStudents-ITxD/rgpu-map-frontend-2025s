import { useState, useEffect } from 'react';
import { CommunityServiceApi, CreateCommunityRequest, CommunityInfo, Operation, OperationType } from '../../features/real_api/communityServiceApi';
import { getAccessToken } from '../../utils/tokenService';

const communityServiceApi = new CommunityServiceApi();

export const useAdminCommunities = () => {
  const [communities, setCommunities] = useState<CommunityInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadCommunities = async (retryCount = 3): Promise<void> => {
    if (!getAccessToken()) {
      setError('No access token available');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.getCommunity();
      if (response.data.body) {
        setCommunities(response.data.body.map(item => item.community!).filter((c): c is CommunityInfo => c !== undefined));
      } else {
        throw new Error('No communities found in response');
      }
    } catch (e: any) {
      console.error('Error loading communities:', e);
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return loadCommunities(retryCount - 1);
      }
      setError(e.message || 'Failed to load communities');
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
        throw new Error('Failed to create community');
      }
    } catch (e: any) {
      console.error('Error creating community:', e);
      setError(e.message || 'Failed to create community');
    } finally {
      setLoading(false);
    }
  };

  const editCommunity = async (communityId: string, updates: { name?: string; isHidden?: boolean; avatar?: string | null }) => {
    setLoading(true);
    setError(null);
    try {
      const operations: Operation[] = [];
      if (updates.name) operations.push({ operationType: OperationType.Replace, path: '/name', value: updates.name });
      if (updates.isHidden !== undefined) operations.push({ operationType: OperationType.Replace, path: '/isHidden', value: updates.isHidden });
      if (updates.avatar !== undefined) operations.push({ operationType: OperationType.Replace, path: '/avatar', value: updates.avatar });
      const success = await communityServiceApi.community.editPartialUpdate(operations, { communityId });
      if (success.data.body) {
        await loadCommunities();
      } else {
        throw new Error('Failed to update community');
      }
    } catch (e: any) {
      console.error('Error updating community:', e);
      setError(e.message || 'Failed to update community');
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
        throw new Error('Failed to delete community');
      }
    } catch (e: any) {
      console.error('Error deleting community:', e);
      setError(e.message || 'Failed to delete community');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return { communities, loading, error, createCommunity, editCommunity, deleteCommunity };
};