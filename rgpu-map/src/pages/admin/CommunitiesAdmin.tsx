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
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  CommunityServiceApi,
  CommunityResponse,
  CreateCommunityRequest,
  OperationType,
} from "../../features/real_api/communityServiceApi";
import { Link } from "react-router-dom";

const communityApi = new CommunityServiceApi();

const CommunitiesAdmin = () => {
  const { t } = useTranslation();
  const [communities, setCommunities] = useState<CommunityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openCreateDialog, setOpenCreateDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [newCommunity, setNewCommunity] = useState({ name: "", avatarImage: "" });
  const [editCommunity, setEditCommunity] = useState<CommunityResponse | null>(null);
  const [editForm, setEditForm] = useState({ name: "", avatarImage: "" });

  useEffect(() => {
    fetchCommunities();
  }, []);

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