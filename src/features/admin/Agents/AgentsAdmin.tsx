import { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { CommunityServiceApi, CommunityResponse } from '../../real_api/communityServiceApi';
import { Link } from 'react-router-dom';

const communityApi = new CommunityServiceApi();

const AgentsAdmin = () => {
  const { t } = useTranslation();
  const [communities, setCommunities] = useState<CommunityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCommunities = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityApi.community.getCommunity();
      if (response.data.body) {
        setCommunities(response.data.body);
      } else {
        setError(t('admin.errorFetchingCommunities') || 'Failed to fetch communities');
      }
    } catch (err: any) {
      setError(t('admin.errorFetchingCommunities') || err.message || 'Error fetching communities');
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    fetchCommunities();
  }, [fetchCommunities]);

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{t('admin.agentsManagement')}</Typography>
        <Button component={Link} to="/admin/communities" variant="contained">
          {t('admin.communitiesManagement')}
        </Button>
      </Box>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('admin.communityId')}</TableCell>
                <TableCell>{t('admin.communityName')}</TableCell>
                <TableCell>{t('admin.agents')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {communities.map((community) => (
                <TableRow key={community.community?.id || 'unknown'}>
                  <TableCell>{community.community?.id || 'N/A'}</TableCell>
                  <TableCell>{community.community?.name || 'N/A'}</TableCell>
                  <TableCell>
                    {community.agents?.length
                      ? community.agents.map((agent) => agent.userName || agent.userId || 'N/A').join(', ')
                      : t('admin.noAgents')}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default AgentsAdmin;