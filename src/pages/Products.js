// src/pages/Products.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container, Typography, Grid, Box, Pagination, CircularProgress, Alert, Breadcrumbs, Link
} from '@mui/material';
import { NavigateNext, Home } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import ProductCard from '../components/Products/ProductCard';
import ProductFilters from '../components/Products/ProductFilters';
import productService from '../services/productService';

const Products = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [pagination, setPagination] = useState({});
  const [filters, setFilters] = useState({
    category: category || '',
    search: '',
    sortBy: 'createdAt',
    sortOrder: 'desc',
    page: 1,
    limit: 12
  });

  // Valid categories
  const validCategories = ['Games', 'Softwares'];

  // Handle category changes from URL
  useEffect(() => {
    // Validate category parameter
    if (category && !validCategories.includes(category)) {
      navigate('/products', { replace: true });
      return;
    }
    
    // Set filters with the correct category immediately
    setFilters(prev => ({
      ...prev,
      category: category || '',
      page: 1
    }));
  }, [category, navigate]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [filters]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // Prepare query parameters
      const queryParams = {
        page: filters.page,
        limit: filters.limit,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder
      };

      // Add category filter if present - this is crucial
      if (filters.category && filters.category.trim()) {
        queryParams.category = filters.category;
        console.log('Adding category filter:', filters.category); // Debug log
      }

      // Add search filter if present
      if (filters.search && filters.search.trim()) {
        queryParams.search = filters.search.trim();
      }

      console.log('Fetching products with params:', queryParams); // Debug log

      const response = await productService.getAllProducts(queryParams);
      
      if (response.data.success) {
        setProducts(response.data.data);
        setPagination(response.data.pagination);
        console.log('Fetched products:', response.data.data.length, 'products'); // Debug log
      } else {
        setError('Failed to load products');
      }
    } catch (error) {
      console.error('Error fetching products:', error);
      setError('Unable to load products. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ 
      ...prev, 
      [key]: value,
      page: key !== 'page' ? 1 : value // Reset page when other filters change
    }));
  };

  const handleSearch = () => {
    setFilters(prev => ({ ...prev, page: 1 }));
  };

  const handleClear = () => {
    setFilters({
      category: category || '', // Keep URL category or clear it
      search: '',
      sortBy: 'createdAt',
      sortOrder: 'desc',
      page: 1,
      limit: 12
    });
  };

  const handlePageChange = (event, page) => {
    setFilters(prev => ({ ...prev, page }));
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getPageTitle = () => {
    if (category) {
      return category === 'Softwares' ? 'Software' : category;
    }
    return 'All Products';
  };

  const getBreadcrumbs = () => {
    const breadcrumbs = [
      <Link 
        key="home"
        component={RouterLink} 
        to="/" 
        sx={{ display: 'flex', alignItems: 'center', color: 'primary.main', textDecoration: 'none' }}
      >
        <Home sx={{ mr: 0.5, fontSize: 20 }} />
        Home
      </Link>,
      <Link 
        key="products"
        component={RouterLink} 
        to="/products"
        sx={{ color: category ? 'text.primary' : 'primary.main', textDecoration: 'none' }}
      >
        Products
      </Link>
    ];

    if (category) {
      breadcrumbs.push(
        <Typography key="category" color="primary.main" sx={{ fontWeight: 'bold' }}>
          {getPageTitle()}
        </Typography>
      );
    }

    return breadcrumbs;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Breadcrumbs */}
      <Breadcrumbs 
        separator={<NavigateNext fontSize="small" />} 
        sx={{ mb: 3 }}
        aria-label="breadcrumb"
      >
        {getBreadcrumbs()}
      </Breadcrumbs>

      {/* Page Title */}
      <Typography 
        variant="h3" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: 'primary.main', 
          fontWeight: 'bold',
          textAlign: 'center',
          mb: 4 
        }}
      >
        {getPageTitle()} - <Box component="span" sx={{ fontWeight: 'bold' }}>KeyZone</Box>
      </Typography>

      {/* Category Description */}
      {category && (
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Typography variant="h6" color="text.secondary">
            {category === 'Games' 
              ? 'Discover the latest digital game keys for PC, console, and mobile platforms'
              : 'Find professional software and productivity tools for your business needs'
            }
          </Typography>
        </Box>
      )}

      {/* Filters */}
      <ProductFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onSearch={handleSearch}
        onClear={handleClear}
      />

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
          <Box sx={{ mt: 1 }}>
            <Typography variant="body2">
              Try refreshing the page or adjusting your search criteria.
            </Typography>
          </Box>
        </Alert>
      )}

      {/* Loading State */}
      {loading ? (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 8 }}>
          <CircularProgress size={60} sx={{ color: 'primary.main', mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Loading products...
          </Typography>
        </Box>
      ) : (
        <>
          {/* Results Info */}
          {!error && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="body1" color="text.secondary">
                {pagination.total > 0 
                  ? `Showing ${((pagination.current - 1) * filters.limit) + 1}-${Math.min(pagination.current * filters.limit, pagination.total)} of ${pagination.total} products`
                  : 'No products found'
                }
                {filters.category && (
                  <Box component="span" sx={{ ml: 1, color: 'primary.main', fontWeight: 'bold' }}>
                    in {filters.category}
                  </Box>
                )}
              </Typography>
            </Box>
          )}

          {/* Products Grid */}
          <Grid container spacing={4}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product._id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>

          {/* Empty State */}
          {products.length === 0 && !error && (
            <Box sx={{ textAlign: 'center', py: 8 }}>
              <Typography variant="h5" gutterBottom color="text.secondary">
                No products found
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3 }}>
                {filters.search 
                  ? `No products match your search for "${filters.search}"`
                  : category 
                  ? `No products are available in ${category}` 
                  : 'No products are available'
                }
              </Typography>
              {filters.search && (
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Try different keywords or browse all products
                </Typography>
              )}
            </Box>
          )}

          {/* Pagination */}
          {pagination.pages > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
              <Pagination
                count={pagination.pages}
                page={pagination.current}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton
                showLastButton
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: 'text.primary',
                    borderColor: 'rgba(255, 215, 0, 0.3)',
                  },
                  '& .Mui-selected': {
                    backgroundColor: 'primary.main !important',
                    color: 'black !important',
                  }
                }}
              />
            </Box>
          )}
        </>
      )}
    </Container>
  );
};

export default Products;