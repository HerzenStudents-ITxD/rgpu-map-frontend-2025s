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
  Alert,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { CommunityAgentInfo, AddAgentRequest } from '../../real_api/communityServiceApi';

interface AgentsPageProps {
  agents: CommunityAgentInfo[];
  loading: boolean;
  error: string | null;
  addAgent: (agent: AddAgentRequest) => Promise<void>;
  deleteAgent: (communityId: string, userId: string) => Promise<void>;
}

const AgentsPage: React.FC<AgentsPageProps> = ({ agents, loading, error, addAgent, deleteAgent }) => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [newAgent, setNewAgent] = useState<AddAgentRequest>({ 
    communityId: '', 
    userId: '',
    isModerator: false
  });

  const filteredAgents = agents.filter(agent => 
    agent.userName?.toLowerCase().includes(search.toLowerCase()) ||
    agent.userId?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = useCallback(async () => {
    if (!newAgent.communityId || !newAgent.userId) {
      return;
    }
    await addAgent(newAgent);
    setOpenCreate(false);
    setNewAgent({ communityId: '', userId: '', isModerator: false });
  }, [newAgent, addAgent]);

  const handleDelete = useCallback((communityId: string | undefined, userId: string | undefined) => {
    if (communityId && userId) {
      deleteAgent(communityId, userId);
    }
  }, [deleteAgent]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Agents</Typography>
      {error && <Alert severity="error">{error}</Alert>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Agents"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Add Agent
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>User Name</TableCell>
              <TableCell>Community ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAgents.map(agent => (
              <TableRow key={`${agent.communityId || 'unknown'}-${agent.userId || 'unknown'}`}>
                <TableCell>{agent.userName || agent.userId || 'N/A'}</TableCell>
                <TableCell>{agent.communityId || 'N/A'}</TableCell>
                <TableCell>
                  <Button 
                    color="error" 
                    onClick={() => handleDelete(agent.communityId, agent.userId)}
                    disabled={!agent.communityId || !agent.userId}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Add Agent</DialogTitle>
        <DialogContent>
          <TextField
            label="Community ID"
            fullWidth
            margin="dense"
            value={newAgent.communityId}
            onChange={(e) => setNewAgent({ ...newAgent, communityId: e.target.value })}
            required
          />
          <TextField
            label="User ID"
            fullWidth
            margin="dense"
            value={newAgent.userId}
            onChange={(e) => setNewAgent({ ...newAgent, userId: e.target.value })}
            required
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newAgent.isModerator || false}
                onChange={(e) => setNewAgent({ ...newAgent, isModerator: e.target.checked })}
              />
            }
            label="Is Moderator"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained"
            disabled={!newAgent.communityId || !newAgent.userId}
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AgentsPage;