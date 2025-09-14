// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Clear error when user starts typing
  useEffect(() => {
    if (error && (formData.email || formData.password)) {
      const timer = setTimeout(() => {
        setError('');
      }, 5000); // Small delay to allow user to see the error
      
      return () => clearTimeout(timer);
    }
  }, [formData.email, formData.password, error]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing (alternative approach)
    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation(); // Prevent any event bubbling
    
    // Clear any previous errors
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      navigate(from, { replace: true });
    } catch (error) {
      console.error('Login error:', error); // Debug log
      
      // Extract error message
      let errorMessage = 'Login failed. Please try again.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Handle form validation
  const isFormValid = formData.email.trim() && formData.password.trim();

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <Paper 
        sx={{ 
          p: 4,
          background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.05) 0%, rgba(26, 26, 26, 0.95) 100%)',
          border: '1px solid rgba(255, 215, 0, 0.2)',
          borderRadius: 3
        }}
      >
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            color="primary"
            sx={{ 
              fontWeight: 'bold',
              letterSpacing: '2px',
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
              mb: 2
            }}
          >
            KeyZone
          </Typography>
          <Typography 
            variant="h4" 
            gutterBottom
            sx={{ 
              color: 'text.primary',
              fontWeight: 500
            }}
          >
            Sign In
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Welcome back to your digital marketplace
          </Typography>
        </Box>

        {/* Persistent Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                fontSize: '1rem',
                fontWeight: 500
              },
              '& .MuiAlert-icon': {
                fontSize: '1.5rem'
              },
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 2
            }}
            onClose={() => setError('')} // Allow manual dismissal
          >
            {error}
          </Alert>
        )}

        {/* Success message from registration */}
        {location.state?.message && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 2
            }}
          >
            {location.state.message}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          noValidate // Prevent browser validation
          autoComplete="on"
        >
          <TextField
            fullWidth
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
            error={error && error.toLowerCase().includes('email')}
            sx={{ 
              mb: 3,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
              }
            }}
            helperText={error && error.toLowerCase().includes('email') ? error : ''}
          />

          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
            error={error && error.toLowerCase().includes('password')}
            sx={{ 
              mb: 4,
              '& .MuiOutlinedInput-root': {
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 215, 0, 0.5)',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'primary.main',
                  borderWidth: '2px',
                },
              }
            }}
            helperText={error && error.toLowerCase().includes('password') ? error : ''}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isFormValid}
            sx={{ 
              mb: 3,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 2,
              backgroundColor: 'primary.main',
              color: 'black',
              '&:hover': {
                backgroundColor: '#FFA000',
                transform: 'translateY(-2px)',
                boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
              },
              '&:disabled': {
                backgroundColor: 'grey.600',
                color: 'grey.400',
                transform: 'none'
              }
            }}
          >
            {loading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={20} sx={{ mr: 1, color: 'inherit' }} />
                Signing In...
              </Box>
            ) : (
              'Sign In'
            )}
          </Button>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                style={{ 
                  color: '#FFD700',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign Up Here
              </Link>
            </Typography>
            
            {/* Additional helpful text */}
            <Typography variant="caption" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
              Having trouble? Make sure your email and password are correct.
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Login;