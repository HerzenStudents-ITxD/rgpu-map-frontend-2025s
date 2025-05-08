import { useState, useEffect } from "react";
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
  const [newCommunity, setNewCommunity] = useState({ name: "", avatarImage: "" });
  const [newNews, setNewNews] = useState<CreateNewsRequest>({
    communityId: "",
    title: "",
    content: "",
    images: null,
    location: "",
    isFeatured: false,
  });
  const [editCommunity, setEditCommunity] = useState<CommunityResponse | null>(null);
  const [editForm, setEditForm] = useState({ name: "", avatarImage: "" });

  useEffect(() => {
    if (activeTab === 0) {
      fetchCommunities();
    } else {
      fetchNews();
    }
  }, [activeTab]);

  const fetchCommunities = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityApi.community.getCommunity();
      if (response.data.body) {
        setCommunities(response.data.body);
      } else {
        setError(t("admin.errorFetchingCommunities") || "Failed to fetch communities");
      }
    } catch (err) {
      setError(t("admin.errorFetchingCommunities") || "Error fetching communities");
    } finally {
      setLoading(false);
    }
  };

  const fetchNews = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await communityApi.community.newsList();
      if (response.data.body) {
        setNews(response.data.body);
      } else {
        setError(t("admin.errorFetchingNews") || "Failed to fetch news");
      }
    } catch (err) {
      setError(t("admin.errorFetchingNews") || "Error fetching news");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCommunity = async () => {
    try {
      setError(null);
      if (!newCommunity.name.trim()) {
        setError(t("admin.nameRequired") || "Community name is required");
        return;
      }
      const request: CreateCommunityRequest = {
        name: newCommunity.name.trim(),
        avatarImage: newCommunity.avatarImage.trim() || undefined,
      };
      const response = await communityApi.community.createCommunity(request);
      if (response.data.body) {
        setCommunities([
          ...communities,
          {
            community: {
              id: response.data.body,
              name: request.name,
              avatar: request.avatarImage,
              isHidden: false,
            },
          },
        ]);
        setNewCommunity({ name: "", avatarImage: "" });
        setOpenCreateDialog(false);
      } else {
        setError(t("admin.errorCreatingCommunity") || "Failed to create community");
      }
    } catch (err) {
      setError(t("admin.errorCreatingCommunity") || "Error creating community");
    }
  };

  const handleCreateNews = async () => {
    try {
      setError(null);
      if (!newNews.title.trim() || !newNews.content.trim()) {
        setError(t("admin.titleAndContentRequired") || "Title and content are required");
        return;
      }
      
      const response = await communityApi.community.createNewsCreate({
        communityId: newNews.communityId,
        title: newNews.title,
        content: newNews.content,
        images: newNews.images,
        location: newNews.location,
        isFeatured: newNews.isFeatured,
      });
      
      if (response.data.body) {
        setNews([...news, {
          newsId: response.data.body,
          communityId: newNews.communityId,
          title: newNews.title,
          content: newNews.content,
          photos: newNews.images || null,
          participants: [],
          location: newNews.location || null,
          isFeatured: newNews.isFeatured,
          createdAt: new Date().toISOString(),
        }]);
        setNewNews({
          communityId: "",
          title: "",
          content: "",
          images: null,
          location: "",
          isFeatured: false,
        });
        setOpenCreateNewsDialog(false);
      } else {
        setError(t("admin.errorCreatingNews") || "Failed to create news");
      }
    } catch (err) {
      setError(t("admin.errorCreatingNews") || "Error creating news");
    }
  };

  const handleEditCommunity = async () => {
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
          value: editForm.avatarImage.trim() || null,
        },
      ];
      const response = await communityApi.community.editPartialUpdate(
        operations,
        { communityId: editCommunity.community.id }
      );
      if (response.data.body) {
        setCommunities(
          communities.map((c) =>
            c.community?.id === editCommunity.community?.id
              ? {
                  ...c,
                  community: {
                    ...c.community,
                    name: editForm.name,
                    avatar: editForm.avatarImage,
                  },
                }
              : c
          )
        );
        setOpenEditDialog(false);
        setEditCommunity(null);
        setEditForm({ name: "", avatarImage: "" });
      } else {
        setError(t("admin.errorUpdatingCommunity") || "Failed to update community");
      }
    } catch (err) {
      setError(t("admin.errorUpdatingCommunity") || "Error updating community");
    }
  };

  const handleSoftDeleteCommunity = async (communityId: string) => {
    try {
      setError(null);
      const response = await communityApi.community.softdeleteDelete({
        communityId,
      });
      if (response.data.body) {
        setCommunities(
          communities.map((c) =>
            c.community?.id === communityId
              ? { ...c, community: { ...c.community, isHidden: true } }
              : c
          )
        );
      } else {
        setError(t("admin.errorDeletingCommunity") || "Failed to delete community");
      }
    } catch (err) {
      setError(t("admin.errorDeletingCommunity") || "Error deleting community");
    }
  };

  const handleOpenEditDialog = (community: CommunityResponse) => {
    if (community.community?.id) {
      setEditCommunity(community);
      setEditForm({
        name: community.community.name || "",
        avatarImage: community.community.avatar || "",
      });
      setOpenEditDialog(true);
    } else {
      setError(t("admin.invalidCommunity") || "Invalid community selected");
    }
  };

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
                    <TableRow key={community.community?.id}>
                      <TableCell>{community.community?.id || "N/A"}</TableCell>
                      <TableCell>{community.community?.name || "N/A"}</TableCell>
                      <TableCell>{community.community?.avatar || "N/A"}</TableCell>
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
                    <TableRow key={item.newsId}>
                      <TableCell>{item.title}</TableCell>
                      <TableCell>{item.content}</TableCell>
                      <TableCell>{item.communityId}</TableCell>
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

      {/* Create Community Dialog */}
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
          <TextField
            fullWidth
            label={t("admin.avatar")}
            value={newCommunity.avatarImage}
            onChange={(e) =>
              setNewCommunity({ ...newCommunity, avatarImage: e.target.value })
            }
            sx={{ mt: 2 }}
          />
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

      {/* Create News Dialog */}
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
            SelectProps={{
              native: true,
            }}
          >
            <option value=""></option>
            {communities.map((community) => (
              <option key={community.community?.id} value={community.community?.id}>
                {community.community?.name}
              </option>
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

      {/* Edit Community Dialog */}
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
          <TextField
            fullWidth
            label={t("admin.avatar")}
            value={editForm.avatarImage}
            onChange={(e) =>
              setEditForm({ ...editForm, avatarImage: e.target.value })
            }
            sx={{ mt: 2 }}
          />
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