// src/pages/Admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Grid, Box, Card, CardContent,
  Button, Divider, List, ListItem, ListItemText, ListItemIcon
} from '@mui/material';
import {
  Dashboard, Inventory, ShoppingCart, People, TrendingUp,
  Add, Edit, Assessment
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import productService from '../../services/productService';
import orderService from '../../services/orderService';
import userService from '../../services/userService';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    recentProducts: [],
    recentOrders: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch products
      const productsResponse = await productService.getAllProducts({ limit: 5 });
      const totalProducts = productsResponse.data.pagination?.total || 0;
      const recentProducts = productsResponse.data.data || [];

      // Fetch orders (if available)
      let totalOrders = 0;
      let totalRevenue = 0;
      let recentOrders = [];
      
      try {
        const ordersResponse = await orderService.getAllOrders({ limit: 5 });
        totalOrders = ordersResponse.data.pagination?.total || 0;
        recentOrders = ordersResponse.data.data || [];
        
        // Calculate revenue
        totalRevenue = recentOrders.reduce((sum, order) => sum + (order.total_amount || 0), 0);
      } catch (error) {
        console.log('Orders not available yet');
      }

      // Fetch users (if available)
      let totalUsers = 0;
      try {
        const usersResponse = await userService.getAllUsers({ limit: 1 });
        totalUsers = usersResponse.data.pagination?.total || 0;
      } catch (error) {
        console.log('Users stats not available yet');
      }

      setStats({
        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,
        recentProducts,
        recentOrders
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  const StatCard = ({ title, value, icon, color = 'primary' }) => (
    <Card sx={{ height: '100%', background: `linear-gradient(135deg, ${color === 'primary' ? 'rgba(255, 215, 0, 0.1)' : 'rgba(26, 26, 26, 0.8)'} 0%, rgba(26, 26, 26, 0.8) 100%)`, border: '1px solid rgba(255, 215, 0, 0.2)' }}>
      <CardContent sx={{ textAlign: 'center', py: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
          {React.cloneElement(icon, { 
            sx: { fontSize: 48, color: color === 'primary' ? 'primary.main' : 'text.secondary' }
          })}
        </Box>
        <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
          {value}
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {title}
        </Typography>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h3" color="primary.main" sx={{ fontWeight: 'bold', mb: 1 }}>
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Manage your KeyZone digital store
        </Typography>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Products"
            value={stats.totalProducts}
            icon={<Inventory />}
            color="primary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon={<ShoppingCart />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon={<People />}
            color="secondary"
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Revenue"
            value={formatPrice(stats.totalRevenue)}
            icon={<TrendingUp />}
            color="primary"
          />
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" color="primary.main" sx={{ mb: 2, fontWeight: 'bold' }}>
              Quick Actions
            </Typography>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Button
                  component={Link}
                  to="/admin/products"
                  variant="contained"
                  startIcon={<Add />}
                  fullWidth
                  size="large"
                  sx={{ py: 2, mb: 2 }}
                >
                  Add New Product
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/admin/products"
                  variant="outlined"
                  startIcon={<Edit />}
                  fullWidth
                  size="large"
                >
                  Manage Products
                </Button>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Button
                  component={Link}
                  to="/admin/orders"
                  variant="outlined"
                  startIcon={<Assessment />}
                  fullWidth
                  size="large"
                >
                  View Orders
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
              Admin Navigation
            </Typography>
            
            <List>
              <ListItem component={Link} to="/admin/products" sx={{ pl: 0, '&:hover': { bgcolor: 'rgba(255, 215, 0, 0.1)' } }}>
                <ListItemIcon>
                  <Inventory color="primary" />
                </ListItemIcon>
                <ListItemText 
                  primary="Product Management" 
                  secondary="Add, edit, and remove products"
                />
              </ListItem>
              
              
            </List>
          </Paper>
        </Grid>

        {/* Recent Products */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h5" color="primary.main" sx={{ mb: 2, fontWeight: 'bold' }}>
              Recent Products
            </Typography>
            
            {stats.recentProducts.length === 0 ? (
              <Box sx={{ textAlign: 'center', py: 4 }}>
                <Inventory sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                  No products yet
                </Typography>
                <Button
                  component={Link}
                  to="/admin/products"
                  variant="contained"
                  startIcon={<Add />}
                >
                  Add Your First Product
                </Button>
              </Box>
            ) : (
              <List>
                {stats.recentProducts.slice(0, 5).map((product) => (
                  <ListItem key={product._id} sx={{ pl: 0, borderBottom: '1px solid rgba(255, 215, 0, 0.1)' }}>
                    <ListItemText
                      primary={
                        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                          {product.name}
                        </Typography>
                      }
                      secondary={
                        <Box>
                          <Typography variant="body2" color="text.secondary">
                            {formatPrice(product.price)} • {product.quantity} in stock
                          </Typography>
                          <Typography variant="caption" color="primary.main">
                            {product.categories?.join(', ')}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default AdminDashboard;