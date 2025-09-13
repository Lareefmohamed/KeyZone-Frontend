// src/pages/Cart.js
import React from 'react';
import {
  Container, Typography, Box, Paper, Grid, Button, IconButton, Divider
} from '@mui/material';
import { Delete, Add, Remove, ShoppingCart } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';

const Cart = () => {
  const { cart, updateCartItem, removeFromCart, clearCart, loading } = useCart();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleQuantityChange = async (productId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      await updateCartItem(productId, newQuantity);
    } catch (error) {
      alert('Error updating cart item');
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
    } catch (error) {
      alert('Error removing item from cart');
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await clearCart();
      } catch (error) {
        alert('Error clearing cart');
      }
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    navigate('/checkout');
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <ShoppingCart sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
        <Typography variant="h5" gutterBottom>
          Your cart is empty
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 3 }}>
          Start shopping to add items to your cart
        </Typography>
        <Button variant="contained" component={Link} to="/products">
          Browse Products
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Shopping Cart
      </Typography>

      {cart.items.map((item) => (
        <Paper key={item.product._id} sx={{ p: 3, mb: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <img
                src={item.product.productImgs?.[0] || '/placeholder-image.jpg'}
                alt={item.product.name}
                style={{ width: '100%', height: 100, objectFit: 'cover', borderRadius: 8 }}
              />
            </Grid>
            <Grid item xs={12} sm={5}>
              <Typography variant="h6" component={Link} to={`/product/${item.product._id}`}
                sx={{ textDecoration: 'none', color: 'inherit', '&:hover': { color: 'primary.main' } }}
              >
                {item.product.name}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                ${item.price} each
              </Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <Remove />
                </IconButton>
                <Typography sx={{ minWidth: 30, textAlign: 'center' }}>
                  {item.quantity}
                </Typography>
                <IconButton 
                  size="small"
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                >
                  <Add />
                </IconButton>
              </Box>
            </Grid>
            <Grid item xs={12} sm={1}>
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                <Typography variant="h6" color="primary">
                  ${(item.price * item.quantity).toFixed(2)}
                </Typography>
                <IconButton 
                  color="error" 
                  onClick={() => handleRemoveItem(item.product._id)}
                >
                  <Delete />
                </IconButton>
              </Box>
            </Grid>
          </Grid>
        </Paper>
      ))}

      <Paper sx={{ p: 3, mt: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">
            ${cart.total?.toFixed(2)}
          </Typography>
        </Box>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'space-between' }}>
          <Button variant="outlined" color="error" onClick={handleClearCart}>
            Clear Cart
          </Button>
          <Button variant="contained" size="large" onClick={handleCheckout}>
            Proceed to Checkout
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart;