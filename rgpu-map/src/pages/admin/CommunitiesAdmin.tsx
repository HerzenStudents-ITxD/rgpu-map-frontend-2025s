import { useState, useEffect, useCallback } from "react";
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
  Tab,
  Tabs,
  Checkbox,
  FormControlLabel,
  MenuItem,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  CommunityServiceApi,
  CommunityResponse,
  CreateCommunityRequest,
  OperationType,
  NewsResponse,
  CreateNewsRequest,
} from "../../features/real_api/communityServiceApi";
import { Link } from "react-router-dom";
import { getAccessToken } from '../../utils/tokenService';

const communityApi = new CommunityServiceApi();

const CommunitiesAdmin = () => {
  const { t } = useTranslation();
  const [communities, setCommunities] = useState<CommunityResponse[]>([]);
  const [news, setNews] = useState<NewsResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openCreateNewsDialog, setOpenCreateNewsDialog] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [newCommunity, setNewCommunity] = useState({ name: "", avatarFile: null as File | null });
  const [newNews, setNewNews] = useState<CreateNewsRequest>({
    communityId: "",
    title: "",
    content: "",
    images: [],
    location: "",
    isFeatured: false,
  });
  const [editCommunity, setEditCommunity] = useState<CommunityResponse | null>(null);
  const [editForm, setEditForm] = useState({ name: "", avatarFile: null as File | null });
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const readFileAsBase64 = useCallback((file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1] || result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }, []);

  const validateImage = useCallback((file: File): string | null => {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png'];
    
    if (file.size > maxSize) {
      return t('news.imageTooLarge') || 'Image size exceeds 5MB';
    }
    if (!allowedTypes.includes(file.type)) {
      return t('news.invalidImageFormat') || 'Only JPEG and PNG images are allowed';
    }
    return null;
  }, [t]);

  const fetchCommunities = useCallback(async (retryCount = 3) => {
    if (!getAccessToken()) {
      setError(t('admin.noAuth') || 'Please log in to view communities');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const response = await communityApi.community.getCommunity();
      console.log('Communities API response:', response.data);
      if (response.data.body) {
        setCommunities(response.data.body);
      } else {
        console.warn('No communities returned. Total count:', response.data.totalCount);
        setCommunities([]);
      }
    } catch (err: any) {
      console.error('Error fetching communities:', err);
      if (retryCount > 0) {
        console.log(`Retrying... Attempts left: ${retryCount}`);
        await new Promise(resolve => setTimeout(resolve, 1000));
        return fetchCommunities(retryCount - 1);
      }
      setError(t('admin.errorFetchingCommunities') || err.message || 'Error fetching communities');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const fetchNews = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityApi.community.newsList({ page: 0, pageSize: 100 });
      console.log('News API response:', response.data);
      if (response.data.body) {
        setNews(response.data.body);
      } else {
        console.warn('No news returned. Total count:', response.data.totalCount);
        setNews([]);
      }
    } catch (err: any) {
      console.error('Error fetching news:', err);
      setError(t('admin.errorFetchingNews') || err.message || 'Error fetching news');
    } finally {
      setLoading(false);
    }
  }, [t]);

  const handleCreateCommunity = useCallback(async () => {
    try {
      setError(null);
      if (!newCommunity.name.trim()) {
        setError(t("admin.nameRequired") || "Community name is required");
        return;
      }
      const request: CreateCommunityRequest = {
        name: newCommunity.name.trim(),
        avatarImage: undefined,
      };
      if (newCommunity.avatarFile) {
        const validationError = validateImage(newCommunity.avatarFile);
        if (validationError) {
          setError(validationError);
          return;
        }
        request.avatarImage = await readFileAsBase64(newCommunity.avatarFile);
      }
      console.log('Creating community with request:', request);
      const response = await communityApi.community.createCommunity(request);
      console.log('Create community response:', response.data);
      if (response.data.body) {
        setCommunities([
          ...communities,
          {
            community: {
              id: response.data.body,
              name: request.name,
              avatar: request.avatarImage || null,
              isHidden: false,
              createdAt: new Date().toISOString(),
            },
            agents: []
          },
        ]);
        setNewCommunity({ name: "", avatarFile: null });
        setOpenCreateDialog(false);
      } else {
        throw new Error(t("admin.errorCreatingCommunity") || "Failed to create community");
      }
    } catch (err: any) {
      console.error('Error creating community:', err);
      setError(t("admin.errorCreatingCommunity") || err.message || "Error creating community");
    }
  }, [newCommunity, communities, t, readFileAsBase64, validateImage]);

  const handleCreateNews = useCallback(async () => {
    try {
      setError(null);
      if (!newNews.title.trim() || !newNews.content.trim() || !newNews.communityId) {
        setError(t("admin.titleAndContentRequired") || "Title, content, and community are required");
        return;
      }

      const request: CreateNewsRequest = {
        communityId: newNews.communityId,
        title: newNews.title.trim(),
        content: newNews.content.trim(),
        images: [],
        location: newNews.location?.trim() || undefined,
        isFeatured: newNews.isFeatured,
      };

      if (newsImage) {
        const validationError = validateImage(newNewsImage);
        if (validationError) {
          setError(validationError);
          return;
        }
        const base64Image = await readFileAsBase64(newsImage);
        request.images!.push(base64Image);
      }
      
      console.log('Creating news with request:', request);
      const response = await communityApi.community.createNewsCreate(request);
      console.log('Create news response:', response.data);
      if (response.data.body) {
        setNews([...news, {
          newsId: response.data.body,
          communityId: newNews.communityId,
          title: newNews.title,
          content: newNews.content,
          photos: request.images || null,
          participants: [],
          location: newNews.location || null,
          isFeatured: newNews.isFeatured,
          createdAt: new Date().toISOString(),
        }]);
        setNewNews({
          communityId: "",
          title: "",
          content: "",
          images: [],
          location: "",
          isFeatured: false,
        });
        setNewsImage(null);
        setOpenCreateNewsDialog(false);
      } else {
        throw new Error(t("admin.errorCreatingNews") || "Failed to create news");
      }
    } catch (err: any) {
      console.error('Error creating news:', err);
      setError(t("admin.errorCreatingNews") || err.message || "Error creating news");
      if (err.response?.status === 400) {
        setError(`Bad request: ${err.response?.data?.message || 'Invalid news data'}`);
      }
    }
  }, [newNews, news, newsImage, t, readFileAsBase64, validateImage]);

  const handleEditCommunity = useCallback(async () => {
    if (!editCommunity?.community?.id) {
      setError(t("admin.invalidCommunity") || "Invalid community selected");
      return;
    }
    try {
      setError(null);
      if (!editForm.name.trim()) {
        setError(t("admin.nameRequired") || "Community name is required");
        return;
      }
      const operations = [
        {
          operationType: OperationType.Replace,
          path: "/name",
          value: editForm.name.trim(),
        },
        {
          operationType: OperationType.Replace,
          path: "/avatar",
          value: null as string | null,
        },
      ];
      if (editForm.avatarFile) {
        const validationError = validateImage(editForm.avatarFile);
        if (validationError) {
          setError(validationError);
          return;
        }
        operations[1].value = await readFileAsBase64(editForm.avatarFile);
      }
      console.log('Editing community with operations:', operations);
      const response = await communityApi.community.editPartialUpdate(
        operations,
        { communityId: editCommunity.community.id }
      );
      console.log('Edit community response:', response.data);
      if (response.data.body) {
        setCommunities(
          communities.map((c) =>
            c.community?.id === editCommunity.community?.id
              ? {
                  ...c,
                  community: {
                    ...c.community!,
                    name: editForm.name,
                    avatar: operations[1].value || null,
                  },
                }
              : c
          )
        );
        setOpenEditDialog(false);
        setEditCommunity(null);
        setEditForm({ name: "", avatarFile: null });
      } else {
        throw new Error(t("admin.errorUpdatingCommunity") || "Failed to update community");
      }
    } catch (err: any) {
      console.error('Error updating community:', err);
      setError(t("admin.errorUpdatingCommunity") || err.message || "Error updating community");
    }
  }, [editCommunity, editForm, communities, t, readFileAsBase64, validateImage]);

  const handleSoftDeleteCommunity = useCallback(async (communityId: string) => {
    try {
      setError(null);
      console.log('Deleting community:', communityId);
      const response = await communityApi.community.softdeleteDelete({
        communityId,
      });
      console.log('Delete community response:', response.data);
      if (response.data.body) {
        setCommunities(
          communities.map((c) =>
            c.community?.id === communityId
              ? { ...c, community: { ...c.community!, isHidden: true } }
              : c
          )
        );
      } else {
        throw new Error(t("admin.errorDeletingCommunity") || "Failed to delete community");
      }
    } catch (err: any) {
      console.error('Error deleting community:', err);
      setError(t("admin.errorDeletingCommunity") || err.message || "Error deleting community");
    }
  }, [communities, t]);

  const handleOpenEditDialog = useCallback((community: CommunityResponse) => {
    if (community.community?.id) {
      setEditCommunity(community);
      setEditForm({
        name: community.community.name || "",
        avatarFile: null,
      });
      setOpenEditDialog(true);
    } else {
      setError(t("admin.invalidCommunity") || "Invalid community selected");
    }
  }, [t]);

  const handleAvatarChange = useCallback((e: React.ChangeEvent<HTMLInputElement>, isEdit: boolean) => {
    const file = e.target.files?.[0] || null;
    if (isEdit) {
      setEditForm(prev => ({ ...prev, avatarFile: file }));
    } else {
      setNewCommunity(prev => ({ ...prev, avatarFile: file }));
    }
  }, []);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setNewsImage(file);
  }, []);

  useEffect(() => {
    const checkAuth = () => setIsAuthenticated(!!getAccessToken());
    checkAuth();
    fetchCommunities();
    fetchNews();
  }, [fetchCommunities, fetchNews]);

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">{t('admin.noAuth') || 'Please log in to access this page'}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Typography variant="h5">{t("admin.communitiesManagement")}</Typography>
        <Button component={Link} to="/admin/agents" variant="contained">
          {t("admin.agentsManagement")}
        </Button>
      </Box>

      <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
        <Tab label={t("admin.communities")} />
        <Tab label={t("admin.news")} />
      </Tabs>

      {activeTab === 0 ? (
        <>
          <Button
            variant="contained"
            onClick={() => setOpenCreateDialog(true)}
            sx={{ mb: 2 }}
          >
            {t("admin.createCommunity")}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : communities.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t('admin.noCommunities') || 'No communities available'}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("admin.id")}</TableCell>
                    <TableCell>{t("admin.name")}</TableCell>
                    <TableCell>{t("admin.avatar")}</TableCell>
                    <TableCell>{t("admin.isHidden")}</TableCell>
                    <TableCell>{t("admin.actions")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {communities.map((community) => (
                    <TableRow key={community.community?.id || 'unknown'}>
                      <TableCell>{community.community?.id || "N/A"}</TableCell>
                      <TableCell>{community.community?.name || "N/A"}</TableCell>
                      <TableCell>{community.community?.avatar ? "Image" : "N/A"}</TableCell>
                      <TableCell>
                        {community.community?.isHidden ? t("yes") : t("no")}
                      </TableCell>
                      <TableCell>
                        <Button
                          onClick={() => handleOpenEditDialog(community)}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          {t("edit")}
                        </Button>
                        <Button
                          onClick={() =>
                            community.community?.id &&
                            handleSoftDeleteCommunity(community.community.id)
                          }
                          size="small"
                          color="error"
                          disabled={community.community?.isHidden}
                        >
                          {t("delete")}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      ) : (
        <>
          <Button
            variant="contained"
            onClick={() => setOpenCreateNewsDialog(true)}
            sx={{ mb: 2 }}
          >
            {t("admin.createNews")}
          </Button>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
              <CircularProgress />
            </Box>
          ) : news.length === 0 ? (
            <Typography variant="body1" sx={{ mt: 2 }}>
              {t('admin.noNews') || 'No news available'}
            </Typography>
          ) : (
            <TableContainer component={Paper}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>{t("admin.title")}</TableCell>
                    <TableCell>{t("admin.content")}</TableCell>
                    <TableCell>{t("admin.community")}</TableCell>
                    <TableCell>{t("admin.createdAt")}</TableCell>
                    <TableCell>{t("admin.isFeatured")}</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {news.map((item) => (
                    <TableRow key={item.newsId || 'unknown'}>
                      <TableCell>{item.title || "N/A"}</TableCell>
                      <TableCell>{item.content || "N/A"}</TableCell>
                      <TableCell>{item.communityId || "N/A"}</TableCell>
                      <TableCell>
                        {item.createdAt ? new Date(item.createdAt).toLocaleString() : "N/A"}
                      </TableCell>
                      <TableCell>{item.isFeatured ? t("yes") : t("no")}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </>
      )}

      <Dialog
        open={openCreateDialog}
        onClose={() => setOpenCreateDialog(false)}
      >
        <DialogTitle>{t("admin.createCommunity")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t("admin.name")}
            value={newCommunity.name}
            onChange={(e) =>
              setNewCommunity({ ...newCommunity, name: e.target.value })
            }
            sx={{ mt: 2 }}
            error={!!error && !newCommunity.name}
            helperText={
              !!error && !newCommunity.name ? t("admin.nameRequired") : ""
            }
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
            >
              {t('admin.uploadAvatar')}
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={(e) => handleAvatarChange(e, false)}
              />
            </Button>
            {newCommunity.avatarFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('feedback.selectedFile')}: {newCommunity.avatarFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateDialog(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreateCommunity}
            disabled={!newCommunity.name}
          >
            {t("create")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openCreateNewsDialog}
        onClose={() => setOpenCreateNewsDialog(false)}
      >
        <DialogTitle>{t("admin.createNews")}</DialogTitle>
        <DialogContent>
          <TextField
            select
            fullWidth
            label={t("admin.community")}
            value={newNews.communityId}
            onChange={(e) => setNewNews({ ...newNews, communityId: e.target.value })}
            sx={{ mt: 2 }}
            error={!!error && !newNews.communityId}
            helperText={!!error && !newNews.communityId ? t("admin.required") : ""}
          >
            <MenuItem value="">{t('admin.selectCommunity')}</MenuItem>
            {communities.map((community) => (
              <MenuItem key={community.community?.id || 'unknown'} value={community.community?.id || ''}>
                {community.community?.name || "N/A"}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            fullWidth
            label={t("admin.title")}
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            sx={{ mt: 2 }}
            error={!!error && !newNews.title}
            helperText={!!error && !newNews.title ? t("admin.required") : ""}
          />
          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("admin.content")}
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            sx={{ mt: 2 }}
            error={!!error && !newNews.content}
            helperText={!!error && !newNews.content ? t("admin.required") : ""}
          />
          <TextField
            fullWidth
            label={t("admin.location")}
            value={newNews.location}
            onChange={(e) => setNewNews({ ...newNews, location: e.target.value })}
            sx={{ mt: 2 }}
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
            >
              {t('news.addImage')}
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={handleImageChange}
              />
            </Button>
            {newsImage && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('feedback.selectedFile')}: {newsImage.name}
              </Typography>
            )}
          </Box>
          <FormControlLabel
            control={
              <Checkbox
                checked={newNews.isFeatured}
                onChange={(e) => setNewNews({ ...newNews, isFeatured: e.target.checked })}
              />
            }
            label={t("admin.isFeatured")}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreateNewsDialog(false)}>
            {t("cancel")}
          </Button>
          <Button
            onClick={handleCreateNews}
            disabled={!newNews.title || !newNews.content || !newNews.communityId}
          >
            {t("create")}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
        <DialogTitle>{t("admin.editCommunity")}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label={t("admin.name")}
            value={editForm.name}
            onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
            sx={{ mt: 2 }}
            error={!!error && !editForm.name}
            helperText={
              !!error && !editForm.name ? t("admin.nameRequired") : ""
            }
          />
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              component="label"
            >
              {t('admin.uploadAvatar')}
              <input
                type="file"
                accept="image/jpeg,image/png"
                hidden
                onChange={(e) => handleAvatarChange(e, true)}
              />
            </Button>
            {editForm.avatarFile && (
              <Typography variant="body2" sx={{ mt: 1 }}>
                {t('feedback.selectedFile')}: {editForm.avatarFile.name}
              </Typography>
            )}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEditDialog(false)}>{t("cancel")}</Button>
          <Button onClick={handleEditCommunity} disabled={!editForm.name}>
            {t("save")}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default CommunitiesAdmin;