// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
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
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  CommunityServiceApi,
  CommunityResponse,
  CreateCommunityRequest,
  OperationType,
  NewsResponse,
  CreateNewsRequest,
} from "../../real_api/communityServiceApi";
import { Link } from "react-router-dom";
import { getAccessToken } from '../../../utils/tokenService';

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
    pointId: null,
    isFeatured: false,
  });
  const [editCommunity, setEditCommunity] = useState<CommunityResponse | null>(null);
  const [editForm, setEditForm] = useState({ name: "", avatarFile: null as File | null });
  const [newsImage, setNewsImage] = useState<File | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Загрузка сообществ для выпадающего списка
  const [availableCommunities, setAvailableCommunities] = useState<CommunityResponse[]>([]);
  
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

  // Загрузка списка сообществ для выбора
  const loadCommunitiesForSelect = useCallback(async () => {
    try {
      const response = await communityApi.community.getCommunity();
      if (response.data.body) {
        setAvailableCommunities(response.data.body);
      }
    } catch (err) {
      console.error('Error loading communities:', err);
    }
  }, []);

  useEffect(() => {
    loadCommunitiesForSelect();
  }, [loadCommunitiesForSelect]);

  // Остальные методы остаются без изменений...

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
        pointId: newNews.pointId || null,
        isFeatured: newNews.isFeatured,
      };

      if (newsImage) {
        const validationError = validateImage(newsImage);
        if (validationError) {
          setError(validationError);
          return;
        }
        const base64Image = await readFileAsBase64(newsImage);
        request.images!.push(base64Image);
      }
      
      const response = await communityApi.community.createNewsCreate(request);
      if (response.data.body) {
        setNews([...news, {
          newsId: response.data.body,
          communityId: newNews.communityId,
          title: newNews.title,
          content: newNews.content,
          photos: request.images || null,
          participants: [],
          location: newNews.location || null,
          pointId: newNews.pointId || null,
          isFeatured: newNews.isFeatured,
          createdAt: new Date().toISOString(),
        }]);
        setNewNews({
          communityId: "",
          title: "",
          content: "",
          images: [],
          location: "",
          pointId: null,
          isFeatured: false,
        });
        setNewsImage(null);
        setOpenCreateNewsDialog(false);
      }
    } catch (err: any) {
      setError(t("admin.errorCreatingNews") || err.message || "Error creating news");
    }
  }, [newNews, news, newsImage, t, readFileAsBase64, validateImage]);

  // Остальной код компонента...

  return (
    <Box sx={{ p: 3 }}>
      {/* ... существующие элементы ... */}
      
      <Dialog
        open={openCreateNewsDialog}
        onClose={() => setOpenCreateNewsDialog(false)}
      >
        <DialogTitle>{t("admin.createNews")}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth sx={{ mt: 2 }}>
            <InputLabel>{t("admin.community")} *</InputLabel>
            <Select
              value={newNews.communityId}
              onChange={(e) => setNewNews({ ...newNews, communityId: e.target.value })}
              label={`${t("admin.community")} *`}
              required
            >
              {availableCommunities.map((community) => (
                <MenuItem 
                  key={community.community?.id} 
                  value={community.community?.id}
                >
                  {community.community?.name || `Community ${community.community?.id}`}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            fullWidth
            label={t("admin.title")}
            value={newNews.title}
            onChange={(e) => setNewNews({ ...newNews, title: e.target.value })}
            sx={{ mt: 2 }}
            required
          />

          <TextField
            fullWidth
            multiline
            rows={4}
            label={t("admin.content")}
            value={newNews.content}
            onChange={(e) => setNewNews({ ...newNews, content: e.target.value })}
            sx={{ mt: 2 }}
            required
          />

          <TextField
            fullWidth
            label={t("admin.location")}
            value={newNews.location}
            onChange={(e) => setNewNews({ ...newNews, location: e.target.value })}
            sx={{ mt: 2 }}
          />

          <TextField
            fullWidth
            label="Point ID"
            value={newNews.pointId || ''}
            onChange={(e) => setNewNews({ ...newNews, pointId: e.target.value || null })}
            sx={{ mt: 2 }}
          />

          {/* Остальные поля формы */}
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
    </Box>
  );
};

export default CommunitiesAdmin;