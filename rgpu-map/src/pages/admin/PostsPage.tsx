import React, { useState } from 'react';
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
  FormControlLabel,
  Checkbox 
} from '@mui/material';
import { NewsResponse } from '../../features/real_api/communityServiceApi';
import { CreateNewsRequest } from '../../features/real_api/communityServiceApi';

interface PostsPageProps {
  posts: NewsResponse[];
  loading: boolean;
  error: string | null;
  createPost: (post: CreateNewsRequest) => Promise<void>;
  editPost: (newsId: string, updates: Partial<CreateNewsRequest>) => Promise<void>;
  deletePost: (newsId: string) => Promise<void>;
}

const PostsPage: React.FC<PostsPageProps> = ({ posts, loading, error, createPost, editPost, deletePost }) => {
  const [search, setSearch] = useState('');
  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedPost, setSelectedPost] = useState<NewsResponse | null>(null);
  const [newPost, setNewPost] = useState<CreateNewsRequest>({ communityId: '', title: '', content: '', isFeatured: false });

  const filteredPosts = posts.filter(post => 
    post.title?.toLowerCase().includes(search.toLowerCase()) || 
    post.content?.toLowerCase().includes(search.toLowerCase())
  );

  const handleCreate = async () => {
    await createPost(newPost);
    setOpenCreate(false);
    setNewPost({ communityId: '', title: '', content: '', isFeatured: false });
  };

  const handleEdit = async () => {
    if (selectedPost?.newsId) {
      await editPost(selectedPost.newsId, { 
        title: selectedPost.title || '', 
        content: selectedPost.content || '', 
        isFeatured: selectedPost.isFeatured,
        communityId: selectedPost.communityId || ''
      });
      setOpenEdit(false);
      setSelectedPost(null);
    }
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom>Manage Posts</Typography>
      {error && <Typography color="error">{error}</Typography>}
      <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
        <TextField
          label="Search Posts"
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          fullWidth
        />
        <Button variant="contained" onClick={() => setOpenCreate(true)}>
          Create Post
        </Button>
      </Box>
      {loading ? (
        <CircularProgress />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Title</TableCell>
              <TableCell>Community ID</TableCell>
              <TableCell>Featured</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredPosts.map(post => (
              <TableRow key={post.newsId}>
                <TableCell>{post.title || 'N/A'}</TableCell>
                <TableCell>{post.communityId || 'N/A'}</TableCell>
                <TableCell>{post.isFeatured ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <Button onClick={() => { setSelectedPost(post); setOpenEdit(true); }}>
                    Edit
                  </Button>
                  <Button color="error" onClick={() => post.newsId && deletePost(post.newsId)}>
                    Delete
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {/* Create Post Dialog */}
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create Post</DialogTitle>
        <DialogContent>
          <TextField
            label="Community ID"
            fullWidth
            margin="dense"
            value={newPost.communityId}
            onChange={(e) => setNewPost({ ...newPost, communityId: e.target.value })}
          />
          <TextField
            label="Title"
            fullWidth
            margin="dense"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <TextField
            label="Content"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={newPost.content}
            onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={newPost.isFeatured}
                onChange={(e) => setNewPost({ ...newPost, isFeatured: e.target.checked })}
              />
            }
            label="Is Featured"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreate} variant="contained">Create</Button>
        </DialogActions>
      </Dialog>

      {/* Edit Post Dialog */}
      <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          {selectedPost && (
            <>
              <TextField
                label="Title"
                fullWidth
                margin="dense"
                value={selectedPost.title || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value })}
              />
              <TextField
                label="Content"
                fullWidth
                margin="dense"
                multiline
                rows={4}
                value={selectedPost.content || ''}
                onChange={(e) => setSelectedPost({ ...selectedPost, content: e.target.value })}
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedPost.isFeatured}
                    onChange={(e) => setSelectedPost({ ...selectedPost, isFeatured: e.target.checked })}
                  />
                }
                label="Is Featured"
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
          <Button onClick={handleEdit} variant="contained">Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default PostsPage;