import React, { useState } from 'react';
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
import { CommunityInfo, CreateCommunityRequest } from '../../features/real_api/communityServiceApi';

interface CommunitiesPageProps {
  communities: CommunityInfo[];
  loading: boolean;
  error: string | null;
  createCommunity: (community: CreateCommunityRequest) => Promise<void>;
  editCommunity: (communityId: string, updates: { name?: string; isHidden?: boolean }) => Promise<void>;
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

  const handleCreate = async () => {
    await createCommunity(newCommunity);
    setOpenCreate(false);
    setNewCommunity({ name: '', avatarImage: null });
  };

  const handleEdit = async () => {
    if (selectedCommunity && selectedCommunity.id) {
      await editCommunity(selectedCommunity.id, { 
        name: selectedCommunity.name || undefined, 
        isHidden: selectedCommunity.isHidden 
      });
      setOpenEdit(false);
      setSelectedCommunity(null);
    }
  };

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
              <TableRow key={community.id}>
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

      {/* Create Community Dialog */}
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

      {/* Edit Community Dialog */}
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