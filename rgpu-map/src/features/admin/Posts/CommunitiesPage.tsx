import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  CircularProgress
} from '@mui/material';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';

interface Community {
  id: string;
  name: string;
  avatar?: string;
  text?: string;
}

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  
  const api = new CommunityServiceApi();

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const response = await api.community.getCommunity();
      setCommunities(response.data.body?.map(c => ({
        id: c.community?.id || '',
        name: c.community?.name || '',
        avatar: c.community?.avatar || '',
        text: c.community?.text || ''
      })) || []);
    } catch (err) {
      setError('Failed to load communities');
    } finally {
      setLoading(false);
    }
  };

  const updateCommunity = async () => {
    if (!selectedCommunity) return;
    try {
      // Отправляем только измененные поля
      const operations = [];
      if (selectedCommunity.name) operations.push({ 
        op: "replace", 
        path: "/name", 
        value: selectedCommunity.name 
      });
      if (selectedCommunity.avatar !== undefined) operations.push({ 
        op: "replace", 
        path: "/avatar", 
        value: selectedCommunity.avatar 
      });
      if (selectedCommunity.text !== undefined) operations.push({ 
        op: "replace", 
        path: "/text", 
        value: selectedCommunity.text 
      });

      await api.community.editPartialUpdate(
        operations,
        { communityId: selectedCommunity.id }
      );

      // Локальное обновление состояния
      setCommunities(prev => 
        prev.map(c => 
          c.id === selectedCommunity.id ? selectedCommunity : c
        )
      );
      
      setOpenEdit(false);
    } catch (err) {
      setError('Ошибка обновления: ' + (err as Error).message);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Communities</Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Avatar</TableCell>
            <TableCell>Description</TableCell>
            <TableCell>Actions</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {communities.map(community => (
            <TableRow key={community.id}>
              <TableCell>{community.name}</TableCell>
              <TableCell>{community.avatar || 'N/A'}</TableCell>
              <TableCell>{community.text || 'N/A'}</TableCell>
              <TableCell>
                <Button 
                  variant="outlined"
                  onClick={() => {
                    setSelectedCommunity(community);
                    setOpenEdit(true);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Community</DialogTitle>
        <DialogContent dividers>
          {selectedCommunity && (
            <Box component="form" sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Name"
                value={selectedCommunity.name}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  name: e.target.value
                })}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                label="Avatar URL"
                value={selectedCommunity.avatar || ''}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  avatar: e.target.value
                })}
                sx={{ mb: 3 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Description"
                value={selectedCommunity.text || ''}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  text: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            onClick={updateCommunity}
            variant="contained"
            color="primary"
          >
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunitiesPage;