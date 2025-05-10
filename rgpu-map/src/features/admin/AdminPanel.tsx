import React, { useState } from 'react';
import { Container, Typography, AppBar, Tabs, Tab, Box } from '@mui/material';
import useAdminUsers from './useAdminUsers';
import { useAdminRoles } from './Roles/useAdminRoles';
import { useAdminCommunities } from './Communities/useAdminCommunities';
import { useAdminAgents } from './Agents/useAdminAgents';
import { useAdminPosts } from './Posts/useAdminPosts';
import UsersPage from './Users/UsersPage';
import RolesPage from './Roles/RolesPage';
import CommunitiesPage from './Communities/CommunitiesPage';
import AgentsPage from './Agents/AgentsPage';
import PostsPage from './Posts/PostsPage';
import FeedbackAdmin from './Feedback/FeedbackAdmin';
import FeedbackTypesAdmin from './Feedback/FeedbackTypesAdmin';
import PointsPage from './PointsPage';

const AdminPanel: React.FC = () => {
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