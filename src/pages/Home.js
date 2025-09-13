// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Button, Paper, Alert, CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import { VideogameAsset, Computer, ShoppingBag, ArrowForward } from '@mui/icons-material';
import ProductCard from '../components/Products/ProductCard';
import productService from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productService.getAllProducts({ limit: 6 });
        
        if (response.data.success) {
          setFeaturedProducts(response.data.data);
        } else {
          setError('Failed to load featured products');
        }
      } catch (error) {
        console.error('Error fetching featured products:', error);
        setError('Unable to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Hero Section */}
      <Paper 
        elevation={0}
        sx={{ 
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
          color: 'black',
          p: { xs: 4, md: 6 },
          mb: 6,
          borderRadius: 4,
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 20px 40px rgba(255, 215, 0, 0.3)',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 30% 40%, rgba(255,255,255,0.3) 0%, transparent 50%)',
          }
        }}
      >
        <Box sx={{ position: 'relative', zIndex: 2 }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{ 
              fontWeight: 'bold',
              fontSize: { xs: '2.5rem', md: '3.75rem' },
              textShadow: '2px 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Welcome to{' '}
            <Box component="span" sx={{ 
              fontWeight: 'bold',
              fontSize: '1.1em',
              textShadow: '3px 3px 6px rgba(0,0,0,0.2)'
            }}>
              KeyZone
            </Box>
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              mb: 4, 
              opacity: 0.9,
              fontSize: { xs: '1.1rem', md: '1.25rem' },
              maxWidth: 600,
              mx: 'auto',
              lineHeight: 1.4
            }}
          >
            Your premium destination for digital game keys and software licenses
          </Typography>
          <Button 
            variant="contained" 
            size="large" 
            component={Link} 
            to="/products"
            endIcon={<ShoppingBag />}
            sx={{ 
              bgcolor: 'black', 
              color: '#FFD700',
              px: 4,
              py: 1.5,
              fontSize: '1.2rem',
              fontWeight: 'bold',
              borderRadius: 2,
              textTransform: 'none',
              boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
              '&:hover': { 
                bgcolor: '#1a1a1a',
                transform: 'translateY(-3px)',
                boxShadow: '0 12px 35px rgba(0,0,0,0.4)'
              }
            }}
          >
            Start Shopping
          </Button>
        </Box>
      </Paper>

      {/* Categories Section */}
      <Box sx={{ mb: 8 }}>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3rem' }
          }}
        >
          Browse Categories
        </Typography>
        
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Discover our extensive collection of digital products
        </Typography>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          {/* Games Category */}
          <Grid item xs={12} md={6}>
            <Paper 
              component={Link}
              to="/products/category/Games"
              elevation={0}
              sx={{ 
                p: 4, 
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
                minHeight: 350,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 160, 0, 0.95) 100%)',
                color: 'black',
                border: '3px solid transparent',
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { 
                  transform: 'translateY(-10px) scale(1.02)',
                  border: '3px solid #FFD700',
                  boxShadow: '0 25px 50px rgba(255, 215, 0, 0.4)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                  '& .category-icon': {
                    transform: 'scale(1.2) rotate(5deg)',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  },
                  '& .arrow-icon': {
                    transform: 'translateX(10px)',
                    opacity: 1
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                }
              }}
            >
              <VideogameAsset 
                className="category-icon"
                sx={{ 
                  fontSize: 100, 
                  color: 'black', 
                  mb: 3,
                  transition: 'all 0.4s ease',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} 
              />
              
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'black',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Games
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.1rem',
                  mb: 3,
                  opacity: 0.8,
                  lineHeight: 1.5,
                  maxWidth: 400
                }}
              >
                Latest game keys and digital downloads for PC, Xbox, PlayStation and more
              </Typography>
              
              <Box sx={{ opacity: 0.7, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Action • Adventure • RPG • Strategy • Sports
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Explore Games
                </Typography>
                <ArrowForward 
                  className="arrow-icon"
                  sx={{ 
                    transition: 'all 0.3s ease',
                    opacity: 0.7,
                    transform: 'translateX(0px)'
                  }} 
                />
              </Box>
            </Paper>
          </Grid>

          {/* Software Category */}
          <Grid item xs={12} md={6}>
            <Paper 
              component={Link}
              to="/products/category/Softwares"
              elevation={0}
              sx={{ 
                p: 4, 
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                height: '100%',
                minHeight: 350,
                cursor: 'pointer',
                position: 'relative',
                overflow: 'hidden',
                background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.95) 0%, rgba(255, 160, 0, 0.95) 100%)',
                color: 'black',
                border: '3px solid transparent',
                borderRadius: 3,
                transition: 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.2)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                '&:hover': { 
                  transform: 'translateY(-10px) scale(1.02)',
                  border: '3px solid #FFD700',
                  boxShadow: '0 25px 50px rgba(255, 215, 0, 0.4)',
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
                  '& .category-icon': {
                    transform: 'scale(1.2) rotate(-5deg)',
                    filter: 'drop-shadow(0 8px 16px rgba(0,0,0,0.3))'
                  },
                  '& .arrow-icon': {
                    transform: 'translateX(10px)',
                    opacity: 1
                  }
                },
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: '-100%',
                  width: '100%',
                  height: '100%',
                  background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent)',
                  transition: 'left 0.6s',
                },
                '&:hover::before': {
                  left: '100%',
                }
              }}
            >
              <Computer 
                className="category-icon"
                sx={{ 
                  fontSize: 100, 
                  color: 'black', 
                  mb: 3,
                  transition: 'all 0.4s ease',
                  filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.2))'
                }} 
              />
              
              <Typography 
                variant="h3" 
                gutterBottom 
                sx={{ 
                  fontWeight: 'bold', 
                  color: 'black',
                  mb: 2,
                  fontSize: { xs: '2rem', md: '2.5rem' }
                }}
              >
                Software
              </Typography>
              
              <Typography 
                variant="body1" 
                sx={{ 
                  fontSize: '1.1rem',
                  mb: 3,
                  opacity: 0.8,
                  lineHeight: 1.5,
                  maxWidth: 400
                }}
              >
                Professional software and productivity tools for work and creativity
              </Typography>
              
              <Box sx={{ opacity: 0.7, mb: 2 }}>
                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                  Office Suites • Design Tools • Security • Development
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', mt: 'auto' }}>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mr: 1 }}>
                  Explore Software
                </Typography>
                <ArrowForward 
                  className="arrow-icon"
                  sx={{ 
                    transition: 'all 0.3s ease',
                    opacity: 0.7,
                    transform: 'translateX(0px)'
                  }} 
                />
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box>
        <Typography 
          variant="h3" 
          component="h2" 
          align="center" 
          gutterBottom
          sx={{ 
            color: 'primary.main',
            fontWeight: 'bold',
            mb: 2,
            fontSize: { xs: '2.5rem', md: '3rem' }
          }}
        >
          Featured Products
        </Typography>
        
        <Typography 
          variant="h6" 
          align="center" 
          color="text.secondary"
          sx={{ mb: 6, maxWidth: 600, mx: 'auto' }}
        >
          Discover our handpicked selection of premium digital products
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            <Typography variant="body1">
              {error}
            </Typography>
          </Alert>
        )}
        
        {loading ? (
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
            <CircularProgress size={60} sx={{ color: 'primary.main', mb: 3 }} />
            <Typography variant="body1" color="text.secondary">
              Loading amazing products...
            </Typography>
          </Box>
        ) : featuredProducts.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', borderRadius: 3 }}>
            <Typography variant="h5" gutterBottom color="text.secondary">
              No products available at the moment
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Please check back later or contact support if this issue persists.
            </Typography>
            <Button 
              variant="contained" 
              component={Link} 
              to="/products"
              sx={{ mt: 2, px: 4, py: 1.5, fontSize: '1.1rem' }}
            >
              Browse All Products
            </Button>
          </Paper>
        ) : (
          <Grid container spacing={4}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        
        <Box sx={{ textAlign: 'center', mt: 8 }}>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            to="/products"
            endIcon={<ArrowForward />}
            sx={{ 
              px: 6,
              py: 2,
              fontSize: '1.2rem',
              borderWidth: '2px',
              borderRadius: 2,
              fontWeight: 'bold',
              '&:hover': {
                borderWidth: '2px',
                transform: 'translateY(-2px)',
                boxShadow: '0 10px 30px rgba(255, 215, 0, 0.3)'
              }
            }}
          >
            View All Products
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;