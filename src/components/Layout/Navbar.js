// src/components/Layout/Navbar.js
import React, { useState } from 'react';
import {
  AppBar, Toolbar, Typography, Button, Box, IconButton, Badge, Menu, MenuItem, Avatar, Divider
} from '@mui/material';
import { ShoppingCart, Person, Logout, AccountBox, History, Store } from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { user, logout, isAuthenticated } = useAuth();
  const { getCartItemsCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

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

  const isActivePage = (path) => {
    if (path === '/products') {
      return location.pathname === '/products' || location.pathname.startsWith('/products/category/');
    }
    return location.pathname === path;
  };

  return (
    <AppBar 
      position="fixed" 
      sx={{ 
        zIndex: 1201,
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        borderBottom: '2px solid #FFD700',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Toolbar sx={{ minHeight: '70px !important', px: { xs: 2, md: 4 } }}>
        {/* Logo */}
        <Box 
          component={Link} 
          to="/" 
          sx={{ 
            flexGrow: 1,
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            transition: 'transform 0.2s ease'
          }}
        >
          <Store sx={{ 
            fontSize: 40, 
            color: 'primary.main', 
            mr: 2,
            filter: 'drop-shadow(0 2px 4px rgba(255, 215, 0, 0.3))'
          }} />
          <Typography 
            variant="h3" 
            sx={{ 
              color: 'primary.main',
              fontWeight: 'bold',
              letterSpacing: '3px',
              fontSize: { xs: '1.8rem', md: '2.5rem' },
              textShadow: '0 2px 4px rgba(255, 215, 0, 0.3)',
              transition: 'all 0.2s ease',
              '&:hover': {
                textShadow: '0 4px 8px rgba(255, 215, 0, 0.5)',
                transform: 'scale(1.02)'
              }
            }}
          >
            KeyZone
          </Typography>
        </Box>

        {/* Navigation Links */}
        <Box sx={{ display: { xs: 'none', md: 'flex' }, alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products"
            sx={{ 
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: isActivePage('/products') ? 'bold' : 'normal',
              backgroundColor: isActivePage('/products') ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              color: isActivePage('/products') ? 'primary.main' : 'inherit',
              border: isActivePage('/products') ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: 'primary.main',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }
            }}
          >
            All Products
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products/category/Games"
            sx={{ 
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: isActivePage('/products/category/Games') ? 'bold' : 'normal',
              backgroundColor: isActivePage('/products/category/Games') ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              color: isActivePage('/products/category/Games') ? 'primary.main' : 'inherit',
              border: isActivePage('/products/category/Games') ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: 'primary.main',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }
            }}
          >
            Games
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products/category/Softwares"
            sx={{ 
              px: 2,
              py: 1,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: isActivePage('/products/category/Softwares') ? 'bold' : 'normal',
              backgroundColor: isActivePage('/products/category/Softwares') ? 'rgba(255, 215, 0, 0.1)' : 'transparent',
              color: isActivePage('/products/category/Softwares') ? 'primary.main' : 'inherit',
              border: isActivePage('/products/category/Softwares') ? '1px solid rgba(255, 215, 0, 0.3)' : '1px solid transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 215, 0, 0.1)',
                color: 'primary.main',
                border: '1px solid rgba(255, 215, 0, 0.3)'
              }
            }}
          >
            Software
          </Button>
        </Box>

        {/* Mobile Navigation - Simplified */}
        <Box sx={{ display: { xs: 'flex', md: 'none' }, alignItems: 'center', gap: 1 }}>
          <Button 
            color="inherit" 
            component={Link} 
            to="/products"
            size="small"
            sx={{ 
              minWidth: 'auto',
              px: 1,
              color: isActivePage('/products') ? 'primary.main' : 'inherit',
            }}
          >
            Products
          </Button>
        </Box>

        {/* Cart and User Actions */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, ml: 2 }}>
          <IconButton 
            color="inherit" 
            component={Link} 
            to="/cart"
            sx={{
              transition: 'all 0.2s ease',
              '&:hover': {
                transform: 'scale(1.1)',
                color: 'primary.main'
              }
            }}
          >
            <Badge 
              badgeContent={getCartItemsCount()} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  backgroundColor: '#FFD700',
                  color: 'black',
                  fontWeight: 'bold'
                }
              }}
            >
              <ShoppingCart />
            </Badge>
          </IconButton>

          {isAuthenticated ? (
            <>
              <IconButton 
                color="inherit" 
                onClick={handleUserMenuOpen}
                sx={{
                  ml: 1,
                  '&:hover': {
                    transform: 'scale(1.05)'
                  }
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36, 
                    bgcolor: 'primary.main', 
                    color: 'black',
                    fontWeight: 'bold',
                    border: '2px solid rgba(255, 215, 0, 0.3)',
                    '&:hover': {
                      border: '2px solid #FFD700'
                    }
                  }}
                >
                  {user?.username?.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleUserMenuClose}
                PaperProps={{
                  sx: {
                    mt: 1,
                    minWidth: 200,
                    bgcolor: 'background.paper',
                    border: '1px solid rgba(255, 215, 0, 0.2)',
                    '& .MuiMenuItem-root': {
                      px: 2,
                      py: 1.5,
                      '&:hover': {
                        backgroundColor: 'rgba(255, 215, 0, 0.1)'
                      }
                    }
                  }
                }}
                transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
              >
                <Box sx={{ px: 2, py: 1, borderBottom: '1px solid rgba(255, 215, 0, 0.2)' }}>
                  <Typography variant="subtitle2" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                    {user?.username}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
                <MenuItem onClick={() => { navigate('/profile'); handleUserMenuClose(); }}>
                  <AccountBox sx={{ mr: 2, color: 'primary.main' }} />
                  My Profile
                </MenuItem>
                <MenuItem onClick={() => { navigate('/orders'); handleUserMenuClose(); }}>
                  <History sx={{ mr: 2, color: 'primary.main' }} />
                  Order History
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                  <Logout sx={{ mr: 2 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                color="inherit" 
                component={Link} 
                to="/login"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  '&:hover': {
                    backgroundColor: 'rgba(255, 215, 0, 0.1)',
                    color: 'primary.main'
                  }
                }}
              >
                Login
              </Button>
              <Button 
                variant="contained" 
                component={Link} 
                to="/register"
                sx={{
                  borderRadius: 2,
                  px: 3,
                  backgroundColor: 'primary.main',
                  color: 'black',
                  fontWeight: 'bold',
                  '&:hover': {
                    backgroundColor: '#FFA000',
                    transform: 'translateY(-1px)',
                    boxShadow: '0 6px 20px rgba(255, 215, 0, 0.4)'
                  }
                }}
              >
                Register
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;