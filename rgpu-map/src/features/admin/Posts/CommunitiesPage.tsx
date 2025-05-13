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
  IconButton
} from '@mui/material';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { AvatarBox } from '../components/AvatarBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Community {
  id: string;
  name: string;
  avatar?: string;
  text?: string;
}

const CommunitiesPage = () => {
  const [communities, setCommunities] = useState<Community[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedCommunity, setSelectedCommunity] = useState<Community | null>(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  
  const api = new CommunityServiceApi();

  const loadCommunities = async () => {
    setLoading(true);
    try {
      const response = await api.community.getCommunity();
      setCommunities(response.data.body?.map(c => ({
        id: c.community?.id || '',
        name: c.community?.name || '',
        avatar: c.community?.avatar || '',
        text: c.community?.text || ''
      })) || []);
    } catch (err) {
      setError('Ошибка загрузки сообществ');
    } finally {
      setLoading(false);
    }
  };

  const handleAvatarUpload = async (file: File) => {
    if (!selectedCommunity) return;
    
    try {
      setAvatarLoading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        
        const operations = [{
          op: "replace",
          path: "/avatar",
          value: base64Image
        }];

        await api.community.editPartialUpdate(
          operations,
          { communityId: selectedCommunity.id }
        );

        setCommunities(prev => 
          prev.map(c => 
            c.id === selectedCommunity.id 
              ? { ...c, avatar: base64Image } 
              : c
          )
        );
        setAvatarLoading(false);
      };

      reader.readAsDataURL(file);
    } catch (err) {
      setError('Ошибка загрузки аватарки');
      setAvatarLoading(false);
    }
  };

  const validateImage = (file: File) => {
    const maxSize = 2 * 1024 * 1024; // 2MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      return 'Максимальный размер файла 2MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return 'Допустимы только JPEG и PNG';
    }
    return null;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>Управление сообществами</Typography>

      {loading && <CircularProgress />}
      {error && <Typography color="error">{error}</Typography>}

      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Аватар</TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Описание</TableCell>
            <TableCell>Действия</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {communities.map(community => (
            <TableRow key={community.id}>
              <TableCell>
                <AvatarBox 
                  imageUrl={community.avatar}
                  name={community.name}
                  size={64}
                />
              </TableCell>
              <TableCell>{community.name}</TableCell>
              <TableCell>{community.text || '—'}</TableCell>
              <TableCell>
                <IconButton onClick={() => {
                  setSelectedCommunity(community);
                  setOpenEdit(true);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton>
                  <DeleteIcon color="error" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Редактирование сообщества</DialogTitle>
        <DialogContent dividers>
          {selectedCommunity && (
            <Box sx={{ mt: 2 }}>
              {/* Поле загрузки аватарки */}
              <Box sx={{ mb: 3, textAlign: 'center' }}>
                <input
                  accept="image/*"
                  style={{ display: 'none' }}
                  id="avatar-upload"
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (!file) return;
                    
                    const error = validateImage(file);
                    if (error) {
                      setError(error);
                      return;
                    }
                    
                    handleAvatarUpload(file);
                  }}
                />
                <label htmlFor="avatar-upload">
                  <Button 
                    variant="outlined" 
                    component="span"
                    disabled={avatarLoading}
                  >
                    {avatarLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      'Изменить аватар'
                    )}
                  </Button>
                </label>
                
                {selectedCommunity.avatar && (
                  <Box sx={{ mt: 2 }}>
                    <AvatarBox 
                      imageUrl={selectedCommunity.avatar}
                      name={selectedCommunity.name}
                      size={120}
                    />
                  </Box>
                )}
              </Box>

              {/* Остальные поля формы */}
              <TextField
                fullWidth
                label="Название"
                value={selectedCommunity.name}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  name: e.target.value
                })}
                sx={{ mb: 3 }}
              />
              
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Описание"
                value={selectedCommunity.text || ''}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  text: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={async () => {
              if (!selectedCommunity) return;
              try {
                const operations = [];
                
                if (selectedCommunity.name) {
                  operations.push({
                    op: "replace",
                    path: "/name",
                    value: selectedCommunity.name
                  });
                }
                
                if (selectedCommunity.text !== undefined) {
                  operations.push({
                    op: "replace",
                    path: "/text",
                    value: selectedCommunity.text
                  });
                }

                await api.community.editPartialUpdate(
                  operations,
                  { communityId: selectedCommunity.id }
                );
                
                setOpenEdit(false);
                loadCommunities();
              } catch (err) {
                setError('Ошибка сохранения');
              }
            }}
          >
            Сохранить
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunitiesPage;