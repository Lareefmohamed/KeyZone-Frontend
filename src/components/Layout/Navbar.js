// src/components/Layout/Navbar.js
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Avatar
} from '@mui/material';
import { ShoppingCart, Person, Logout, AccountBox, History } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();

  const handleUserMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleUserMenuClose();
    navigate('/');
  };

  return (
    <AppBar position="fixed" sx={{ zIndex: 1201 }}>
      <Toolbar>
        <Typography 
          variant="h4" 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1, 
            textDecoration: 'none', 
            color: 'primary.main',
            fontWeight: 'bold',
            letterSpacing: '2px'
          }}
        >
          KeyZone
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button color="inherit" component={Link} to="/products">
            All Products
          </Button>
          <Button color="inherit" component={Link} to="/products/category/Games">
            Games
          </Button>
          <Button color="inherit" component={Link} to="/products/category/Softwares">
            Software
          </Button>

          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={getCartItemsCount()} color="primary">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" onClick={handleUserMenuOpen}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main', color: 'black' }}>
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                  <AccountBox sx={{ mr: 2 }} />
                  Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
                  <History sx={{ mr: 2 }} />
                  Order History
                </MenuItem>
                <MenuItem onClick={handleLogout}>
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">
                Login
              </Button>
              <Button variant="contained" component={Link} to="/register">
                Register
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;

