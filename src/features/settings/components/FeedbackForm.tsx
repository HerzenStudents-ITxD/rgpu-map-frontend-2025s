import { useState, useEffect } from 'react';
import {
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  ListItemText,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { FeedbackServiceApi, FeedbackStatusType, CreateFeedbackRequest, ImageContent, TypeResponse } from '../../real_api/feedbackServiceApi';
import { FeedbackFormData } from '../types';
import { useSettings } from '../hooks/useSettings';

interface FeedbackFormProps {
  open: boolean;
  onClose: () => void;
}

const feedbackApi = new FeedbackServiceApi();

export const FeedbackForm = ({ open, onClose }: FeedbackFormProps) => {
  const { t, i18n } = useTranslation();
  const { profile, loading } = useSettings();
  const [form, setForm] = useState<FeedbackFormData>({
    subject: '',
    message: '',
    contact: '',
  });
  const [selectedSections, setSelectedSections] = useState<string[]>([]);
  const [image, setImage] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedbackTypes, setFeedbackTypes] = useState<TypeResponse[]>([]);
  const [typesLoading, setTypesLoading] = useState(true);

  useEffect(() => {
    const fetchFeedbackTypes = async () => {
      try {
        setTypesLoading(true);
        const response = await feedbackApi.type.getType();
        if (response.data.body) {
          setFeedbackTypes(response.data.body.filter(type => type.isActive));
        } else {
          setError(t('feedback.fetchTypesFailed') || 'Failed to fetch feedback types');
        }
      } catch (err) {
        setError(t('feedback.fetchTypesFailed') || 'Error fetching feedback types');
        console.error(err);
      } finally {
        setTypesLoading(false);
      }
    };
    fetchFeedbackTypes();
  }, [t]);

  const getDisplayName = (type: TypeResponse): string => {
    try {
      const translations = JSON.parse(type.name || '{}');
      return translations[i18n.language] || translations['en'] || translations['ru'] || 'Unknown';
    } catch (err) {
      console.error('Error parsing type name:', err);
      return 'Unknown';
    }
  };

  const handleSectionChange = (event: any) => {
    setSelectedSections(event.target.value as string[]);
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      if (file.size > 5 * 1024 * 1024) {
        setError(t('feedback.imageSizeError') || 'Image size exceeds 5MB limit');
        return;
      }
      setImage(file);
    }
  };

  const isValidUUID = (str: string | null | undefined): boolean => {
    if (!str) return false;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(str);
  };

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      setError(null);

      if (!profile) {
        setError(t('feedback.profileNotLoaded') || 'User profile is not loaded');
        return;
      }

      if (!form.message.trim()) {
        setError(t('feedback.contentRequired') || 'Message is required');
        return;
      }

      const emailToSend = form.contact && isValidEmail(form.contact) ? form.contact : profile.email;
      if (!emailToSend || !isValidEmail(emailToSend)) {
        setError(t('feedback.emailRequired') || 'Valid email is required');
        return;
      }

      const typeIds = selectedSections.length > 0
        ? selectedSections
        : [feedbackTypes.find(type => JSON.parse(type.name || '{}').ru === 'Другое')?.id || '00000000-0000-0000-0000-000000000001'];

      let imageContent: ImageContent[] = [];
      if (image) {
        const base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(image);
        });
        const extension = image.name.split('.').pop()?.toLowerCase() || null;
        imageContent = [{
          name: image.name,
          content: base64Image.split(',')[1],
          extension: extension,
        }];
      }

      const feedbackRequest: CreateFeedbackRequest = {
        typeIds,
        content: form.message.trim(),
        status: FeedbackStatusType.New === 'New' ? 0 : 1,
        email: emailToSend,
        feedbackImages: imageContent,
        user: {
          id: isValidUUID(profile.id) ? profile.id : '00000000-0000-0000-0000-000000000000',
          firstName: profile.name || 'Unknown User',
          lastName: profile.lastName || 'Unknown User',
          middleName: null,
        },
      };

      console.log('Sending feedback request:', JSON.stringify(feedbackRequest, null, 2));

      const response = await feedbackApi.feedback.createFeedback(feedbackRequest);
      if (response.data.body) {
        setForm({ subject: '', message: '', contact: '' });
        setSelectedSections([]);
        setImage(null);
        onClose();
      } else {
        setError(t('feedback.submitFailed') || 'Failed to submit feedback');
      }
    } catch (err) {
      let errorMessage = t('feedback.error') || 'An error occurred';
      if (err instanceof Error) {
        if (err.message.includes('Failed to fetch')) {
          errorMessage = t('feedback.submitFailed') || 'Failed to submit feedback due to server error. Please try again later.';
        } else {
          errorMessage = err.message;
        }
      }
      setError(errorMessage);
      console.error('Feedback submission error:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const emailValid = form.contact ? isValidEmail(form.contact) : (profile?.email && isValidEmail(profile.email));
    return selectedSections.length > 0 && emailValid && form.message.trim() && !!profile;
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ textAlign: 'center' }}>
        <Typography variant="h6">{t('settings.feedback')}</Typography>
      </DialogTitle>
      <DialogContent>
        {(loading || typesLoading) && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}
        {!(loading || typesLoading) && (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 1 }}>
              <Typography sx={{ color: '#f44336', mr: 0.5 }}>*</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
                {t('feedback.selectSection')}
              </Typography>
            </Box>
            <FormControl fullWidth sx={{ mt: 0, mb: 2 }}>
              <Select
                multiple
                value={selectedSections}
                onChange={handleSectionChange}
                renderValue={(selected) => feedbackTypes
                  .filter(type => selected.includes(type.id!))
                  .map(type => getDisplayName(type))
                  .join(', ')
                }
                sx={{ height: '50px', borderRadius: '8px' }}
                variant="outlined"
                displayEmpty
              >
                {feedbackTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    <Checkbox checked={selectedSections.indexOf(type.id!) > -1} />
                    <ListItemText primary={getDisplayName(type)} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 0, mb: 0 }}>
              <Typography sx={{ color: '#f44336', mr: 0.5 }}>*</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
                {t('feedback.email')}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label={t('feedback.emailPlaceholder')}
              value={form.contact}
              onChange={(e) => setForm({ ...form, contact: e.target.value })}
              sx={{ mt: 1, mb: 1, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              required
              type="email"
              InputLabelProps={{ required: false }}
              helperText={form.contact && !isValidEmail(form.contact) ? t('feedback.invalidEmail') || 'Invalid email format' : ''}
              error={form.contact ? !isValidEmail(form.contact) : false}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 0 }}>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
                {t('feedback.photoLabel')}
              </Typography>
            </Box>
            <Box sx={{ mt: 1, mb: 2 }}>
              <Button
                variant="outlined"
                component="label"
                sx={{ borderRadius: '8px' }}
              >
                {t('feedback.uploadButton')}
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageChange}
                />
              </Button>
              {image && (
                <Typography variant="body2" sx={{ mt: 1 }}>
                  {t('feedback.selectedFile')}: {image.name}
                </Typography>
              )}
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2, mb: 0 }}>
              <Typography sx={{ color: '#f44336', mr: 0.5 }}>*</Typography>
              <Typography sx={{ fontSize: '0.875rem', fontWeight: 400 }}>
                {t('feedback.describeIssue')}
              </Typography>
            </Box>
            <TextField
              fullWidth
              label={t('feedback.messagePlaceholder')}
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              sx={{ mt: 1, mb: 2, '& .MuiOutlinedInput-root': { borderRadius: '8px' } }}
              multiline
              rows={4}
              required
              InputLabelProps={{ required: false }}
              helperText={!form.message.trim() && form.message ? t('feedback.contentRequired') || 'Message is required' : ''}
              error={!form.message.trim() && !!form.message}
            />
            {error && (
              <Typography color="error" variant="body2" sx={{ mt: 1 }}>
                {error}
              </Typography>
            )}
          </>
        )}
      </DialogContent>
      <DialogActions sx={{ justifyContent: 'space-between', px: 2 }}>
        <Button onClick={onClose} variant="outlined" sx={{ borderRadius: '8px' }}>
          {t('cancel')}
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          color="primary"
          disabled={!isFormValid() || loading || isSubmitting || typesLoading}
          sx={{ borderRadius: '8px' }}
        >
          {isSubmitting ? <CircularProgress size={24} /> : t('continue')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};