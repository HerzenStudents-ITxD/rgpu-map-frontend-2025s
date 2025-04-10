// src/pages/admin/UsersAdmin.tsx
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
  Box
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useUsers, User } from './useUsers'; // Импортируем тип User
const UsersAdmin: React.FC = () => {
  const { t } = useTranslation();
  const { users, loading, error, changeUserRole } = useUsers();
  const [selectedRole, setSelectedRole] = useState<{ [key: string]: string }>({});

  const handleRoleChange = (userId: string, newRole: User['role']) => {
    setSelectedRole(prev => ({ ...prev, [userId]: newRole }));
    changeUserRole(userId, newRole);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h4">{t('admin.usersManagement')}</Typography>
        <Button
          component={Link}
          to="/admin/points"
          variant="contained"
          color="secondary"
        >
          {t('admin.managePoints')}
        </Button>
      </Box>

      {loading && <CircularProgress sx={{ display: 'block', mx: 'auto' }} />}
      {error && <Alert severity="error">{error}</Alert>}

      <List sx={{ bgcolor: 'background.paper', borderRadius: 2 }}>
        {users.map((user: User) => ( // Явно указываем тип
          <ListItem key={user.user_id}>
            <ListItemText
              primary={user.email}
              secondary={`ID: ${user.user_id}`}
            />
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