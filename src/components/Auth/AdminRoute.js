// src/components/Auth/AdminRoute.js
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { AdminPanelSettings, Home } from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <Container maxWidth="sm" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Verifying admin access...
        </Typography>
      </Container>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Paper sx={{ p: 6, textAlign: 'center' }}>
          <AdminPanelSettings 
            sx={{ fontSize: 80, color: 'error.main', mb: 2 }} 
          />
          
          <Typography variant="h4" gutterBottom color="error.main">
            Access Denied
          </Typography>
          
          <Typography variant="h6" color="text.secondary" sx={{ mb: 3 }}>
            You need administrator privileges to access this area.
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            This section is restricted to authorized administrators only.
            If you believe you should have access, please contact your system administrator.
          </Typography>

          <Button
            variant="contained"
            startIcon={<Home />}
            href="/"
            sx={{ px: 4 }}
          >
            Return to Home
          </Button>
        </Paper>
      </Container>
    );
  }

  return children;
};

export default AdminRoute;