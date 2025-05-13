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
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import { CommunityServiceApi } from '../../real_api/communityServiceApi';
import { NewsResponse, CreateNewsRequest } from '../../real_api/communityServiceApi';

interface PostsPageProps {
  posts: NewsResponse[];
  loading: boolean;
  error: string | null;
  createPost: (post: CreateNewsRequest) => Promise<void>;
  editPost: (newsId: string, updates: Partial<CreateNewsRequest>) => Promise<void>;
  deletePost: (newsId: string) => Promise<void>;
  refreshPosts: () => Promise<void>;
}

interface CommunityOption {
  id: string;
  name: string;
}

const PostsPage: React.FC<PostsPageProps> = ({ 
  posts, 
  loading, 
  error, 
  createPost, 
  editPost, 
  deletePost,
  refreshPosts 
}) => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsResponse | null>(null);
  const [communities, setCommunities] = useState<CommunityOption[]>([]);
  const [loadingCommunities, setLoadingCommunities] = useState(false);
  
  const [newPost, setNewPost] = useState<CreateNewsRequest>({ 
    communityId: '', 
    title: '', 
    text: '', 
    pointId: null 
  });

  useEffect(() => {
    const loadCommunities = async () => {
      setLoadingCommunities(true);
      try {
        const api = new CommunityServiceApi();
        const response = await api.community.getCommunity();
        const communitiesData = response.data.body?.map(c => ({
          id: c.community?.id || '',
          name: c.community?.name || 'Unnamed Community'
        })) || [];
        setCommunities(communitiesData);
      } catch (err) {
        console.error('Error loading communities:', err);
      } finally {
        setLoadingCommunities(false);
      }
    };
    loadCommunities();
  }, []);

  const handleCreate = async () => {
    try {
      await createPost(newPost);
      await refreshPosts();
      setOpenCreate(false);
      setNewPost({ communityId: '', title: '', text: '', pointId: null });
    } catch (err) {
      console.error('Create post error:', err);
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(search.toLowerCase()) || 
    post.text?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>Manage Posts</Typography>
      
      <Box sx={{ mb: 2, display: 'flex', gap: 2, alignItems: 'center' }}>
        <TextField
          label="Search Posts"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button 
          variant="contained" 
          onClick={() => setOpenCreate(true)}
          sx={{ minWidth: 140 }}
        >
          Create Post
        </Button>
      </Box>

      <Dialog open={openCreate} onClose={() => setOpenCreate(false)} maxWidth="md" fullWidth>
        <DialogTitle>Create New Post</DialogTitle>
        <DialogContent dividers>
          <Box component="form" sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Community *</InputLabel>
              {loadingCommunities ? (
                <CircularProgress size={24} sx={{ mt: 2 }} />
              ) : (
                <Select
                  value={newPost.communityId}
                  onChange={(e) => setNewPost({...newPost, communityId: e.target.value})}
                  required
                  label="Community *"
                >
                  {communities.map(community => (
                    <MenuItem key={community.id} value={community.id}>
                      {community.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Title *"
              value={newPost.title}
              onChange={(e) => setNewPost({...newPost, title: e.target.value})}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Content *"
              value={newPost.text}
              onChange={(e) => setNewPost({...newPost, text: e.target.value})}
              sx={{ mb: 3 }}
              required
            />

            <TextField
              fullWidth
              label="Point ID"
              value={newPost.pointId || ''}
              onChange={(e) => setNewPost({...newPost, pointId: e.target.value})}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button 
            onClick={handleCreate}
            variant="contained"
            disabled={!newPost.communityId || !newPost.title || !newPost.text}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog open={openEdit} onClose={() => setOpenEdit(false)} maxWidth="md" fullWidth>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent dividers>
          {selectedPost && (
            <Box component="form" sx={{ mt: 2 }}>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Community *</InputLabel>
                <Select
                  value={selectedPost.communityId}
                  onChange={(e) => setSelectedPost({
                    ...selectedPost,
                    communityId: e.target.value
                  })}
                  required
                  label="Community *"
                >
                  {communities.map(community => (
                    <MenuItem key={community.id} value={community.id}>
                      {community.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                fullWidth
                label="Title *"
                value={selectedPost.title}
                onChange={(e) => setSelectedPost({
                  ...selectedPost,
                  title: e.target.value
                })}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                multiline
                rows={4}
                label="Content *"
                value={selectedPost.text}
                onChange={(e) => setSelectedPost({
                  ...selectedPost,
                  text: e.target.value
                })}
                sx={{ mb: 3 }}
                required
              />

              <TextField
                fullWidth
                label="Point ID"
                value={selectedPost.pointId || ''}
                onChange={(e) => setSelectedPost({
                  ...selectedPost,
                  pointId: e.target.value
                })}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button 
            onClick={async () => {
              if (selectedPost?.newsId) {
                await editPost(selectedPost.newsId, {
                  communityId: selectedPost.communityId,
                  title: selectedPost.title,
                  text: selectedPost.text,
                  pointId: selectedPost.pointId
                });
                await refreshPosts();
                setOpenEdit(false);
              }
            }}
            variant="contained"
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {loading ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : error ? (
        <Typography color="error">{error}</Typography>
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Community</TableCell>
              <TableCell>Point ID</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map(post => (
              <TableRow key={post.newsId}>
                <TableCell>{post.title || 'N/A'}</TableCell>
                <TableCell>
                  {communities.find(c => c.id === post.communityId)?.name || 'N/A'}
                </TableCell>
                <TableCell>{post.pointId || 'N/A'}</TableCell>
                <TableCell>
                  <Button onClick={() => {
                    setSelectedPost(post);
                    setOpenEdit(true);
                  }}>
                    Edit
                  </Button>
                  <Button 
                    color="error" 
                    onClick={() => post.newsId && deletePost(post.newsId)}
                  >
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Box>
  );
};

export default PostsPage;