// src/pages/Register.js
import React, { useState, useEffect } from 'react';
import {
  Container, Paper, TextField, Button, Typography, Box, Alert, Grid, CircularProgress
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone_number: '',
    address: {
      street: '',
      city: '',
      state: '',
      postal_code: '',
      country: ''
    }
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  // Clear error when user starts typing
  useEffect(() => {
    if (error) {
      const timer = setTimeout(() => {
        setError('');
      }, 100);
      
      return () => clearTimeout(timer);
    }
  }, [formData, error]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
    
    if (name.includes('address.')) {
      const addressField = name.split('.')[1];
      setFormData({
        ...formData,
        address: { ...formData.address, [addressField]: value }
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validateForm = () => {
    if (!formData.username.trim()) {
      setError('Username is required');
      return false;
    }
    
    if (!formData.email.trim()) {
      setError('Email is required');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Please enter a valid email address');
      return false;
    }
    
    if (!formData.password) {
      setError('Password is required');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (!formData.phone_number.trim()) {
      setError('Phone number is required');
      return false;
    }
    
    if (!formData.address.street.trim()) {
      setError('Street address is required');
      return false;
    }
    
    if (!formData.address.city.trim()) {
      setError('City is required');
      return false;
    }
    
    if (!formData.address.state.trim()) {
      setError('State is required');
      return false;
    }
    
    if (!formData.address.postal_code.trim()) {
      setError('Postal code is required');
      return false;
    }
    
    if (!formData.address.country.trim()) {
      setError('Country is required');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Clear previous messages
    setError('');
    setSuccess('');

    // Validate form
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const registrationData = {
        username: formData.username.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        phone_number: formData.phone_number.trim(),
        address: {
          street: formData.address.street.trim(),
          city: formData.address.city.trim(),
          state: formData.address.state.trim(),
          postal_code: formData.address.postal_code.trim(),
          country: formData.address.country.trim()
        }
      };

      await register(registrationData);
      
      setSuccess('Registration successful! Redirecting to login...');
      
      // Redirect after showing success message
      setTimeout(() => {
        navigate('/login', { 
          state: { message: 'Registration successful! Please sign in with your credentials.' } 
        });
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error);
      
      let errorMessage = 'Registration failed. Please try again.';
      
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

  // Check if form is valid for button state
  const isFormValid = formData.username.trim() && 
                     formData.email.trim() && 
                     formData.password && 
                     formData.confirmPassword && 
                     formData.phone_number.trim() &&
                     formData.address.street.trim() &&
                     formData.address.city.trim() &&
                     formData.address.state.trim() &&
                     formData.address.postal_code.trim() &&
                     formData.address.country.trim();

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
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
            Create Account
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
            sx={{ mt: 1 }}
          >
            Join the premium digital marketplace
          </Typography>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3,
              '& .MuiAlert-message': {
                fontSize: '1rem',
                fontWeight: 500
              },
              border: '1px solid rgba(244, 67, 54, 0.3)',
              borderRadius: 2
            }}
            onClose={() => setError('')}
          >
            {error}
          </Alert>
        )}

        {/* Success Alert */}
        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              mb: 3,
              border: '1px solid rgba(76, 175, 80, 0.3)',
              borderRadius: 2
            }}
          >
            {success}
          </Alert>
        )}

        <Box 
          component="form" 
          onSubmit={handleSubmit}
          noValidate
        >
          <Grid container spacing={3}>
            {/* Basic Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'primary.main', mb: 2, fontWeight: 'bold' }}>
                Basic Information
              </Typography>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                autoComplete="username"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="email"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                autoComplete="new-password"
                helperText="Minimum 6 characters"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                autoComplete="new-password"
                error={formData.confirmPassword && formData.password !== formData.confirmPassword}
                helperText={formData.confirmPassword && formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Phone Number"
                name="phone_number"
                value={formData.phone_number}
                onChange={handleChange}
                required
                autoComplete="tel"
                placeholder="+94 77 123 4567"
                helperText="Enter your Sri Lankan phone number"
              />
            </Grid>
            
            {/* Address Information */}
            <Grid item xs={12}>
              <Typography variant="h6" sx={{ color: 'primary.main', mt: 2, mb: 1, fontWeight: 'bold' }}>
                Address Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Street Address"
                name="address.street"
                value={formData.address.street}
                onChange={handleChange}
                required
                autoComplete="street-address"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="address.city"
                value={formData.address.city}
                onChange={handleChange}
                required
                autoComplete="address-level2"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="State/Province"
                name="address.state"
                value={formData.address.state}
                onChange={handleChange}
                required
                autoComplete="address-level1"
                placeholder="Western Province"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Postal Code"
                name="address.postal_code"
                value={formData.address.postal_code}
                onChange={handleChange}
                required
                autoComplete="postal-code"
                placeholder="10400"
                helperText="5-digit Sri Lankan postal code"
              />
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Country"
                name="address.country"
                value={formData.address.country}
                onChange={handleChange}
                required
                autoComplete="country-name"
                placeholder="Sri Lanka"
              />
            </Grid>
          </Grid>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            size="large"
            disabled={loading || !isFormValid}
            sx={{ 
              mt: 4, 
              mb: 2,
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
                Creating Account...
              </Box>
            ) : (
              'Create Account'
            )}
          </Button>
          
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              Already have an account?{' '}
              <Link 
                to="/login" 
                style={{ 
                  color: '#FFD700',
                  textDecoration: 'none',
                  fontWeight: 'bold'
                }}
              >
                Sign In Here
              </Link>
            </Typography>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;