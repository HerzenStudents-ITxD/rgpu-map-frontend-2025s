import { useState, useEffect } from 'react';
import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Paper,
  Pagination,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  FeedbackResponse,
  FeedbackServiceApi,
  FeedbackStatusType,
  EditFeedbackStatusesRequest,
  TypeResponse,
} from './../../features/real_api/feedbackServiceApi';

const feedbackApi = new FeedbackServiceApi();

export const FeedbackAdmin = () => {
  const { t } = useTranslation();
  const [feedbacks, setFeedbacks] = useState<FeedbackResponse[]>([]);
  const [types, setTypes] = useState<TypeResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState<FeedbackStatusType | ''>('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchTypes();
    fetchFeedbacks();
  }, [page, statusFilter]);

  const fetchTypes = async () => {
    try {
      const response = await feedbackApi.type.getType();
      if (response.data.body) {
        setTypes(response.data.body);
      }
    } catch (err) {
      console.error('Error fetching types:', err);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      setError(null);
      const query = {
        feedbackstatus: statusFilter || undefined,
        feedbacktypeids: [],
        orderbydescending: false,
        page,
        pageSize,
        skipcount: (page - 1) * pageSize,
        takecount: pageSize,
        IsCancellationRequested: false,
        CanBeCanceled: true,
        'WaitHandle.Handle': {},
        'WaitHandle.SafeWaitHandle.IsInvalid': false,
        'WaitHandle.SafeWaitHandle.IsClosed': false,
      };
      const response = await feedbackApi.feedback.findList(query);
      if (response.data.body) {
        setFeedbacks(response.data.body);
        setTotalPages(Math.ceil(response.data.totalCount / pageSize));
      } else {
        setError(t('feedback.fetchFailed') || 'Failed to fetch feedbacks');
      }
    } catch (err) {
      setError(t('feedback.fetchFailed') || 'Error fetching feedbacks');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (feedbackId: string, newStatus: FeedbackStatusType) => {
    try {
      setError(null);
      const request: EditFeedbackStatusesRequest = {
        feedbackIds: [feedbackId],
        status: newStatus,
      };
      const response = await feedbackApi.feedback.editFeedbackStatuses(request);
      if (response.data.body) {
        setFeedbacks((prev) =>
          prev.map((f) =>
            f.feedback.id === feedbackId
              ? { ...f, feedback: { ...f.feedback, status: newStatus } }
              : f
          )
        );
      } else {
        setError(t('feedback.statusUpdateFailed') || 'Failed to update status');
      }
    } catch (err) {
      setError(t('feedback.statusUpdateFailed') || 'Error updating status');
      console.error(err);
    }
  };

  const handlePageChange = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setPage(newPage);
  };

  const getDisplayTypes = (typeIds: string[] | null) => {
    if (!typeIds || typeIds.length === 0) return 'N/A';
    return typeIds
      .map((id) => {
        const type = types.find((t) => t.id === id);
        if (!type || !type.name) return 'Unknown';
        try {
          const translations = JSON.parse(type.name);
          return translations[t('i18n.language')] || translations['en'] || translations['ru'] || 'Unknown';
        } catch {
          return 'Unknown';
        }
      })
      .join(', ');
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('feedback.admin.title') || 'Feedback Management'}
      </Typography>
      <Box sx={{ mb: 2 }}>
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel>{t('feedback.status') || 'Status'}</InputLabel>
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as FeedbackStatusType | '')}
            label={t('feedback.status') || 'Status'}
          >
            <MenuItem value="">{t('feedback.all') || 'All'}</MenuItem>
            <MenuItem value={FeedbackStatusType.New}>{t('feedback.new') || 'New'}</MenuItem>
            <MenuItem value={FeedbackStatusType.Archived}>{t('feedback.archived') || 'Archived'}</MenuItem>
          </Select>
        </FormControl>
      </Box>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('feedback.id') || 'ID'}</TableCell>
                  <TableCell>{t('feedback.content') || 'Content'}</TableCell>
                  <TableCell>{t('feedback.email') || 'Email'}</TableCell>
                  <TableCell>{t('feedback.types') || 'Types'}</TableCell>
                  <TableCell>{t('feedback.status') || 'Status'}</TableCell>
                  <TableCell>{t('feedback.createdAt') || 'Created At'}</TableCell>
                  <TableCell>{t('feedback.imagesCount') || 'Images'}</TableCell>
                  <TableCell>{t('feedback.actions') || 'Actions'}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {feedbacks.map((feedback) => (
                  <TableRow key={feedback.feedback.id}>
                    <TableCell>{feedback.feedback.id}</TableCell>
                    <TableCell>{feedback.feedback.content || 'N/A'}</TableCell>
                    <TableCell>{feedback.feedback.senderEmail || 'N/A'}</TableCell>
                    <TableCell>{getDisplayTypes(feedback.feedback.typeIds)}</TableCell>
                    <TableCell>
                      {feedback.feedback.status === FeedbackStatusType.New
                        ? t('feedback.new') || 'New'
                        : t('feedback.archived') || 'Archived'}
                    </TableCell>
                    <TableCell>
                      {feedback.feedback.createdAtUtc
                        ? new Date(feedback.feedback.createdAtUtc).toLocaleString()
                        : 'N/A'}
                    </TableCell>
                    <TableCell>{feedback.feedback.imagesCount || 0}</TableCell>
                    <TableCell>
                      <Select
                        value={feedback.feedback.status || FeedbackStatusType.New}
                        onChange={(e) =>
                          handleStatusChange(
                            feedback.feedback.id!,
                            e.target.value as FeedbackStatusType
                          )
                        }
                        size="small"
                      >
                        <MenuItem value={FeedbackStatusType.New}>
                          {t('feedback.new') || 'New'} (0)
                        </MenuItem>
                        <MenuItem value={FeedbackStatusType.Archived}>
                          {t('feedback.archived') || 'Archived'} (1)
                        </MenuItem>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={totalPages}
              page={page}
              onChange={handlePageChange}
              color="primary"
            />
          </Box>
        </>
      )}
    </Box>
  );
};

export default FeedbackAdmin;