import React, { useState, useEffect } from 'react';
import { 
  Box, Button, TextField, Table, TableBody, TableCell, TableHead, TableRow,
  Dialog, DialogTitle, DialogContent, DialogActions, Typography, CircularProgress,
  IconButton
} from '@mui/material';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { AvatarBox } from '../../news/components/AvatarBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface Community {
  id: string;
  name: string;
  avatar?: string;
  description?: string;
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
        description: c.community?.text || ''
      })) || []);
    } catch (err) {
      setError('Ошибка загрузки сообществ: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCommunities();
  }, []);

  const handleAvatarUpload = async (file: File) => {
    if (!selectedCommunity) return;
    
    try {
      setAvatarLoading(true);
      const reader = new FileReader();
      
      reader.onloadend = async () => {
        const base64Image = reader.result as string;
        const pureBase64 = base64Image.split(',')[1];
        
        await api.community.editPartialUpdate(
          [{
            op: "replace",
            path: "/avatar",
            value: pureBase64
          }],
          { communityId: selectedCommunity.id }
        );

        await loadCommunities();
      };
      
      reader.readAsDataURL(file);
    } catch (err) {
      setError('Ошибка загрузки аватарки: ' + (err as Error).message);
    } finally {
      setAvatarLoading(false);
    }
  };

const handleSaveChanges = async () => {
  if (!selectedCommunity) return;
  
  try {
    setLoading(true);
    setError(null);

    const operations = [
      {
        op: "replace" as const,
        path: "/name",
        value: selectedCommunity.name
      },
      {
        op: "replace" as const,
        path: "/text",
        value: selectedCommunity.description || ""
      }
    ];

    await api.community.editPartialUpdate(
      operations,
      { communityId: selectedCommunity.id }
    );

    await loadCommunities();
    setOpenEdit(false);
    
  } catch (err) {
    setError(`Ошибка сохранения: ${(err as Error).message}`);
    console.error("Full error details:", err);
  } finally {
    setLoading(false);
  }
};

  const validateImage = (file: File) => {
    const maxSize = 2 * 1024 * 1024;
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (file.size > maxSize) return 'Максимальный размер файла 2MB';
    if (!allowedTypes.includes(file.type)) return 'Допустимы только JPEG и PNG';
    return null;
  };

  const handleDeleteCommunity = async (id: string) => {
    try {
      setLoading(true);
      await api.community.softdeleteDelete({ communityId: id });
      await loadCommunities();
    } catch (err) {
      setError('Ошибка удаления: ' + (err as Error).message);
    } finally {
      setLoading(false);
    }
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
              <TableCell>{community.description || '—'}</TableCell>
              <TableCell>
                <IconButton onClick={() => {
                  setSelectedCommunity(community);
                  setOpenEdit(true);
                }}>
                  <EditIcon />
                </IconButton>
                <IconButton onClick={() => handleDeleteCommunity(community.id)}>
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
                    if (error) return setError(error);
                    handleAvatarUpload(file);
                  }}
                />
                <label htmlFor="avatar-upload">
                  <Button 
                    variant="outlined" 
                    component="span"
                    disabled={avatarLoading}
                  >
                    {avatarLoading ? <CircularProgress size={24} /> : 'Изменить аватар'}
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
                value={selectedCommunity.description || ''}
                onChange={(e) => setSelectedCommunity({
                  ...selectedCommunity,
                  description: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Отмена</Button>
          <Button 
            variant="contained" 
            onClick={handleSaveChanges}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Сохранить'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunitiesPage;