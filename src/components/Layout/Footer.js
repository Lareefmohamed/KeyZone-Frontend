// src/components/Layout/Footer.js
import React from 'react';
import { Box, Container, Typography, Grid, Link, Divider } from '@mui/material';

const Footer = () => {
  return (
    <Box 
      sx={{ 
        bgcolor: 'secondary.main', 
        color: 'white', 
        mt: 'auto',
        borderTop: '2px solid',
        borderColor: 'primary.main'
      }}
    >
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              KeyZone
            </Typography>
            <Typography variant="body2">
              Your premium destination for digital game keys and software licenses. 
              Get instant access to the latest games and professional software.
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Categories
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="/products/category/Games" color="inherit" underline="hover">
                Games
              </Link>
              <Link href="/products/category/Softwares" color="inherit" underline="hover">
                Software
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" sx={{ color: 'primary.main', mb: 2 }}>
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Link href="#" color="inherit" underline="hover">
                Help Center
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Contact Us
              </Link>
              <Link href="#" color="inherit" underline="hover">
                Terms of Service
              </Link>
            </Box>
          </Grid>
        </Grid>
        <Divider sx={{ my: 3, bgcolor: 'primary.main' }} />
        <Typography variant="body2" align="center">
          © 2024 KeyZone. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;

