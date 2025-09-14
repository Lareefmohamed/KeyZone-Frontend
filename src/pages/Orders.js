// src/pages/Orders.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Chip, Divider, Alert, Pagination
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import orderService from '../services/orderService';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const location = useLocation();

  const message = location.state?.message;

  useEffect(() => {
    fetchOrders();
  }, [page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await orderService.getUserOrders({ page, limit: 10 });
      setOrders(response.data.data);
      setPagination(response.data.pagination);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Order History
      </Typography>

      {message && <Alert severity="success" sx={{ mb: 3 }}>{message}</Alert>}

      {loading ? (
        <Typography align="center" sx={{ py: 4 }}>Loading...</Typography>
      ) : orders.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>
            No orders found
          </Typography>
          <Typography color="text.secondary">
            Start shopping to see your orders here
          </Typography>
        </Paper>
      ) : (
        <>
          {orders.map((order) => (
            <Paper key={order._id} sx={{ p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">
                  Order #{order._id.slice(-8)}
                </Typography>
                <Chip label="Completed" color="success" />
              </Box>
              
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Placed on {formatDate(order.createdAt)}
              </Typography>
              
              <Divider sx={{ my: 2 }} />
              
              {order.products.map((item) => (
                <Box key={item.product_id._id} sx={{ display: 'flex', justifyContent: 'space-between', py: 1 }}>
                  <Box>
                    <Typography variant="body1">{item.product_id.name}</Typography>
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
                  {formatPrice(order.total_amount)}
                </Typography>
              </Box>
            </Paper>
          ))}

          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.current}
                onChange={handlePageChange}
                color="primary"
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Orders;