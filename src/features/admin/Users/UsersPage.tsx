// UsersPage.tsx with hook integration
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Button, 
  TextField, 
  Table, 
  TableHead, 
  TableBody, 
  TableCell, 
  TableRow, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Typography, 
  CircularProgress,
  Pagination
} from '@mui/material';
import { UserInfo, CreateUserRequest, CommunicationType } from '../../real_api/usersServiceApi';
import { useAdminUsers } from './useAdminUsers';

const UsersPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  
  const {
    users,
    loading,
    error,
    totalCount,
    fetchUsers,
    createUser,
    editUser,
    deleteUser
  } = useAdminUsers();

  const [newUser, setNewUser] = useState<CreateUserRequest>({ 
    login: '', 
    email: '', 
    firstName: '', 
    lastName: '', 
    roleIds: [],
    communication: {
      type: CommunicationType.BaseEmail,
      value: '',
    }
  });

  useEffect(() => {
    fetchUsers((page - 1) * rowsPerPage, rowsPerPage, search);
  }, [page, rowsPerPage, search, fetchUsers]);

  const handleCreate = async () => {
    const userToCreate = {
      ...newUser,
      communication: {
        ...newUser.communication,
        value: newUser.email,
      },
    };
    await createUser(userToCreate);
    setOpenCreate(false);
    setNewUser({ 
      login: '', 
      email: '', 
      firstName: '', 
      lastName: '', 
      roleIds: [],
      communication: {
        type: CommunicationType.BaseEmail,
        value: '',
      }
    });
  };

  const handleEdit = async () => {
    if (selectedUser) {
      await editUser(selectedUser.userId, { 
        firstName: selectedUser.firstName, 
        lastName: selectedUser.lastName, 
        email: selectedUser.email 
      });
      setOpenEdit(false);
      setSelectedUser(null);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Users</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Users"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create User
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Full Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user.userId}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Button onClick={() => { setSelectedUser(user); setOpenEdit(true); }}>
                      Edit
                    </Button>
                    <Button color="error" onClick={() => deleteUser(user.userId)}>
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

      {/* Create User Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create User</DialogTitle>
        <DialogContent>
          <TextField
            label="Login"
            fullWidth
            margin="dense"
            value={newUser.login}
            onChange={(e) => setNewUser({ ...newUser, login: e.target.value })}
          />
          <TextField
            label="Email"
            fullWidth
            margin="dense"
            value={newUser.email}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
          <TextField
            label="First Name"
            fullWidth
            margin="dense"
            value={newUser.firstName}
            onChange={(e) => setNewUser({ ...newUser, firstName: e.target.value })}
          />
          <TextField
            label="Last Name"
            fullWidth
            margin="dense"
            value={newUser.lastName}
            onChange={(e) => setNewUser({ ...newUser, lastName: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit User</DialogTitle>
        <DialogContent>
          {selectedUser && (
            <>
              <TextField
                label="Email"
                fullWidth
                margin="dense"
                value={selectedUser.email || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, email: e.target.value })}
              />
              <TextField
                label="First Name"
                fullWidth
                margin="dense"
                value={selectedUser.firstName || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, firstName: e.target.value })}
              />
              <TextField
                label="Last Name"
                fullWidth
                margin="dense"
                value={selectedUser.lastName || ''}
                onChange={(e) => setSelectedUser({ ...selectedUser, lastName: e.target.value })}
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

export default UsersPage;