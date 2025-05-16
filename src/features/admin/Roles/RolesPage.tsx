// RolesPage.tsx с исправлениями
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
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem 
} from '@mui/material';
import { CreateRoleRequest, RightInfo, RightsServiceApi } from '../../real_api/rightsServiceApi';
import { useAdminRoles } from './useAdminRoles';

// Инициализация сервиса
const rightsService = new RightsServiceApi();

const RolesPage: React.FC = () => {
  // Состояния
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [selectedRights, setSelectedRights] = useState<number[]>([]);
  const [rightsList, setRightsList] = useState<RightInfo[]>([]);

  // Хук для работы с ролями
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

  // Начальное состояние новой роли
  const [newRole, setNewRole] = useState<CreateRoleRequest>({ 
    name: '', 
    localizations: [{ 
      locale: 'en', 
      name: '',
      description: '' 
    }], 
    rights: [],
    isActive: true 
  });

  // Загрузка данных при монтировании
  useEffect(() => {
    fetchRoles((page - 1) * rowsPerPage, rowsPerPage);
    rightsService.rights.getRights({ locale: 'ru' })
      .then(res => setRightsList(res.data?.body || []))
      .catch(console.error);
  }, [page, rowsPerPage, fetchRoles]);

  // Фильтрация ролей
  const filteredRoles = roles.filter(role => 
    role.localizations?.[0]?.name?.toLowerCase().includes(search.toLowerCase())
  );

  // Обработчик создания роли
  const handleCreate = async () => {
    if (!newRole.name) return;

    const roleToCreate: CreateRoleRequest = {
      ...newRole,
      localizations: [{
        ...newRole.localizations[0],
        name: newRole.name // Синхронизация имени
      }],
      rights: selectedRights
    };
    
    try {
      await createRole(roleToCreate);
      setOpenCreate(false);
      // Сброс формы
      setNewRole({ 
        name: '', 
        localizations: [{ 
          locale: 'en', 
          name: '',
          description: '' 
        }], 
        rights: [],
        isActive: true 
      });
      setSelectedRights([]);
    } catch (err) {
      console.error('Error creating role:', err);
    }
  };

  // Обработчик изменения страницы
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

      {/* Диалог создания роли */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md">
        <DialogTitle>Create New Role</DialogTitle>
        <DialogContent>
          <TextField
            label="Role Name"
            fullWidth
            margin="dense"
            value={newRole.name}
            onChange={(e) => setNewRole({
              ...newRole,
              name: e.target.value
            })}
            required
          />
          
          <TextField
            label="Description (EN)"
            fullWidth
            margin="dense"
            value={newRole.localizations[0].description}
            onChange={(e) => setNewRole({
              ...newRole,
              localizations: [{
                ...newRole.localizations[0],
                description: e.target.value
              }]
            })}
          />

          <FormControl fullWidth margin="dense">
            <InputLabel>Associated Rights</InputLabel>
            <Select
              multiple
              value={selectedRights}
              onChange={(e) => setSelectedRights(e.target.value as number[])}
              renderValue={(selected) => (
                <div>
                  {(selected as number[]).map((value) => (
                    rightsList.find(r => r.rightId === value)?.name
                  )).join(', ')}
                </div>
              )}
            >
              {rightsList.map(right => (
                <MenuItem key={right.rightId} value={right.rightId}>
                  {right.name} - {right.description}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            onClick={handleCreate} 
            variant="contained" 
            color="primary"
            disabled={!newRole.name.trim()}
          >
            Create Role
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RolesPage;