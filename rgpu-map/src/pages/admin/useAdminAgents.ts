import { useState, useEffect } from 'react';
import { CommunityServiceApi } from '../../features/real_api/communityServiceApi';
import { AddAgentRequest, CommunityAgentInfo, CommunityResponseFindResultResponse } from '../../features/real_api/communityServiceApi';

const communityServiceApi = new CommunityServiceApi();

export const useAdminAgents = () => {
  const [agents, setAgents] = useState<CommunityAgentInfo[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const loadAgents = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.getCommunity();
      const allAgents = response.data.body?.flatMap(item => item.agents || []) || [];
      setAgents(allAgents);
    } catch (e) {
      setError('Failed to load agents');
    } finally {
      setLoading(false);
    }
  };

  const addAgent = async (agent: AddAgentRequest) => {
    setLoading(true);
    setError(null);
    try {
      const response = await communityServiceApi.community.addAgentCreate(agent);
      if (response.data.body) {
        await loadAgents();
      } else {
        setError('Failed to add agent');
      }
    } catch (e) {
      setError('Failed to add agent');
    } finally {
      setLoading(false);
    }
  };

  const deleteAgent = async (communityId: string, userId: string) => {
    setLoading(true);
    setError(null);
    try {
      const success = await communityServiceApi.community.removeAgentDelete({ communityId, userId });
      if (success.data.body) {
        await loadAgents();
      } else {
        setError('Failed to delete agent');
      }
    } catch (e) {
      setError('Failed to delete agent');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  return { agents, loading, error, addAgent, deleteAgent };
};