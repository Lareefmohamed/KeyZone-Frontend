// src/pages/Home.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Box, Grid, Button, Paper
} from '@mui/material';
import { Link } from 'react-router-dom';
import { VideogameAsset, Computer } from '@mui/icons-material';
import ProductCard from '../components/Products/ProductCard';
import productService from '../services/productService';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        const response = await productService.getAllProducts({ limit: 6 });
        setFeaturedProducts(response.data.data);
      } catch (error) {
        console.error('Error fetching featured products:', error);
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
        sx={{ 
          background: 'linear-gradient(135deg, #FFD700 0%, #FFA000 100%)',
          color: 'black',
          p: 6,
          mb: 6,
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to KeyZone
        </Typography>
        <Typography variant="h6" sx={{ mb: 3, opacity: 0.8 }}>
          Your premium destination for digital game keys and software licenses
        </Typography>
        <Button 
          variant="contained" 
          size="large" 
          component={Link} 
          to="/products"
          sx={{ 
            bgcolor: 'black', 
            color: 'primary.main',
            '&:hover': { bgcolor: '#333' }
          }}
        >
          Shop Now
        </Button>
      </Paper>

      {/* Categories Section */}
      <Box sx={{ mb: 6 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Browse Categories
        </Typography>
        <Grid container spacing={3} sx={{ mt: 2 }}>
          <Grid item xs={12} md={6}>
            <Paper 
              component={Link}
              to="/products/category/Games"
              sx={{ 
                p: 4, 
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
              }}
            >
              <VideogameAsset sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Games
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Latest game keys and digital downloads
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper 
              component={Link}
              to="/products/category/Softwares"
              sx={{ 
                p: 4, 
                textAlign: 'center',
                textDecoration: 'none',
                color: 'inherit',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' },
                background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)'
              }}
            >
              <Computer sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Software
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Professional software and productivity tools
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Box>

      {/* Featured Products */}
      <Box>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Featured Products
        </Typography>
        {loading ? (
          <Typography align="center" sx={{ py: 4 }}>Loading...</Typography>
        ) : (
          <Grid container spacing={3} sx={{ mt: 2 }}>
            {featuredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
        <Box sx={{ textAlign: 'center', mt: 4 }}>
          <Button 
            variant="outlined" 
            size="large" 
            component={Link} 
            to="/products"
          >
            View All Products
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;

