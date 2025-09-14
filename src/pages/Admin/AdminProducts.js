// src/pages/Admin/AdminProducts.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Alert,
  FormControl, InputLabel, Select, MenuItem, FormHelperText
} from '@mui/material';
import {
  Add, Edit, Delete, Save, Cancel, Image
} from '@mui/icons-material';
import { useAuth } from '../../contexts/AuthContext';
import productService from '../../services/productService';

const AdminProducts = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    quantity: '',
    categories: [],
    productImgs: ['']
  });

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchProducts();
    }
  }, [user]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await productService.getAllProducts({ limit: 100 });
      setProducts(response.data.data);
    } catch (error) {
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (product = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        description: product.description,
        price: product.price.toString(),
        quantity: product.quantity.toString(),
        categories: product.categories || [],
        productImgs: product.productImgs || ['']
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        description: '',
        price: '',
        quantity: '',
        categories: [],
        productImgs: ['']
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingProduct(null);
    setError('');
    setSuccess('');
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (index, value) => {
    const newImages = [...formData.productImgs];
    newImages[index] = value;
    setFormData(prev => ({
      ...prev,
      productImgs: newImages
    }));
  };

  const addImageField = () => {
    setFormData(prev => ({
      ...prev,
      productImgs: [...prev.productImgs, '']
    }));
  };

  const removeImageField = (index) => {
    const newImages = formData.productImgs.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      productImgs: newImages.length > 0 ? newImages : ['']
    }));
  };

  const validateForm = () => {
    if (!formData.name.trim()) return 'Product name is required';
    if (!formData.description.trim()) return 'Description is required';
    if (!formData.price || isNaN(formData.price) || Number(formData.price) < 0) {
      return 'Valid price is required';
    }
    if (!formData.quantity || isNaN(formData.quantity) || Number(formData.quantity) < 0) {
      return 'Valid quantity is required';
    }
    if (formData.categories.length === 0) return 'At least one category is required';
    return null;
  };

  const handleSubmit = async () => {
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    try {
      const productData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        price: Number(formData.price),
        quantity: Number(formData.quantity),
        categories: formData.categories,
        productImgs: formData.productImgs.filter(img => img.trim())
      };

      if (editingProduct) {
        await productService.updateProduct(editingProduct._id, productData);
        setSuccess('Product updated successfully!');
      } else {
        await productService.createProduct(productData);
        setSuccess('Product created successfully!');
      }

      fetchProducts();
      handleCloseDialog();
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to save product');
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) {
      return;
    }

    try {
      await productService.deleteProduct(productId);
      setSuccess('Product deleted successfully!');
      fetchProducts();
    } catch (error) {
      setError('Failed to delete product');
    }
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

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" color="primary.main" sx={{ fontWeight: 'bold' }}>
            Product Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
            sx={{ px: 3 }}
          >
            Add Product
          </Button>
        </Box>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <TableContainer component={Paper} sx={{ mt: 2 }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: 'primary.main' }}>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Name</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Categories</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Quantity</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product._id} hover>
                  <TableCell>
                    <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                      {product.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                      {product.description.substring(0, 60)}...
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                      {product.categories?.map((category) => (
                        <Chip 
                          key={category} 
                          label={category} 
                          size="small" 
                          color={category === 'Games' ? 'error' : 'info'}
                        />
                      ))}
                    </Box>
                  </TableCell>
                  <TableCell>
                    <Typography variant="h6" color="primary.main">
                      ${product.price}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={product.quantity} 
                      color={product.quantity > 10 ? 'success' : product.quantity > 0 ? 'warning' : 'error'}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <IconButton 
                        size="small" 
                        color="primary"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton 
                        size="small" 
                        color="error"
                        onClick={() => handleDelete(product._id)}
                      >
                        <Delete />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Add/Edit Product Dialog */}
        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="md" fullWidth>
          <DialogTitle sx={{ bgcolor: 'primary.main', color: 'black' }}>
            {editingProduct ? 'Edit Product' : 'Add New Product'}
          </DialogTitle>
          <DialogContent sx={{ pt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Product Name"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth required>
                  <InputLabel>Categories</InputLabel>
                  <Select
                    multiple
                    value={formData.categories}
                    onChange={(e) => handleInputChange('categories', e.target.value)}
                    renderValue={(selected) => selected.join(', ')}
                  >
                    <MenuItem value="Games">Games</MenuItem>
                    <MenuItem value="Softwares">Software</MenuItem>
                  </Select>
                  <FormHelperText>Select one or more categories</FormHelperText>
                </FormControl>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  label="Description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Price ($)"
                  type="number"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  required
                  inputProps={{ min: 0, step: 0.01 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Quantity"
                  type="number"
                  value={formData.quantity}
                  onChange={(e) => handleInputChange('quantity', e.target.value)}
                  required
                  inputProps={{ min: 0 }}
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center' }}>
                  <Image sx={{ mr: 1 }} />
                  Product Images
                </Typography>
                {formData.productImgs.map((img, index) => (
                  <Box key={index} sx={{ display: 'flex', gap: 1, mb: 2, alignItems: 'center' }}>
                    <TextField
                      fullWidth
                      label={`Image URL ${index + 1}`}
                      value={img}
                      onChange={(e) => handleImageChange(index, e.target.value)}
                      placeholder="https://example.com/image.jpg"
                    />
                    {formData.productImgs.length > 1 && (
                      <IconButton 
                        color="error" 
                        onClick={() => removeImageField(index)}
                        size="small"
                      >
                        <Delete />
                      </IconButton>
                    )}
                  </Box>
                ))}
                <Button 
                  variant="outlined" 
                  startIcon={<Add />} 
                  onClick={addImageField}
                  size="small"
                >
                  Add Image
                </Button>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseDialog} startIcon={<Cancel />}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit} 
              variant="contained" 
              startIcon={<Save />}
            >
              {editingProduct ? 'Update' : 'Create'} Product
            </Button>
          </DialogActions>
        </Dialog>
      </Paper>
    </Container>
  );
};

export default AdminProducts;