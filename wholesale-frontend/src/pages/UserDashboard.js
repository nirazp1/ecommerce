import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, Avatar, 
  List, ListItem, ListItemText, Divider, Button, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  CircularProgress
} from '@mui/material';
import { AuthContext } from '../contexts/AuthContext';
import { getProfile, getRecentOrders, getFavoriteProducts } from '../api';

function UserDashboard() {
  const { user } = useContext(AuthContext);
  const [profile, setProfile] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileData, ordersData, favoritesData] = await Promise.all([
          getProfile(),
          getRecentOrders(),
          getFavoriteProducts()
        ]);
        console.log('Profile data:', profileData);
        console.log('Orders data:', ordersData);
        console.log('Favorites data:', favoritesData);
        setProfile(profileData.data);
        setRecentOrders(ordersData.data);
        setFavoriteProducts(favoritesData.data);
      } catch (error) {
        console.error('Error fetching user data:', error.response || error);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  if (!profile) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography>No profile data available.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4} lg={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar sx={{ width: 100, height: 100, mb: 2 }}>
              {profile.profile && profile.profile.fullName ? profile.profile.fullName[0] : 'U'}
            </Avatar>
            <Typography variant="h5" gutterBottom>{profile.profile?.fullName || 'User'}</Typography>
            <Typography variant="body1" color="textSecondary">{profile.email}</Typography>
            <Button variant="outlined" sx={{ mt: 2 }}>Edit Profile</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8} lg={9}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h6" gutterBottom>Account Information</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Company" secondary={profile.profile?.companyName || 'Not set'} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Role" secondary={profile.role || 'Not set'} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Address" secondary={profile.profile?.address || 'Not set'} />
              </ListItem>
              <Divider />
              <ListItem>
                <ListItemText primary="Phone" secondary={profile.profile?.phoneNumber || 'Not set'} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Recent Orders</Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Order ID</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Total</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {recentOrders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell>{order.id}</TableCell>
                      <TableCell>{new Date(order.date).toLocaleDateString()}</TableCell>
                      <TableCell>${order.total.toFixed(2)}</TableCell>
                      <TableCell>{order.status}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text">View All Orders</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Favorite Products</Typography>
            <List>
              {favoriteProducts.map((product) => (
                <ListItem key={product.id}>
                  <ListItemText primary={product.name} secondary={`$${product.price.toFixed(2)}`} />
                </ListItem>
              ))}
            </List>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
              <Button variant="text">View All Favorites</Button>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>Account Summary</Typography>
            <List>
              <ListItem>
                <ListItemText primary="Total Orders" secondary={recentOrders.length} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Favorite Products" secondary={favoriteProducts.length} />
              </ListItem>
              <ListItem>
                <ListItemText primary="Account Status" secondary={profile.kycVerified ? "Verified" : "Unverified"} />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default UserDashboard;
