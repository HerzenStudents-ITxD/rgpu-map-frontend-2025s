import React, { useState } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsers, User } from './useUsers';

const UsersAdmin: React.FC = () => {
  const { t } = useTranslation();
  const { users, loading, error, changeUserRole } = useUsers();
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setSelectedRole((prev) => ({ ...prev, [userId]: newRole }));
    changeUserRole(userId, newRole);
  };

  return (
    <Container maxWidth="md" sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5">{t('admin.usersManagement')}</Typography>
        <Button component={Link} to="/admin/points" variant="contained">
          {t('admin.pointsManagement')}
        </Button>
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto', my: 4 }} />}

      <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
        {users.map((user: User) => (
          <ListItem key={user.user_id}>
            <ListItemText primary={user.email} secondary={`ID: ${user.user_id}`} />
            <FormControl sx={{ minWidth: 120 }}>
              <InputLabel>{t('admin.role')}</InputLabel>
              <Select
                value={selectedRole[user.user_id] || user.role}
                onChange={(e) => handleRoleChange(user.user_id, e.target.value as User['role'])}
                label={t('admin.role')}
              >
                <MenuItem value="guest">{t('admin.guest')}</MenuItem>
                <MenuItem value="moderator">{t('admin.moderator')}</MenuItem>
                <MenuItem value="admin">{t('admin.admin')}</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
        ))}
      </List>
    </Container>
  );
};

export default UsersAdmin;