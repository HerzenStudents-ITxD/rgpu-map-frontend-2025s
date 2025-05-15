import React, { useState } from 'react';
import { Container, Typography, AppBar, Tabs, Tab, Box } from '@mui/material';
import useAdminUsers from '../features/admin/Users/useAdminUsers';
import { useAdminRoles } from '../features/admin/Roles/useAdminRoles';
import { useAdminCommunities } from '../features/admin/Communities/useAdminCommunities';
import { useAdminAgents } from '../features/admin/Agents/useAdminAgents';
import { useAdminPosts } from '../features/admin/Posts/useAdminPosts';
import UsersPage from '../features/admin/Users/UsersPage';
import RolesPage from '../features/admin/Roles/RolesPage';
import CommunitiesPage from '../features/admin/Communities/CommunitiesPage';
import AgentsPage from '../features/admin/Agents/AgentsPage';
import PostsPage from '../features/admin/Posts/PostsPage';
import FeedbackAdmin from '../features/admin/Feedback/FeedbackAdmin';
import FeedbackTypesAdmin from '../features/admin/Feedback/FeedbackTypesAdmin';
import PointsPage from '../features/admin/Points/PointsPage';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const AdminPanel: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  
  
  const {
    communities,
    loading: communitiesLoading,
    error: communitiesError,
    createCommunity,
    editCommunity,
    deleteCommunity
  } = useAdminCommunities();

  const {
    agents,
    loading: agentsLoading,
    error: agentsError,
    addAgent,
    deleteAgent
  } = useAdminAgents();

  const {
    posts,
    loading: postsLoading,
    error: postsError,
    createPost,
    editPost,
    deletePost
  } = useAdminPosts();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <AppBar position="static" color="default">
        <Tabs 
          value={activeTab} 
          onChange={handleTabChange} 
          indicatorColor="primary" 
          textColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab label="Users" />
          <Tab label="Roles" />
          <Tab label="Communities" />
          <Tab label="Agents" />
          <Tab label="Posts" />
          <Tab label="Feedback" />
          <Tab label="Feedback Types" />
          <Tab label="Points" />
        </Tabs>
      </AppBar>
      <Box sx={{ mt: 2 }}>
        {activeTab === 0 && <UsersPage />}
        {activeTab === 1 && <RolesPage />}
        {activeTab === 2 && (
          <CommunitiesPage
            communities={communities}
            loading={communitiesLoading}
            error={communitiesError}
            createCommunity={createCommunity}
            editCommunity={editCommunity}
            deleteCommunity={deleteCommunity}
          />
        )}
        {activeTab === 3 && (
          <AgentsPage
            agents={agents}
            loading={agentsLoading}
            error={agentsError}
            addAgent={addAgent}
            deleteAgent={deleteAgent}
          />
        )}
        {activeTab === 4 && (
          <PostsPage
            posts={posts}
            loading={postsLoading}
            error={postsError}
            createPost={createPost}
            editPost={editPost}
            deletePost={deletePost}
          />
        )}
        {activeTab === 5 && <FeedbackAdmin />}
        {activeTab === 6 && <FeedbackTypesAdmin />}
        {activeTab === 7 && <PointsPage />}
      </Box>
    </Container>
  );
};

export default AdminPanel;