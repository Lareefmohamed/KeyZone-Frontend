// src/components/Products/ProductFilters.js
import React from 'react';
import {
  Box, FormControl, InputLabel, Select, MenuItem, TextField, Button
} from '@mui/material';
import { Search, Clear } from '@mui/icons-material';

const ProductFilters = ({ 
  filters, 
  onFilterChange, 
  onSearch, 
  onClear 
}) => {
  return (
    <Box sx={{ mb: 3, display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        placeholder="Search products..."
        variant="outlined"
        size="small"
        value={filters.search || ''}
        onChange={(e) => onFilterChange('search', e.target.value)}
        sx={{ minWidth: 200 }}
      />
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={filters.category || ''}
          label="Category"
          onChange={(e) => onFilterChange('category', e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Games">Games</MenuItem>
          <MenuItem value="Softwares">Software</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Sort By</InputLabel>
        <Select
          value={filters.sortBy || 'createdAt'}
          label="Sort By"
          onChange={(e) => onFilterChange('sortBy', e.target.value)}
        >
          <MenuItem value="createdAt">Newest</MenuItem>
          <MenuItem value="price">Price</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>
      
      <FormControl size="small" sx={{ minWidth: 100 }}>
        <InputLabel>Order</InputLabel>
        <Select
          value={filters.sortOrder || 'desc'}
          label="Order"
          onChange={(e) => onFilterChange('sortOrder', e.target.value)}
        >
          <MenuItem value="desc">Descending</MenuItem>
          <MenuItem value="asc">Ascending</MenuItem>
        </Select>
      </FormControl>
      
      <Button
        variant="contained"
        startIcon={<Search />}
        onClick={onSearch}
      >
        Search
      </Button>
      
      <Button
        variant="outlined"
        startIcon={<Clear />}
        onClick={onClear}
      >
        Clear
      </Button>
    </Box>
  );
};

export default ProductFilters;