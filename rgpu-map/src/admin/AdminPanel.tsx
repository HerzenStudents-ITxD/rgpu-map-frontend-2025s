import React, { useState } from 'react';
import { Container, Typography, List, ListItem, ListItemText, TextField, Button, Select, MenuItem, FormControl, InputLabel, Box, Divider } from '@mui/material';
import { useAdminUsers } from './useAdminUsers';
import { useAdminPoints } from './useAdminPoints';

interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
}

const AdminPanel: React.FC = () => {
  const { users, roles, loading: usersLoading, error: usersError, changeUserRole } = useAdminUsers();
  const { points, loading: pointsLoading, error: pointsError, addPoint, editPoint } = useAdminPoints();

  // Состояние для формы добавления новой точки
  const [newPoint, setNewPoint] = useState<Omit<Point, 'point_id'>>({ user_id: 'user3', x: 0, y: 0, z: 0 });
  // Состояние для редактирования точки
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);

  const handleAddPoint = () => {
    addPoint(newPoint).then(() => {
      setNewPoint({ user_id: 'user3', x: 0, y: 0, z: 0 }); // Сбрасываем форму
    });
  };

  const handleEditPoint = (pointId: string) => {
    if (editingPoint) {
      editPoint(pointId, {
        x: editingPoint.x,
        y: editingPoint.y,
        z: editingPoint.z,
      }).then(() => {
        setEditingPoint(null); // Сбрасываем форму редактирования
      });
    }
  };

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>

      {/* Управление пользователями */}
      <Typography variant="h5" gutterBottom>
        Manage Users
      </Typography>
      {usersLoading && <Typography>Loading users...</Typography>}
      {usersError && <Typography color="error">{usersError}</Typography>}
      <List>
        {users.map((user) => (
          <ListItem key={user.user_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <ListItemText primary={user.email} secondary={`Created: ${user.createdAt}`} />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>Role</InputLabel>
              <Select
                value={user.role_id}
                onChange={(e) => changeUserRole(user.user_id, e.target.value as string)}
                label="Role"
              >
                {roles.map((role) => (
                  <MenuItem key={role.role_id} value={role.role_id}>
                    {role.rools}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 4 }} />

      {/* Управление точками */}
      <Typography variant="h5" gutterBottom>
        Manage Points
      </Typography>
      {pointsLoading && <Typography>Loading points...</Typography>}
      {pointsError && <Typography color="error">{pointsError}</Typography>}

      {/* Форма для добавления новой точки */}
      <Typography variant="h6" gutterBottom>
        Add New Point
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="X"
          type="number"
          value={newPoint.x}
          onChange={(e) => setNewPoint({ ...newPoint, x: parseFloat(e.target.value) })}
        />
        <TextField
          label="Y"
          type="number"
          value={newPoint.y}
          onChange={(e) => setNewPoint({ ...newPoint, y: parseFloat(e.target.value) })}
        />
        <TextField
          label="Z"
          type="number"
          value={newPoint.z}
          onChange={(e) => setNewPoint({ ...newPoint, z: parseFloat(e.target.value) })}
        />
        <Button variant="contained" onClick={handleAddPoint} disabled={pointsLoading}>
          Add Point
        </Button>
      </Box>

      {/* Список точек с возможностью редактирования */}
      <List>
        {points.map((point) => (
          <ListItem key={point.point_id} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {editingPoint && editingPoint.point_id === point.point_id ? (
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                <TextField
                  label="X"
                  type="number"
                  value={editingPoint.x}
                  onChange={(e) => setEditingPoint({ ...editingPoint, x: parseFloat(e.target.value) })}
                />
                <TextField
                  label="Y"
                  type="number"
                  value={editingPoint.y}
                  onChange={(e) => setEditingPoint({ ...editingPoint, y: parseFloat(e.target.value) })}
                />
                <TextField
                  label="Z"
                  type="number"
                  value={editingPoint.z}
                  onChange={(e) => setEditingPoint({ ...editingPoint, z: parseFloat(e.target.value) })}
                />
                <Button variant="contained" onClick={() => handleEditPoint(point.point_id)} disabled={pointsLoading}>
                  Save
                </Button>
                <Button variant="outlined" onClick={() => setEditingPoint(null)}>
                  Cancel
                </Button>
              </Box>
            ) : (
              <>
                <ListItemText
                  primary={`Point ID: ${point.point_id}`}
                  secondary={`Coordinates: X: ${point.x}, Y: ${point.y}, Z: ${point.z} | Created by: ${point.user_id}`}
                />
                <Button variant="outlined" onClick={() => setEditingPoint(point)}>
                  Edit
                </Button>
              </>
            )}
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default AdminPanel;