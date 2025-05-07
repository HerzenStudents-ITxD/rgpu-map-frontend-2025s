import React, { useState } from 'react';
import { Container, Typography, AppBar, Tabs, Tab, Box } from '@mui/material';
import useAdminUsers from './useAdminUsers';
import { useAdminRoles } from './useAdminRoles';
import { useAdminCommunities } from './useAdminCommunities';
import { useAdminAgents } from './useAdminAgents';
import { useAdminPosts } from './useAdminPosts';
import UsersPage from './UsersPage';
import RolesPage from './RolesPage';
import CommunitiesPage from './CommunitiesPage';
import AgentsPage from './AgentsPage';
import PostsPage from './PostsPage';
import FeedbackAdmin from './FeedbackAdmin';
import FeedbackTypesAdmin from './FeedbackTypesAdmin';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  
  // Since UsersPage and RolesPage manage their own state with hooks,
  // we don't need to pass props to them
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
      </Box>
    </Container>
  );
};

export default AdminPanel;