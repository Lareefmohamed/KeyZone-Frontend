// src/components/Products/ProductCard.js
import React from 'react';
import {
  Card, CardContent, CardMedia, Typography, Box, Button, Chip
} from '@mui/material';
import { ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '../../contexts/AuthContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      alert('Please login to add items to cart');
      return;
    }
    
    try {
      await addToCart(product._id, 1);
      alert('Product added to cart!');
    } catch (error) {
      alert('Error adding product to cart');
    }
  };

  return (
    <Card 
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'translateY(-4px)' }
      }}
    >
      <CardMedia
        component="img"
        height="200"
        image={product.productImgs?.[0] || '/placeholder-image.jpg'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mb: 1 }}>
          {product.categories?.map((category) => (
            <Chip 
              key={category} 
              label={category} 
              size="small" 
              color="primary" 
              sx={{ mr: 1 }}
            />
          ))}
        </Box>
        
        <Typography variant="h6" component={Link} to={`/product/${product._id}`}
          sx={{ 
            textDecoration: 'none', 
            color: 'inherit',
            '&:hover': { color: 'primary.main' },
            mb: 1
          }}
        >
          {product.name}
        </Typography>
        
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
          {product.description.length > 100 
            ? `${product.description.substring(0, 100)}...` 
            : product.description}
        </Typography>
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" color="primary">
            ${product.price}
          </Typography>
          <Button
            variant="contained"
            size="small"
            startIcon={<ShoppingCart />}
            onClick={handleAddToCart}
            disabled={product.quantity === 0}
          >
            {product.quantity === 0 ? 'Out of Stock' : 'Add to Cart'}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;

