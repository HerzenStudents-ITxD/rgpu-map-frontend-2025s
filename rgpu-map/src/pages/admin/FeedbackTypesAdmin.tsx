import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
  Alert,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FeedbackServiceApi,
  TypeResponse,
  CreateTypeRequest,
  UpdateTypeRequest,
} from '../../features/real_api/feedbackServiceApi';

const feedbackApi = new FeedbackServiceApi();

const FeedbackTypesAdmin = () => {
  const { t } = useTranslation();
  const [types, setTypes] = useState<TypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newType, setNewType] = useState({ ru: '', en: '', zh: '' });
  const [editType, setEditType] = useState<TypeResponse | null>(null);
  const [editTranslations, setEditTranslations] = useState({ ru: '', en: '', zh: '' });

  useEffect(() => {
    fetchTypes();
  }, []);

  const fetchTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await feedbackApi.type.getType();
      if (response.data.body) {
        setTypes(response.data.body);
      } else {
        setError(t('feedback.fetchTypesFailed') || 'Failed to fetch feedback types');
      }
    } catch (err) {
      setError(t('feedback.fetchTypesFailed') || 'Error fetching feedback types');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateType = async () => {
    try {
      setError(null);
      const trimmed = {
        ru: newType.ru.trim(),
        en: newType.en.trim(),
        zh: newType.zh.trim(),
      };
      if (!trimmed.ru || !trimmed.en || !trimmed.zh) {
        setError(t('feedback.allFieldsRequired') || 'All fields are required');
        return;
      }
      const nameJson = JSON.stringify(trimmed);
      const request: CreateTypeRequest = {
        type: 1,
        name: nameJson,
      };
      const response = await feedbackApi.type.createType(request);
      if (response.data.body) {
        setTypes([...types, { id: response.data.body, type: 1, name: nameJson, isActive: true }]);
        setNewType({ ru: '', en: '', zh: '' });
        setOpenCreateDialog(false);
      } else {
        setError(t('feedback.createTypeFailed') || 'Failed to create type');
      }
    } catch (err) {
      setError(t('feedback.createTypeFailed') || 'Error creating type');
    }
  };

  const handleUpdateType = async () => {
    if (!editType) return;
    try {
      setError(null);
      const trimmed = {
        ru: editTranslations.ru.trim(),
        en: editTranslations.en.trim(),
        zh: editTranslations.zh.trim(),
      };
      if (!trimmed.ru || !trimmed.en || !trimmed.zh) {
        setError(t('feedback.allFieldsRequired') || 'All fields are required');
        return;
      }
      const nameJson = JSON.stringify(trimmed);
      const request: UpdateTypeRequest = {
        id: editType.id,
        type: editType.type,
        name: nameJson,
      };
      const response = await feedbackApi.type.updateType(request);
      if (response.data.body) {
        setTypes(
          types.map((t) => (t.id === editType.id ? { ...t, name: nameJson } : t))
        );
        setOpenEditDialog(false);
        setEditType(null);
      } else {
        setError(t('feedback.updateTypeFailed') || 'Failed to update type');
      }
    } catch (err) {
      setError(t('feedback.updateTypeFailed') || 'Error updating type');
    }
  };

  const handleToggleVisibility = async (typeId: string, show: boolean) => {
    try {
      setError(null);
      const response = await (show ? feedbackApi.type.showType(typeId) : feedbackApi.type.hideType(typeId));
      if (response.data.body) {
        setTypes(types.map((t) => (t.id === typeId ? { ...t, isActive: show } : t)));
      } else {
        setError(t('feedback.toggleVisibilityFailed') || 'Failed to toggle visibility');
      }
    } catch (err) {
      setError(t('feedback.toggleVisibilityFailed') || 'Error toggling visibility');
    }
  };

  const getDisplayName = (name: string | null) => {
    try {
      const translations = JSON.parse(name || '{}');
      return translations[t('i18n.language')] || translations['en'] || translations['ru'] || 'Unknown';
    } catch {
      return 'Unknown';
    }
  };

  const handleOpenEditDialog = (type: TypeResponse) => {
    setEditType(type);
    try {
      const translations = JSON.parse(type.name || '{}');
      setEditTranslations({
        ru: translations.ru || '',
        en: translations.en || '',
        zh: translations.zh || '',
      });
    } catch {
      setEditTranslations({ ru: '', en: '', zh: '' });
    }
    setOpenEditDialog(true);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('feedback.typesAdmin.title')}
      </Typography>
      <Button variant="contained" onClick={() => setOpenCreateDialog(true)} sx={{ mb: 2 }}>
        {t('feedback.createType')}
      </Button>
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('feedback.id')}</TableCell>
                <TableCell>{t('feedback.name')}</TableCell>
                <TableCell>{t('feedback.type')}</TableCell>
                <TableCell>{t('feedback.isActive')}</TableCell>
                <TableCell>{t('feedback.actions')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {types.map((type) => (
                <TableRow key={type.id}>
                  <TableCell>{type.id}</TableCell>
                  <TableCell>{getDisplayName(type.name)}</TableCell>
                  <TableCell>{type.type}</TableCell>
                  <TableCell>{type.isActive ? t('yes') : t('no')}</TableCell>
                  <TableCell>
                    <Button onClick={() => handleOpenEditDialog(type)} size="small" sx={{ mr: 1 }}>
                      {t('edit')}
                    </Button>
                    <Button
                      onClick={() => handleToggleVisibility(type.id!, !type.isActive)}
                      size="small"
                      color={type.isActive ? 'error' : 'success'}
                    >
                      {type.isActive ? t('hide') : t('show')}
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openCreateDialog} onClose={() => setOpenCreateDialog(false)}>
        <DialogTitle>{t('feedback.createType')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('feedback.nameRu')}
            value={newType.ru}
            onChange={(e) => setNewType({ ...newType, ru: e.target.value })}
            sx={{ mt: 2 }}
            error={!newType.ru && error !== null}
            helperText={!newType.ru && error ? t('feedback.required') : ''}
          />
          <TextField
            fullWidth
            label={t('feedback.nameEn')}
            value={newType.en}
            onChange={(e) => setNewType({ ...newType, en: e.target.value })}
            sx={{ mt: 2 }}
            error={!newType.en && error !== null}
            helperText={!newType.en && error ? t('feedback.required') : ''}
          />
          <TextField
            fullWidth
            label={t('feedback.nameZh')}
            value={newType.zh}
            onChange={(e) => setNewType({ ...newType, zh: e.target.value })}
            sx={{ mt: 2 }}
            error={!newType.zh && error !== null}
            helperText={!newType.zh && error ? t('feedback.required') : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>{t('cancel')}</Button>
          <Button
            onClick={handleCreateType}
            disabled={!newType.ru || !newType.en || !newType.zh}
          >
            {t('create')}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t('feedback.editType')}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t('feedback.nameRu')}
            value={editTranslations.ru}
            onChange={(e) => setEditTranslations({ ...editTranslations, ru: e.target.value })}
            sx={{ mt: 2 }}
            error={!editTranslations.ru && error !== null}
            helperText={!editTranslations.ru && error ? t('feedback.required') : ''}
          />
          <TextField
            fullWidth
            label={t('feedback.nameEn')}
            value={editTranslations.en}
            onChange={(e) => setEditTranslations({ ...editTranslations, en: e.target.value })}
            sx={{ mt: 2 }}
            error={!editTranslations.en && error !== null}
            helperText={!editTranslations.en && error ? t('feedback.required') : ''}
          />
          <TextField
            fullWidth
            label={t('feedback.nameZh')}
            value={editTranslations.zh}
            onChange={(e) => setEditTranslations({ ...editTranslations, zh: e.target.value })}
            sx={{ mt: 2 }}
            error={!editTranslations.zh && error !== null}
            helperText={!editTranslations.zh && error ? t('feedback.required') : ''}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>{t('cancel')}</Button>
          <Button
            onClick={handleUpdateType}
            disabled={!editTranslations.ru || !editTranslations.en || !editTranslations.zh}
          >
            {t('save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FeedbackTypesAdmin;