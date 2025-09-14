// src/pages/Admin/AdminProducts.js
import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Paper, Button, Dialog, DialogTitle, DialogContent,
  DialogActions, TextField, Grid, Box, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, IconButton, Chip, Alert,
  FormControl, InputLabel, Select, MenuItem, FormHelperText, Avatar
} from '@mui/material';
import {
  Add, Edit, Delete, Save, Cancel, Image, Visibility
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
        productImgs: product.productImgs?.length > 0 ? product.productImgs : ['']
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
    if (formData.productImgs.length < 10) {
      setFormData(prev => ({
        ...prev,
        productImgs: [...prev.productImgs, '']
      }));
    }
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
    
    // Validate at least one valid image URL
    const validImages = formData.productImgs.filter(img => img && img.trim());
    if (validImages.length === 0) return 'At least one image URL is required';
    
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
        productImgs: formData.productImgs.filter(img => img && img.trim())
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const getValidImages = (productImgs) => {
    return productImgs?.filter(img => img && img.trim()) || [];
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
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Product</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Images</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Categories</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Price</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Stock</TableCell>
                <TableCell sx={{ color: 'black', fontWeight: 'bold' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((product) => {
                const validImages = getValidImages(product.productImgs);
                return (
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
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {validImages.length > 0 && (
                          <Avatar
                            src={validImages[0]}
                            alt={product.name}
                            sx={{ width: 50, height: 50 }}
                            variant="rounded"
                          />
                        )}
                        <Box>
                          <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                            {validImages.length} images
                          </Typography>
                          {validImages.length > 1 && (
                            <Typography variant="caption" color="text.secondary">
                              +{validImages.length - 1} more
                            </Typography>
                          )}
                        </Box>
                      </Box>
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
                        {formatPrice(product.price)}
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
                          onClick={() => window.open(`/product/${product._id}`, '_blank')}
                          title="View Product"
                        >
                          <Visibility />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="primary"
                          onClick={() => handleOpenDialog(product)}
                          title="Edit Product"
                        >
                          <Edit />
                        </IconButton>
                        <IconButton 
                          size="small" 
                          color="error"
                          onClick={() => handleDelete(product._id)}
                          title="Delete Product"
                        >
                          <Delete />
                        </IconButton>
                      </Box>
                    </TableCell>
                  </TableRow>
                );
              })}
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
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Add multiple images to showcase your product. The first image will be used as the main image.
                </Typography>
                {formData.productImgs.map((img, index) => (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', gap: 1, mb: 1, alignItems: 'center' }}>
                      <TextField
                        fullWidth
                        label={index === 0 ? `Main Image URL` : `Image URL ${index + 1}`}
                        value={img}
                        onChange={(e) => handleImageChange(index, e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        helperText={index === 0 ? "This will be the main product image" : ""}
                      />
                      {formData.productImgs.length > 1 && (
                        <IconButton 
                          color="error" 
                          onClick={() => removeImageField(index)}
                          size="small"
                          title="Remove image"
                        >
                          <Delete />
                        </IconButton>
                      )}
                    </Box>
                    {/* Image Preview */}
                    {img && img.trim() && (
                      <Box sx={{ 
                        width: 100, 
                        height: 100, 
                        border: '2px solid rgba(255, 215, 0, 0.3)',
                        borderRadius: 2,
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        bgcolor: 'background.paper'
                      }}>
                        <img
                          src={img}
                          alt={`Preview ${index + 1}`}
                          style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'cover'
                          }}
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                          }}
                        />
                        <Typography 
                          variant="caption" 
                          color="error"
                          sx={{ display: 'none', textAlign: 'center', p: 1 }}
                        >
                          Invalid image URL
                        </Typography>
                      </Box>
                    )}
                  </Box>
                ))}
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Button 
                    variant="outlined" 
                    startIcon={<Add />} 
                    onClick={addImageField}
                    size="small"
                    disabled={formData.productImgs.length >= 10}
                  >
                    Add Image
                  </Button>
                  <Typography variant="caption" color="text.secondary">
                    {formData.productImgs.length}/10 images ({formData.productImgs.filter(img => img && img.trim()).length} with URLs)
                  </Typography>
                </Box>
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