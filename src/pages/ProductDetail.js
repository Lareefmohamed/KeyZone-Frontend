// src/pages/ProductDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, Button, Paper, Chip, Divider, IconButton,
  Breadcrumbs, Link, Card, CardMedia, Skeleton, Alert
} from '@mui/material';
import { 
  ShoppingCart, Add, Remove, Home, NavigateNext, ArrowBackIos, 
  ArrowForwardIos, ZoomIn, Star, Inventory 
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import productService from '../services/productService';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError('');
        const response = await productService.getProductById(id);
        setProduct(response.data.data);
      } catch (error) {
        console.error('Error fetching product:', error);
        setError('Product not found or failed to load');
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  const handleAddToCart = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await addToCart(product._id, quantity);
      // Show success feedback
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding product to cart');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.quantity) {
      setQuantity(newQuantity);
    }
  };

  const handleImageSelect = (index) => {
    setCurrentImageIndex(index);
    setImageLoading(true);
  };

  const handlePreviousImage = () => {
    const images = product.productImgs?.filter(img => img && img.trim()) || [];
    setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1));
  };

  const handleNextImage = () => {
    const images = product.productImgs?.filter(img => img && img.trim()) || [];
    setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0));
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Games':
        return 'error';
      case 'Softwares':
        return 'info';
      default:
        return 'default';
    }
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <Typography variant="h6" color="text.secondary">
            Loading product details...
          </Typography>
        </Box>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error" sx={{ mb: 3 }}>
          {error || 'Product not found'}
        </Alert>
        <Button variant="contained" onClick={() => navigate('/products')}>
          Back to Products
        </Button>
      </Container>
    );
  }

  // Get valid images
  const images = product.productImgs?.filter(img => img && img.trim()) || [];
  const hasMultipleImages = images.length > 1;
  const currentImage = images[currentImageIndex] || '/placeholder-image.jpg';

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        sx={{ mb: 3 }}
      >
        <Link 
          component={RouterLink} 
          to="/" 
          sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none' }}
        >
          <Home sx={{ mr: 0.5, fontSize: 20 }} />
          Home
        </Link>
        <Link 
          component={RouterLink} 
          to="/products"
          sx={{ color: 'text.primary', textDecoration: 'none' }}
        >
          Products
        </Link>
        {product.categories && product.categories.length > 0 && (
          <Link 
            component={RouterLink} 
            to={`/products/category/${product.categories[0]}`}
            sx={{ color: 'text.primary', textDecoration: 'none' }}
          >
            {product.categories[0]}
          </Link>
        )}
        <Typography color="primary.main">{product.name}</Typography>
      </Breadcrumbs>

      <Grid container spacing={4}>
        {/* Image Gallery */}
        <Grid item xs={12} md={6}>
          {/* Main Image */}
          <Paper 
            sx={{ 
              position: 'relative',
              mb: 2,
              overflow: 'hidden',
              borderRadius: 2,
              height: 500,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {imageLoading && (
              <Skeleton 
                variant="rectangular" 
                width="100%" 
                height={500} 
                sx={{ position: 'absolute', top: 0, left: 0 }}
              />
            )}
            
            <img
              src={!imageError ? currentImage : '/placeholder-image.jpg'}
              alt={product.name}
              onLoad={() => setImageLoading(false)}
              onError={() => {
                setImageError(true);
                setImageLoading(false);
              }}
              style={{ 
                maxWidth: '100%', 
                maxHeight: '100%', 
                objectFit: 'contain',
                display: imageLoading ? 'none' : 'block'
              }}
            />

            {/* Navigation Arrows */}
            {hasMultipleImages && (
              <>
                <IconButton
                  sx={{
                    position: 'absolute',
                    left: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                  onClick={handlePreviousImage}
                >
                  <ArrowBackIos />
                </IconButton>
                <IconButton
                  sx={{
                    position: 'absolute',
                    right: 16,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    bgcolor: 'rgba(0, 0, 0, 0.7)',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.9)',
                      transform: 'translateY(-50%) scale(1.1)'
                    }
                  }}
                  onClick={handleNextImage}
                >
                  <ArrowForwardIos />
                </IconButton>
              </>
            )}

            {/* Zoom Indicator */}
            <IconButton
              sx={{
                position: 'absolute',
                top: 16,
                right: 16,
                bgcolor: 'rgba(0, 0, 0, 0.7)',
                color: 'white',
                '&:hover': {
                  bgcolor: 'rgba(0, 0, 0, 0.9)'
                }
              }}
            >
              <ZoomIn />
            </IconButton>

            {/* Image Counter */}
            {hasMultipleImages && (
              <Box
                sx={{
                  position: 'absolute',
                  bottom: 16,
                  right: 16,
                  bgcolor: 'rgba(0, 0, 0, 0.7)',
                  color: 'white',
                  px: 2,
                  py: 0.5,
                  borderRadius: 2,
                  fontSize: '0.9rem'
                }}
              >
                {currentImageIndex + 1} / {images.length}
              </Box>
            )}
          </Paper>

          {/* Thumbnail Gallery */}
          {hasMultipleImages && (
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', justifyContent: 'center' }}>
              {images.map((image, index) => (
                <Card
                  key={index}
                  sx={{
                    width: 80,
                    height: 80,
                    cursor: 'pointer',
                    border: currentImageIndex === index 
                      ? '3px solid' 
                      : '1px solid rgba(255, 215, 0, 0.3)',
                    borderColor: currentImageIndex === index 
                      ? 'primary.main' 
                      : 'rgba(255, 215, 0, 0.3)',
                    transition: 'all 0.2s ease',
                    overflow: 'hidden',
                    '&:hover': {
                      border: '2px solid',
                      borderColor: 'primary.main',
                      transform: 'scale(1.05)'
                    }
                  }}
                  onClick={() => handleImageSelect(index)}
                >
                  <CardMedia
                    component="img"
                    height="80"
                    image={image}
                    alt={`${product.name} - Image ${index + 1}`}
                    sx={{ objectFit: 'cover' }}
                  />
                </Card>
              ))}
            </Box>
          )}
        </Grid>
        
        {/* Product Information */}
        <Grid item xs={12} md={6}>
          <Box>
            {/* Categories */}
            <Box sx={{ mb: 2 }}>
              {product.categories?.map((category) => (
                <Chip 
                  key={category} 
                  label={category} 
                  color={getCategoryColor(category)}
                  sx={{ mr: 1, mb: 1 }}
                  component={RouterLink}
                  to={`/products/category/${category}`}
                  clickable
                />
              ))}
            </Box>
            
            {/* Product Name */}
            <Typography variant="h3" gutterBottom sx={{ color: 'primary.main', fontWeight: 'bold' }}>
              {product.name}
            </Typography>
            
            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Box sx={{ display: 'flex', mr: 1 }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ color: '#FFD700', fontSize: 20 }} />
                ))}
              </Box>
              <Typography variant="body2" color="text.secondary">
                4.5 (125 reviews)
              </Typography>
            </Box>
            
            {/* Price */}
            <Typography variant="h4" color="primary.main" gutterBottom sx={{ fontWeight: 'bold' }}>
              {formatPrice(product.price)}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Description */}
            <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
              Description
            </Typography>
            <Typography variant="body1" sx={{ mb: 3, lineHeight: 1.6 }}>
              {product.description}
            </Typography>
            
            <Divider sx={{ my: 3 }} />
            
            {/* Stock Information */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Inventory sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="body1" sx={{ mr: 2 }}>
                Stock:
              </Typography>
              <Chip 
                label={product.quantity > 0 ? `${product.quantity} available` : 'Out of stock'}
                color={product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'error'}
                variant="outlined"
              />
            </Box>
            
            {/* Quantity Selector */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
              <Typography variant="h6" sx={{ minWidth: 80 }}>Quantity:</Typography>
              <Box sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                border: '2px solid rgba(255, 215, 0, 0.3)', 
                borderRadius: 2,
                overflow: 'hidden'
              }}>
                <IconButton
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  sx={{ 
                    borderRadius: 0,
                    px: 2,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' }
                  }}
                >
                  <Remove />
                </IconButton>
                <Typography 
                  sx={{ 
                    minWidth: 60, 
                    textAlign: 'center', 
                    py: 1,
                    bgcolor: 'rgba(255, 215, 0, 0.1)',
                    fontWeight: 'bold',
                    fontSize: '1.2rem'
                  }}
                >
                  {quantity}
                </Typography>
                <IconButton
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= product.quantity}
                  sx={{ 
                    borderRadius: 0,
                    px: 2,
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' }
                  }}
                >
                  <Add />
                </IconButton>
              </Box>
              <Typography variant="body2" color="text.secondary">
                (Max: {product.quantity})
              </Typography>
            </Box>
            
            {/* Add to Cart Button */}
            <Button
              variant="contained"
              size="large"
              startIcon={<ShoppingCart />}
              onClick={handleAddToCart}
              disabled={product.quantity === 0}
              fullWidth
              sx={{
                py: 2,
                fontSize: '1.2rem',
                fontWeight: 'bold',
                bgcolor: product.quantity === 0 ? 'grey.600' : 'primary.main',
                color: product.quantity === 0 ? 'grey.400' : 'black',
                '&:hover': {
                  bgcolor: product.quantity === 0 ? 'grey.600' : '#FFA000',
                  transform: product.quantity === 0 ? 'none' : 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(255, 215, 0, 0.4)'
                },
                '&:disabled': {
                  bgcolor: 'grey.600',
                  color: 'grey.400'
                }
              }}
            >
              {product.quantity === 0 ? 'Out of Stock' : `Add ${quantity} to Cart`}
            </Button>

            {/* Product Features */}
            <Paper sx={{ mt: 4, p: 3, bgcolor: 'rgba(255, 215, 0, 0.1)' }}>
              <Typography variant="h6" gutterBottom sx={{ color: 'primary.main' }}>
                Product Features
              </Typography>
              <Box component="ul" sx={{ pl: 2, m: 0 }}>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  Instant digital delivery
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  100% authentic product key
                </Typography>
                <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                  24/7 customer support
                </Typography>
                <Typography component="li" variant="body2">
                  Money-back guarantee
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
};

export default ProductDetail;