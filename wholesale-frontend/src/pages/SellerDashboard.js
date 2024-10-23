import React from 'react';
import { Container, Typography, Grid, Paper, Box } from '@mui/material';

function SellerDashboard() {
  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Seller Dashboard
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Your Products
            </Typography>
            {/* Add a list or grid of the seller's products here */}
          </Paper>
        </Grid>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Sales Summary
            </Typography>
            {/* Add sales statistics here */}
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>
              Recent Orders
            </Typography>
            {/* Add a table of recent orders here */}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default SellerDashboard;
