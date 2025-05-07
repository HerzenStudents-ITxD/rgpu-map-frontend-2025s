// RolesPage.tsx with hook integration
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
  CircularProgress,
  Pagination
} from '@mui/material';
import { CreateRoleRequest } from '../../features/real_api/rightsServiceApi';
import { useAdminRoles } from './useAdminRoles';

const RolesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  const {
    roles,
    loading,
    error,
    totalCount,
    fetchRoles,
    createRole,
    editRole,
    deleteRole
  } = useAdminRoles();

  const [newRole, setNewRole] = useState<CreateRoleRequest>({ 
    name: '', 
    localizations: [{ locale: 'en', name: '' }], 
    isActive: true 
  });

  useEffect(() => {
    fetchRoles((page - 1) * rowsPerPage, rowsPerPage);
  }, [page, rowsPerPage, fetchRoles]);

  const filteredRoles = roles.filter(role => 
    role.localizations?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    if (!newRole.name) {
      return; // Don't proceed if name is empty
    }

    const roleToCreate: CreateRoleRequest = {
      name: newRole.name || '', // Ensure we never pass null or undefined
      localizations: [{ 
        locale: 'en', 
        name: newRole.name || '' // Ensure we never pass null or undefined
      }],
      isActive: true,
    };
    
    await createRole(roleToCreate);
    setOpenCreate(false);
    setNewRole({ name: '', localizations: [{ locale: 'en', name: '' }], isActive: true });
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Roles</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Roles"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Role
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Active</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRoles.map(role => (
                <TableRow key={role.id}>
                  <TableCell>{role.localizations?.[0]?.name || 'N/A'}</TableCell>
                  <TableCell>{role.isActive ? 'Yes' : 'No'}</TableCell>
                  <TableCell>
                    <Button onClick={() => role.id && editRole(role.id, !role.isActive)}>
                      Toggle Active
                    </Button>
                    <Button color="error" onClick={() => role.id && deleteRole(role.id)}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <Pagination
              count={Math.ceil(totalCount / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}

      {/* Create Role Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            margin="dense"
            value={newRole.name || ''}
            onChange={(e) => setNewRole({ 
              ...newRole, 
              name: e.target.value, 
              localizations: [{ locale: 'en', name: e.target.value }] 
            })}
            required
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained" 
            disabled={!newRole.name}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;