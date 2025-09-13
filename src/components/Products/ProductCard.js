// src/components/Products/ProductCard.js
import React, { useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip, CardActions, Skeleton
} from '@mui/material';
import { ShoppingCart, Visibility, Star } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [imageLoading, setImageLoading] = useState(true);
  const [imageError, setImageError] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    if (isAdding) return;
    
    try {
      setIsAdding(true);
      await addToCart(product._id, 1);
      // Show success feedback
      const button = e.target.closest('button');
      if (button) {
        const originalText = button.textContent;
        button.textContent = 'Added!';
        button.style.backgroundColor = '#4caf50';
        setTimeout(() => {
          button.textContent = originalText;
          button.style.backgroundColor = '';
        }, 1500);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert('Error adding product to cart. Please try again.');
    } finally {
      setIsAdding(false);
    }
  };

  const handleViewProduct = () => {
    navigate(`/product/${product._id}`);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
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

  const truncateDescription = (description, maxLength = 120) => {
    if (description.length <= maxLength) return description;
    return description.substring(0, maxLength) + '...';
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'all 0.3s ease',
        cursor: 'pointer',
        position: 'relative',
        overflow: 'hidden',
        background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
        border: '1px solid rgba(255, 215, 0, 0.1)',
        '&:hover': { 
          transform: 'translateY(-8px)',
          boxShadow: '0 20px 40px rgba(255, 215, 0, 0.2)',
          border: '1px solid rgba(255, 215, 0, 0.4)',
          '& .product-image': {
            transform: 'scale(1.05)'
          },
          '& .product-overlay': {
            opacity: 1
          }
        }
      }}
      onClick={handleViewProduct}
    >
      {/* Image Section */}
      <Box sx={{ position: 'relative', height: 220, overflow: 'hidden' }}>
        {imageLoading && (
          <Skeleton 
            variant="rectangular" 
            height={220} 
            animation="wave"
            sx={{ bgcolor: 'rgba(255, 215, 0, 0.1)' }}
          />
        )}
        <CardMedia
          component="img"
          className="product-image"
          height="220"
          image={!imageError ? (product.productImgs?.[0] || '/placeholder-image.jpg') : '/placeholder-image.jpg'}
          alt={product.name}
          onLoad={() => setImageLoading(false)}
          onError={() => {
            setImageError(true);
            setImageLoading(false);
          }}
          sx={{ 
            objectFit: 'cover',
            transition: 'transform 0.3s ease',
            display: imageLoading ? 'none' : 'block'
          }}
        />
        
        {/* Overlay for hover effects */}
        <Box
          className="product-overlay"
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(135deg, rgba(0,0,0,0.7) 0%, rgba(255,215,0,0.1) 100%)',
            opacity: 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <Button
            variant="contained"
            startIcon={<Visibility />}
            sx={{
              bgcolor: 'primary.main',
              color: 'black',
              fontWeight: 'bold',
              '&:hover': {
                bgcolor: '#FFA000'
              }
            }}
          >
            View Details
          </Button>
        </Box>

        {/* Stock Status Badge */}
        {product.quantity === 0 && (
          <Chip
            label="Out of Stock"
            color="error"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
              zIndex: 1
            }}
          />
        )}

        {/* Low Stock Warning */}
        {product.quantity > 0 && product.quantity <= 10 && (
          <Chip
            label={`Only ${product.quantity} left`}
            color="warning"
            size="small"
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              fontWeight: 'bold',
              zIndex: 1
            }}
          />
        )}
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 2 }}>
        {/* Categories */}
        <Box sx={{ mb: 1.5, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
          {product.categories?.map((category) => (
            <Chip 
              key={category} 
              label={category} 
              size="small" 
              color={getCategoryColor(category)}
              sx={{ 
                fontSize: '0.75rem',
                height: 20,
                '& .MuiChip-label': {
                  px: 1
                }
              }}
            />
          ))}
        </Box>
        
        {/* Product Name */}
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            mb: 1,
            fontWeight: 'bold',
            color: 'primary.main',
            lineHeight: 1.3,
            fontSize: '1.1rem'
          }}
        >
          {product.name}
        </Typography>
        
        {/* Description */}
        <Typography 
          variant="body2" 
          color="text.secondary" 
          sx={{ 
            mb: 2, 
            flexGrow: 1,
            lineHeight: 1.4
          }}
        >
          {truncateDescription(product.description)}
        </Typography>

        {/* Rating (placeholder for future feature) */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, opacity: 0.7 }}>
          <Star sx={{ color: '#FFD700', fontSize: 16, mr: 0.5 }} />
          <Typography variant="body2" color="text.secondary">
            4.5 (125 reviews)
          </Typography>
        </Box>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ p: 2, pt: 0, flexDirection: 'column', gap: 1 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
          <Typography 
            variant="h6" 
            color="primary.main"
            sx={{ 
              fontWeight: 'bold',
              fontSize: '1.3rem'
            }}
          >
            {formatPrice(product.price)}
          </Typography>
          
          {product.quantity > 0 && product.quantity <= 50 && (
            <Typography variant="body2" color="text.secondary">
              {product.quantity} available
            </Typography>
          )}
        </Box>
        
        <Button
          variant="contained"
          size="medium"
          startIcon={<ShoppingCart />}
          onClick={handleAddToCart}
          disabled={product.quantity === 0 || isAdding}
          fullWidth
          sx={{
            py: 1,
            fontWeight: 'bold',
            fontSize: '0.9rem',
            bgcolor: product.quantity === 0 ? 'grey.600' : 'primary.main',
            color: product.quantity === 0 ? 'grey.400' : 'black',
            '&:hover': {
              bgcolor: product.quantity === 0 ? 'grey.600' : '#FFA000',
              transform: product.quantity === 0 ? 'none' : 'translateY(-1px)'
            },
            '&:disabled': {
              bgcolor: 'grey.600',
              color: 'grey.400'
            }
          }}
        >
          {isAdding 
            ? 'Adding...' 
            : product.quantity === 0 
            ? 'Out of Stock' 
            : 'Add to Cart'
          }
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;