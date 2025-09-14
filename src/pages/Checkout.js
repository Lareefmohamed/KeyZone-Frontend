// src/pages/Checkout.js
import React, { useState } from 'react';
import {
  Container, Typography, Paper, Box, Button, Divider, Alert, CircularProgress
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import orderService from '../services/orderService';

const Checkout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { cart, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const handlePlaceOrder = async () => {
    if (!cart.items || cart.items.length === 0) {
      setError('Your cart is empty');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await orderService.createOrder();
      await clearCart();
      navigate('/orders', { 
        state: { message: 'Order placed successfully!', orderId: response.data.data._id } 
      });
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (!cart.items || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5">Your cart is empty</Typography>
        <Button variant="contained" onClick={() => navigate('/products')} sx={{ mt: 2 }}>
          Continue Shopping
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Shipping Information
        </Typography>
        <Typography variant="body1">{user?.username}</Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.email}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {user?.address?.street}<br />
          {user?.address?.city}, {user?.address?.state} {user?.address?.postal_code}<br />
          {user?.address?.country}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" gutterBottom>
          Order Summary
        </Typography>
        
        {cart.items?.map((item) => (
          <Box key={item.product._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
            <Box>
              <Typography variant="body1">{item.product.name}</Typography>
              <Typography variant="body2" color="text.secondary">
                Qty: {item.quantity} × {formatPrice(item.price)}
              </Typography>
            </Box>
            <Typography variant="body1">
              {formatPrice(item.price * item.quantity)}
            </Typography>
          </Box>
        ))}
        
        <Divider sx={{ my: 2 }} />
        
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Typography variant="h6">Total:</Typography>
          <Typography variant="h6" color="primary">
            {formatPrice(cart.total)}
          </Typography>
        </Box>
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Payment Method
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          This is a demo store. No real payment will be processed.
        </Typography>
        
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={handlePlaceOrder}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : `Place Order - ${formatPrice(cart.total)}`}
        </Button>
      </Paper>
    </Container>
  );
};

export default Checkout;