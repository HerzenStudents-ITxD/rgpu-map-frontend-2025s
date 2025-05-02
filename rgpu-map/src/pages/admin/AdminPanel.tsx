import React from 'react';
import { Routes, Route, Navigate, Link } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import PointsAdmin from './PointsAdmin';
import UsersAdmin from './UsersAdmin';
import FeedbackTypesAdmin  from './FeedbackTypesAdmin'; // Named import
import { FeedbackAdmin } from './FeedbackAdmin'; // Named import

const AdminPanel: React.FC = () => {
  return (
    <Container maxWidth="lg" sx={{ padding: '20px' }}>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <Button
          component={Link}
          to="/admin/points"
          variant="contained"
        >
          Управление точками
        </Button>
        <Button
          component={Link}
          to="/admin/users"
          variant="contained"
        >
          Управление пользователями
        </Button>
        <Button
          component={Link}
          to="/admin/feedback"
          variant="contained"
        >
          Управление отзывами
        </Button>
        <Button
          component={Link}
          to="/admin/feedback-types"
          variant="contained"
        >
          Управление типами обратной связи
        </Button>
      </Box>

      <Routes>
        <Route path="/" element={<Navigate to="/admin/points" replace />} />
        <Route path="/points" element={<PointsAdmin />} />
        <Route path="/users" element={<UsersAdmin />} />
        <Route path="/feedback" element={<FeedbackAdmin />} />
        <Route path="/feedback-types" element={<FeedbackTypesAdmin />} />
      </Routes>
    </Container>
  );
};

export default AdminPanel;