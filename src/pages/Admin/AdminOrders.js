// src/pages/Admin/AdminOrders.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Chip, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions, Button, Grid,
  Pagination, Alert, Card, CardContent, Divider, Avatar, Collapse
} from '@mui/material';
import {
  Visibility, ExpandMore, ExpandLess, Person, CalendarToday,
  ShoppingCart, Payment, Receipt
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import orderService from '../../services/orderService';

const AdminOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [pagination, setPagination] = useState({});
  const [page, setPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [expandedRows, setExpandedRows] = useState(new Set());

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchOrders();
    }
  }, [user, page]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await orderService.getAllOrders({ 
        page, 
        limit: 10 
      });
      
      if (response.data.success) {
        setOrders(response.data.data);
        setPagination(response.data.pagination);
      } else {
        setError('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
      if (error.response?.status === 404) {
        setError('No orders found or orders endpoint not available');
      } else {
        setError('Failed to fetch orders. Please check if the orders API is working.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedOrder(null);
  };

  const handlePageChange = (event, newPage) => {
    setPage(newPage);
  };

  const toggleRowExpansion = (orderId) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(orderId)) {
      newExpanded.delete(orderId);
    } else {
      newExpanded.add(orderId);
    }
    setExpandedRows(newExpanded);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-LK', {
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

  const getOrderStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'processing':
        return 'warning';
      case 'pending':
        return 'info';
      case 'cancelled':
        return 'error';
      default:
        return 'success'; // Default to completed for digital products
    }
  };

  const getTotalOrderValue = () => {
    return orders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
  };

  const getOrderStats = () => {
    const total = orders.length;
    const today = new Date().toDateString();
    const todayOrders = orders.filter(order => 
      new Date(order.createdAt).toDateString() === today
    ).length;
    
    return { total, todayOrders };
  };

  if (user?.role !== 'admin') {
    return (
      <Container maxWidth="md" sx={{ py: 4, textAlign: 'center' }}>
        <Typography variant="h5" color="error">
          Access Denied
        </Typography>
        <Typography variant="body1" color="text.secondary">
          You need admin privileges to access this page.
        </Typography>
      </Container>
    );
  }

  const stats = getOrderStats();

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
            Order Management
          </Typography>
          <Typography variant="h6" color="text.secondary">
            View and manage all customer orders
          </Typography>
        </Box>

        {/* Order Statistics */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 26, 26, 0.8) 100%)', 
              border: '1px solid rgba(255, 215, 0, 0.2)' 
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <ShoppingCart sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {stats.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 26, 26, 0.8) 100%)', 
              border: '1px solid rgba(255, 215, 0, 0.2)' 
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <CalendarToday sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {stats.todayOrders}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Today's Orders
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 26, 26, 0.8) 100%)', 
              border: '1px solid rgba(255, 215, 0, 0.2)' 
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Payment sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {formatPrice(getTotalOrderValue())}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Revenue
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, rgba(255, 215, 0, 0.1) 0%, rgba(26, 26, 26, 0.8) 100%)', 
              border: '1px solid rgba(255, 215, 0, 0.2)' 
            }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Receipt sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                  {orders.length > 0 ? formatPrice(getTotalOrderValue() / orders.length) : formatPrice(0)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Order Value
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="h6" color="text.secondary">
              Loading orders...
            </Typography>
          </Box>
        ) : orders.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <ShoppingCart sx={{ fontSize: 100, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              No orders found
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              When customers place orders, they will appear here for you to manage.
            </Typography>
          </Box>
        ) : (
          <>
            <TableContainer component={Paper} sx={{ mb: 3 }}>
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: 'primary.main' }}>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Order ID</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Customer</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Date</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Items</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Total</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Status</TableCell>
                    <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((order) => (
                    <React.Fragment key={order._id}>
                      <TableRow hover sx={{ cursor: 'pointer' }}>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontFamily: 'monospace', fontWeight: 'bold' }}>
                            #{order._id.slice(-8)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'black' }}>
                              {order.user_id?.username?.charAt(0).toUpperCase() || 'U'}
                            </Avatar>
                            <Box>
                              <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                {order.user_id?.username || 'Unknown User'}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {order.user_id?.email || 'No email'}
                              </Typography>
                            </Box>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2">
                            {formatDate(order.createdAt)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Chip 
                              label={`${order.products?.length || 0} items`} 
                              size="small" 
                              color="primary" 
                              variant="outlined"
                            />
                            <IconButton
                              size="small"
                              onClick={() => toggleRowExpansion(order._id)}
                            >
                              {expandedRows.has(order._id) ? <ExpandLess /> : <ExpandMore />}
                            </IconButton>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(order.total_amount)}
                          </Typography>
                        </TableCell>
                        <TableCell>
                          <Chip 
                            label="Completed" 
                            color={getOrderStatusColor('completed')}
                            size="small"
                          />
                        </TableCell>
                        <TableCell>
                          <IconButton
                            color="primary"
                            onClick={() => handleViewOrder(order)}
                            title="View Order Details"
                          >
                            <Visibility />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                      
                      {/* Expandable Row for Order Items */}
                      <TableRow>
                        <TableCell colSpan={7} sx={{ p: 0, border: 'none' }}>
                          <Collapse in={expandedRows.has(order._id)} timeout="auto" unmountOnExit>
                            <Box sx={{ p: 2, bgcolor: 'rgba(255, 215, 0, 0.05)' }}>
                              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 'bold' }}>
                                Order Items:
                              </Typography>
                              <Grid container spacing={2}>
                                {order.products?.map((item, index) => (
                                  <Grid item xs={12} sm={6} md={4} key={index}>
                                    <Card sx={{ height: '100%' }}>
                                      <CardContent sx={{ p: 2 }}>
                                        <Box sx={{ display: 'flex', gap: 2 }}>
                                          <Avatar
                                            src={item.product_id?.productImgs?.[0]}
                                            alt={item.product_id?.name}
                                            sx={{ width: 50, height: 50 }}
                                            variant="rounded"
                                          />
                                          <Box sx={{ flex: 1 }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                              {item.product_id?.name || 'Product Name'}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                              Qty: {item.quantity} × {formatPrice(item.price)}
                                            </Typography>
                                            <Typography variant="body2" color="primary.main" sx={{ fontWeight: 'bold' }}>
                                              {formatPrice(item.price * item.quantity)}
                                            </Typography>
                                          </Box>
                                        </Box>
                                      </CardContent>
                                    </Card>
                                  </Grid>
                                ))}
                              </Grid>
                            </Box>
                          </Collapse>
                        </TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Pagination
                  count={pagination.pages}
                  page={pagination.current}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  showFirstButton
                  showLastButton
                />
              </Box>
            )}
          </>
        )}

        {/* Order Details Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          {selectedOrder && (
            <>
              <DialogTitle sx={{ bgcolor: 'primary.main', color: 'black' }}>
                Order Details - #{selectedOrder._id.slice(-8)}
              </DialogTitle>
              <DialogContent sx={{ pt: 3 }}>
                <Grid container spacing={3}>
                  {/* Customer Information */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <Person sx={{ mr: 1, color: 'primary.main' }} />
                          Customer Information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Name:</strong> {selectedOrder.user_id?.username || 'Unknown User'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Email:</strong> {selectedOrder.user_id?.email || 'No email'}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Phone:</strong> {selectedOrder.user_id?.phone_number || 'No phone'}
                        </Typography>
                        <Typography variant="body2">
                          <strong>Address:</strong> {
                            selectedOrder.user_id?.address ? 
                            `${selectedOrder.user_id.address.street}, ${selectedOrder.user_id.address.city}, ${selectedOrder.user_id.address.state} ${selectedOrder.user_id.address.postal_code}` :
                            'No address'
                          }
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Order Information */}
                  <Grid item xs={12} md={6}>
                    <Card sx={{ height: '100%' }}>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                          <Receipt sx={{ mr: 1, color: 'primary.main' }} />
                          Order Information
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Order ID:</strong> {selectedOrder._id}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          <strong>Status:</strong> <Chip label="Completed" color="success" size="small" />
                        </Typography>
                        <Typography variant="body2">
                          <strong>Total Amount:</strong> {formatPrice(selectedOrder.total_amount)}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  {/* Ordered Products */}
                  <Grid item xs={12}>
                    <Card>
                      <CardContent>
                        <Typography variant="h6" sx={{ mb: 2 }}>
                          Ordered Products
                        </Typography>
                        {selectedOrder.products?.map((item, index) => (
                          <Box key={index}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                                <Avatar
                                  src={item.product_id?.productImgs?.[0]}
                                  alt={item.product_id?.name}
                                  sx={{ width: 50, height: 50 }}
                                  variant="rounded"
                                />
                                <Box>
                                  <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
                                    {item.product_id?.name || 'Product Name'}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    Quantity: {item.quantity} × {formatPrice(item.price)}
                                  </Typography>
                                </Box>
                              </Box>
                              <Typography variant="h6" color="primary.main">
                                {formatPrice(item.price * item.quantity)}
                              </Typography>
                            </Box>
                            {index < selectedOrder.products.length - 1 && <Divider sx={{ my: 1 }} />}
                          </Box>
                        ))}
                        
                        <Divider sx={{ my: 2 }} />
                        
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography variant="h6">Total:</Typography>
                          <Typography variant="h5" color="primary.main" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(selectedOrder.total_amount)}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions sx={{ p: 3 }}>
                <Button onClick={handleCloseDialog} variant="contained">
                  Close
                </Button>
              </DialogActions>
            </>
          )}
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminOrders;