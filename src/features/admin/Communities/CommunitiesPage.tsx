import React, { useState, useCallback } from 'react';
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
  CircularProgress,
  Checkbox,
  FormControlLabel
} from '@mui/material';
import { CommunityInfo, CreateCommunityRequest, OperationType } from '../../real_api/communityServiceApi';

interface CommunitiesPageProps {
  communities: CommunityInfo[];
  loading: boolean;
  error: string | null;
  createCommunity: (community: CreateCommunityRequest) => Promise<void>;
  editCommunity: (communityId: string, updates: { name?: string; isHidden?: boolean; avatar?: string | null }) => Promise<void>;
  deleteCommunity: (communityId: string) => Promise<void>;
}

const CommunitiesPage: React.FC<CommunitiesPageProps> = ({ 
  communities, 
  loading, 
  error, 
  createCommunity, 
  editCommunity, 
  deleteCommunity 
}) => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<CommunityInfo | null>(null);
  const [newCommunity, setNewCommunity] = useState<CreateCommunityRequest>({ 
    name: '', 
    avatarImage: null 
  });

  const filteredCommunities = communities.filter(community => 
    community.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = useCallback(async () => {
    if (!newCommunity.name) return;
    await createCommunity(newCommunity);
    setOpenCreate(false);
    setNewCommunity({ name: '', avatarImage: null });
  }, [newCommunity, createCommunity]);

  const handleEdit = useCallback(async () => {
    if (selectedCommunity && selectedCommunity.id) {
      await editCommunity(selectedCommunity.id, { 
        name: selectedCommunity.name || undefined, 
        isHidden: selectedCommunity.isHidden,
        avatar: selectedCommunity.avatar || null
      });
      setOpenEdit(false);
      setSelectedCommunity(null);
    }
  }, [selectedCommunity, editCommunity]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Communities</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Communities"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Community
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Hidden</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredCommunities.map(community => (
              <TableRow key={community.id || 'unknown'}>
                <TableCell>{community.name || 'N/A'}</TableCell>
                <TableCell>{community.isHidden ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button onClick={() => { setSelectedCommunity(community); setOpenEdit(true); }}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => community.id && deleteCommunity(community.id)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create Community</DialogTitle>
        <DialogContent>
          <TextField
            label="Community Name"
            fullWidth
            margin="dense"
            value={newCommunity.name}
            onChange={(e) => setNewCommunity({ ...newCommunity, name: e.target.value })}
            required
          />
          <TextField
            label="Avatar (Base64)"
            fullWidth
            margin="dense"
            value={newCommunity.avatarImage || ''}
            onChange={(e) => setNewCommunity({ ...newCommunity, avatarImage: e.target.value || null })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained"
            disabled={!newCommunity.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Community</DialogTitle>
        <DialogContent>
          {selectedCommunity && (
            <>
              <TextField
                label="Community Name"
                fullWidth
                margin="dense"
                value={selectedCommunity.name || ''}
                onChange={(e) => setSelectedCommunity({ 
                  ...selectedCommunity, 
                  name: e.target.value 
                })}
              />
              <TextField
                label="Avatar (Base64)"
                fullWidth
                margin="dense"
                value={selectedCommunity.avatar || ''}
                onChange={(e) => setSelectedCommunity({ 
                  ...selectedCommunity, 
                  avatar: e.target.value || null 
                })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedCommunity.isHidden || false}
                    onChange={(e) => setSelectedCommunity({ 
                      ...selectedCommunity, 
                      isHidden: e.target.checked 
                    })}
                  />
                }
                label="Hidden"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunitiesPage;