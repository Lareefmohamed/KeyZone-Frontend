// src/components/ErrorBoundary.js
import React from 'react';
import { Container, Paper, Typography, Button, Box } from '@mui/material';
import { Error, Refresh, Home } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console for debugging
    console.error('Error caught by boundary:', error, errorInfo);
  }

  handleRefresh = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <Container maxWidth="md" sx={{ py: 8 }}>
          <Paper 
            sx={{ 
              p: 6, 
              textAlign: 'center',
              background: 'linear-gradient(135deg, #1a1a1a 0%, #2a2a2a 100%)',
              border: '2px solid rgba(255, 215, 0, 0.3)'
            }}
          >
            <Error 
              sx={{ 
                fontSize: 80, 
                color: 'error.main', 
                mb: 2 
              }} 
            />
            
            <Typography 
              variant="h4" 
              gutterBottom 
              sx={{ 
                color: 'primary.main',
                fontWeight: 'bold',
                mb: 2
              }}
            >
              Oops! Something went wrong
            </Typography>
            
            <Typography 
              variant="h6" 
              color="text.secondary" 
              sx={{ mb: 4 }}
            >
              We're sorry, but an unexpected error occurred while loading this page.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                startIcon={<Refresh />}
                onClick={this.handleRefresh}
                sx={{ px: 3 }}
              >
                Refresh Page
              </Button>
              
              <Button
                variant="outlined"
                startIcon={<Home />}
                onClick={this.handleGoHome}
                sx={{ px: 3 }}
              >
                Go Home
              </Button>
            </Box>

            {/* Error Details (only in development) */}
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <Paper 
                sx={{ 
                  mt: 4, 
                  p: 3, 
                  bgcolor: 'grey.900',
                  border: '1px solid rgba(255, 0, 0, 0.3)'
                }}
              >
                <Typography variant="h6" color="error.main" gutterBottom>
                  Development Error Details:
                </Typography>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontFamily: 'monospace',
                    fontSize: '0.8rem',
                    color: 'error.light',
                    textAlign: 'left',
                    whiteSpace: 'pre-wrap'
                  }}
                >
                  {this.state.error.toString()}
                </Typography>
                
                {this.state.errorInfo && (
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontFamily: 'monospace',
                      fontSize: '0.8rem',
                      color: 'text.secondary',
                      textAlign: 'left',
                      whiteSpace: 'pre-wrap',
                      mt: 2
                    }}
                  >
                    {this.state.errorInfo.componentStack}
                  </Typography>
                )}
              </Paper>
            )}
          </Paper>
        </Container>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;