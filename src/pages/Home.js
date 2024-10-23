import React from 'react';
import { Container, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Welcome to Wholesale Platform
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Connect with suppliers and manage your inventory
        </Typography>
        <Box sx={{ mt: 4 }}>
          <Button variant="contained" color="primary" component={Link} to="/products" sx={{ mr: 2 }}>
            Browse Products
          </Button>
          <Button variant="outlined" color="primary" component={Link} to="/suppliers">
            Find Suppliers
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default Home;
