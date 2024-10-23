import React, { useState } from 'react';
import { 
  Container, Typography, TextField, Button, Box, Paper, Grid, 
  Chip, Input, IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import PhotoCamera from '@mui/icons-material/PhotoCamera';
import { useNavigate } from 'react-router-dom';
import { registerBusiness } from '../api';

function BusinessRegistration() {
  const [businessData, setBusinessData] = useState({
    companyName: '',
    storeName: '',
    address: '',
    phoneNumber: '',
    description: '',
    storePhotos: [],
    productCategories: []
  });
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBusinessData(prev => ({ ...prev, [name]: value }));
  };

  const handleAddCategory = () => {
    if (category && !businessData.productCategories.includes(category)) {
      setBusinessData(prev => ({
        ...prev,
        productCategories: [...prev.productCategories, category]
      }));
      setCategory('');
    }
  };

  const handleRemoveCategory = (categoryToRemove) => {
    setBusinessData(prev => ({
      ...prev,
      productCategories: prev.productCategories.filter(cat => cat !== categoryToRemove)
    }));
  };

  const handlePhotoUpload = (event) => {
    const files = Array.from(event.target.files);
    // In a real application, you would upload these files to a server and get back URLs
    // For this example, we'll just use fake URLs
    const newPhotos = files.map((file, index) => `https://fake-url.com/photo${index + 1}.jpg`);
    setBusinessData(prev => ({
      ...prev,
      storePhotos: [...prev.storePhotos, ...newPhotos]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await registerBusiness(businessData);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to register business. Please try again.');
      console.error('Business registration error:', error);
    }
  };

  return (
    <Container component="main" maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" gutterBottom>Register Your Business</Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="companyName"
                label="Company Name"
                value={businessData.companyName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                name="storeName"
                label="Store Name"
                value={businessData.storeName}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="address"
                label="Address"
                value={businessData.address}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="phoneNumber"
                label="Phone Number"
                value={businessData.phoneNumber}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={4}
                name="description"
                label="Business Description"
                value={businessData.description}
                onChange={handleInputChange}
              />
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Store Photos</Typography>
              <Input
                accept="image/*"
                id="icon-button-file"
                type="file"
                onChange={handlePhotoUpload}
                multiple
                style={{ display: 'none' }}
              />
              <label htmlFor="icon-button-file">
                <IconButton color="primary" aria-label="upload picture" component="span">
                  <PhotoCamera />
                </IconButton>
              </label>
              <Box sx={{ mt: 2 }}>
                {businessData.storePhotos.map((photo, index) => (
                  <Chip key={index} label={`Photo ${index + 1}`} onDelete={() => {/* Handle delete */}} sx={{ m: 0.5 }} />
                ))}
              </Box>
            </Grid>
            <Grid item xs={12}>
              <Typography variant="subtitle1" gutterBottom>Product Categories</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <TextField
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  label="Add Category"
                  variant="outlined"
                  size="small"
                  sx={{ mr: 1 }}
                />
                <IconButton onClick={handleAddCategory} color="primary">
                  <AddIcon />
                </IconButton>
              </Box>
              <Box sx={{ mt: 2 }}>
                {businessData.productCategories.map((cat, index) => (
                  <Chip key={index} label={cat} onDelete={() => handleRemoveCategory(cat)} sx={{ m: 0.5 }} />
                ))}
              </Box>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3 }}
          >
            Register Business
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default BusinessRegistration;
