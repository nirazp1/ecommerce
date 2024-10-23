import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, Paper } from '@mui/material';
import { Link } from 'react-router-dom';
import { getProducts, getSuppliers, getStoreName } from '../api';

function Home() {
  const [storeName, setStoreName] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredSuppliers, setFeaturedSuppliers] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeResponse, productsResponse, suppliersResponse] = await Promise.all([
          getStoreName(),
          getProducts(),
          getSuppliers()
        ]);
        setStoreName(storeResponse.data.name);
        setFeaturedProducts(productsResponse.data.slice(0, 4));
        setFeaturedSuppliers(suppliersResponse.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h3" component="h1" gutterBottom align="center">
          Welcome to {storeName}
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom align="center">
          Connect with suppliers and manage your inventory
        </Typography>
      </Box>

      {/* Hero Banner */}
      <Paper elevation={3} sx={{ p: 2, mb: 4, bgcolor: 'primary.main', color: 'primary.contrastText' }}>
        <Typography variant="h4">Special Offer!</Typography>
        <Typography variant="body1">Get 20% off on all electronics this week.</Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Main Content */}
        <Grid item xs={12}>
          {/* Featured Products */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Featured Products</Typography>
            <Grid container spacing={2}>
              {featuredProducts.map(product => (
                <Grid item key={product._id} xs={12} sm={6} md={3}>
                  <Card>
                    <CardMedia
                      component="img"
                      height="140"
                      image={product.image || 'https://via.placeholder.com/140'}
                      alt={product.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="subtitle1">{product.name}</Typography>
                      <Typography variant="h6" color="primary">${product.price.toFixed(2)}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button component={Link} to="/products" variant="contained" sx={{ mt: 2 }}>View All Products</Button>
          </Box>

          {/* Featured Suppliers */}
          <Box sx={{ mb: 4 }}>
            <Typography variant="h5" gutterBottom>Featured Suppliers</Typography>
            <Grid container spacing={2}>
              {featuredSuppliers.map(supplier => (
                <Grid item key={supplier._id} xs={12} sm={6} md={3}>
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="subtitle1">{supplier.companyName}</Typography>
                      <Typography variant="body2" color="text.secondary">{supplier.industry}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Button component={Link} to="/suppliers" variant="contained" sx={{ mt: 2 }}>View All Suppliers</Button>
          </Box>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
