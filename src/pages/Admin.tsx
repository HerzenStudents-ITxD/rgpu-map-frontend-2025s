// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState } from 'react';
import { Container, Typography, Box, Tabs, Tab, TextField, Button, List, ListItem, ListItemText, Select, MenuItem, FormControl, InputLabel, IconButton } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import { usePoints } from '../modules/map/usePoints';
import { useUsers } from '../modules/admin/useUsers';
import { useTranslation } from 'react-i18next';

interface Point {
  point_id: string;
  user_id: string;
  x: number;
  y: number;
  z: number;
}

interface User {
  user_id: string;
  email: string;
  role: 'guest' | 'moderator' | 'admin';
}

const Admin: React.FC = () => {
  const { t } = useTranslation();
  const { points, loading: pointsLoading, error: pointsError, addPoint, editPoint } = usePoints();
  const { users, loading: usersLoading, error: usersError, changeUserRole } = useUsers();
  const [tab, setTab] = useState(0);
  const [newPoint, setNewPoint] = useState({ x: '', y: '', z: '' });
  const [editingPoint, setEditingPoint] = useState<Point | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTab(newValue);
  };

  const handleAddPoint = async () => {
    if (newPoint.x && newPoint.y && newPoint.z) {
      await addPoint({
        user_id: 'admin', // В реальном приложении это будет ID текущего админа
        x: parseFloat(newPoint.x),
        y: parseFloat(newPoint.y),
        z: parseFloat(newPoint.z),
      });
      setNewPoint({ x: '', y: '', z: '' });
    }
  };

  const handleEditPoint = (point: Point) => {
    setEditingPoint(point);
  };

  const handleSavePoint = async () => {
    if (editingPoint) {
      await editPoint(editingPoint.point_id, {
        x: parseFloat(editingPoint.x.toString()),
        y: parseFloat(editingPoint.y.toString()),
        z: parseFloat(editingPoint.z.toString()),
      });
      setEditingPoint(null);
    }
  };

  const handleChangeRole = async (userId: string, newRole: 'guest' | 'moderator' | 'admin') => {
    await changeUserRole(userId, newRole);
  };

  return (
    <Container maxWidth="md" sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        {t('admin.title')}
      </Typography>
      <Tabs value={tab} onChange={handleTabChange} sx={{ mb: 3 }}>
        <Tab label={t('admin.points')} />
        <Tab label={t('admin.users')} />
      </Tabs>

      {tab === 0 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('admin.addPoint')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
            <TextField
              label="X"
              type="number"
              value={newPoint.x}
              onChange={(e) => setNewPoint({ ...newPoint, x: e.target.value })}
            />
            <TextField
              label="Y"
              type="number"
              value={newPoint.y}
              onChange={(e) => setNewPoint({ ...newPoint, y: e.target.value })}
            />
            <TextField
              label="Z"
              type="number"
              value={newPoint.z}
              onChange={(e) => setNewPoint({ ...newPoint, z: e.target.value })}
            />
            <Button variant="contained" onClick={handleAddPoint} disabled={pointsLoading}>
              {t('admin.add')}
            </Button>
          </Box>
          {pointsError && <Typography color="error">{pointsError}</Typography>}
          <Typography variant="h6" gutterBottom>
            {t('admin.pointsList')}
          </Typography>
          <List>
            {points.map((point) => (
              <ListItem key={point.point_id} secondaryAction={
                <IconButton onClick={() => handleEditPoint(point)}>
                  <EditIcon />
                </IconButton>
              }>
                <ListItemText
                  primary={`Point ID: ${point.point_id}`}
                  secondary={`X: ${point.x}, Y: ${point.y}, Z: ${point.z}`}
                />
              </ListItem>
            ))}
          </List>
          {editingPoint && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h6" gutterBottom>
                {t('admin.editPoint')}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
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
                <Button variant="contained" onClick={handleSavePoint} disabled={pointsLoading}>
                  {t('admin.save')}
                </Button>
                <Button variant="outlined" onClick={() => setEditingPoint(null)}>
                  {t('admin.cancel')}
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      )}

      {tab === 1 && (
        <Box>
          <Typography variant="h6" gutterBottom>
            {t('admin.usersList')}
          </Typography>
          {usersError && <Typography color="error">{usersError}</Typography>}
          <List>
            {users.map((user) => (
              <ListItem key={user.user_id}>
                <ListItemText
                  primary={`User ID: ${user.user_id}`}
                  secondary={`Email: ${user.email}`}
                />
                <FormControl sx={{ minWidth: 120 }}>
                  <InputLabel>{t('admin.role')}</InputLabel>
                  <Select
                    value={user.role}
                    onChange={(e) => handleChangeRole(user.user_id, e.target.value as 'guest' | 'moderator' | 'admin')}
                    disabled={usersLoading}
                  >
                    <MenuItem value="guest">{t('admin.guest')}</MenuItem>
                    <MenuItem value="moderator">{t('admin.moderator')}</MenuItem>
                    <MenuItem value="admin">{t('admin.admin')}</MenuItem>
                  </Select>
                </FormControl>
              </ListItem>
            ))}
          </List>
        </Box>
      )}
    </Container>
  );
};

export default Admin;