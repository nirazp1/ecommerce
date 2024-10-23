import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Grid, Paper, Box, Button, TextField, 
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
  Dialog, DialogActions, DialogContent, DialogTitle, IconButton,
  Card, CardContent, CircularProgress, Snackbar, Alert, Tabs, Tab,
  List, ListItem, ListItemText, ListItemAvatar, Avatar, Chip, 
  useTheme, useMediaQuery, Drawer, AppBar, Toolbar, Divider,
  ListItemIcon, Menu, MenuItem
} from '@mui/material';
import { 
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon,
  TrendingUp, AttachMoney, Inventory, Star, Dashboard, 
  ShoppingCart, Analytics, Settings, Menu as MenuIcon,
  Notifications, Person, ExitToApp
} from '@mui/icons-material';
import { styled } from '@mui/material/styles';
import { getSellerProfile, updateSellerProfile, getSellerProducts, addProduct, updateProduct, deleteProduct } from '../api';
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

const Main = styled('main', { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen,
      }),
      marginLeft: 0,
    }),
  }),
);

const demoProducts = [
  { _id: 'demo1', name: 'Premium Headphones', description: 'High-quality wireless headphones', category: 'Electronics', price: 199.99, quantity: 50 },
  { _id: 'demo2', name: 'Ergonomic Office Chair', description: 'Comfortable chair for long work hours', category: 'Furniture', price: 249.99, quantity: 30 },
  { _id: 'demo3', name: 'Smart Home Hub', description: 'Control your entire home with voice commands', category: 'Smart Home', price: 129.99, quantity: 75 },
];

function SellerDashboard() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [profile, setProfile] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [currentProduct, setCurrentProduct] = useState({ name: '', description: '', price: '', quantity: '', category: '' });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [error, setError] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(!isMobile);
  const [anchorEl, setAnchorEl] = useState(null);
  const [useDemo, setUseDemo] = useState(false);

  useEffect(() => {
    if (!isAuthenticated || userRole !== 'seller') {
      navigate('/login');
    } else {
      fetchSellerData();
    }
  }, [isAuthenticated, userRole, navigate]);

  const fetchSellerData = async () => {
    try {
      setLoading(true);
      const [profileData, productsData] = await Promise.all([
        getSellerProfile(),
        getSellerProducts()
      ]);
      setProfile(profileData.data);
      setProducts(productsData.data.length > 0 ? productsData.data : demoProducts);
      setUseDemo(productsData.data.length === 0);
    } catch (error) {
      console.error('Error fetching seller data:', error);
      setError('Failed to load seller data. Using demo data.');
      setProducts(demoProducts);
      setUseDemo(true);
    } finally {
      setLoading(false);
    }
  };

  const handleProfileUpdate = async (event) => {
    event.preventDefault();
    try {
      await updateSellerProfile(profile);
      showSnackbar('Profile updated successfully', 'success');
    } catch (error) {
      console.error('Error updating profile:', error);
      showSnackbar('Failed to update profile', 'error');
    }
  };

  const handleProductSubmit = async (event) => {
    event.preventDefault();
    if (useDemo) {
      if (currentProduct._id) {
        setProducts(products.map(p => p._id === currentProduct._id ? currentProduct : p));
      } else {
        setProducts([...products, { ...currentProduct, _id: `demo${products.length + 1}` }]);
      }
      setOpenProductDialog(false);
      showSnackbar('Product updated successfully', 'success');
    } else {
      try {
        if (currentProduct._id) {
          await updateProduct(currentProduct._id, currentProduct);
          showSnackbar('Product updated successfully', 'success');
        } else {
          await addProduct(currentProduct);
          showSnackbar('Product added successfully', 'success');
        }
        setOpenProductDialog(false);
        fetchSellerData();
      } catch (error) {
        console.error('Error submitting product:', error);
        showSnackbar('Failed to submit product', 'error');
      }
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (useDemo) {
      setProducts(products.filter(p => p._id !== productId));
      showSnackbar('Product deleted successfully', 'success');
    } else {
      try {
        await deleteProduct(productId);
        showSnackbar('Product deleted successfully', 'success');
        fetchSellerData();
      } catch (error) {
        console.error('Error deleting product:', error);
        showSnackbar('Failed to delete product', 'error');
      }
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleDrawerToggle = () => {
    setDrawerOpen(!drawerOpen);
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const drawer = (
    <div>
      <Toolbar>
        <Typography variant="h6" noWrap component="div">
          Seller Dashboard
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {['Dashboard', 'Products', 'Orders', 'Analytics', 'Settings'].map((text, index) => (
          <ListItem button key={text} onClick={() => setTabValue(index)}>
            <ListItemIcon>
              {index === 0 ? <Dashboard /> : 
               index === 1 ? <Inventory /> : 
               index === 2 ? <ShoppingCart /> : 
               index === 3 ? <Analytics /> : <Settings />}
            </ListItemIcon>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </div>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>Error</Typography>
        <Typography color="error">{error}</Typography>
      </Container>
    );
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, ...(drawerOpen && { display: 'none' }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            {profile?.storeName || 'Seller Dashboard'}
          </Typography>
          <IconButton color="inherit">
            <Notifications />
          </IconButton>
          <IconButton color="inherit" onClick={handleMenuOpen}>
            <Person />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
          >
            <MenuItem onClick={handleMenuClose}>Profile</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>
      <Drawer
        variant={isMobile ? 'temporary' : 'permanent'}
        open={drawerOpen}
        onClose={handleDrawerToggle}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        {drawer}
      </Drawer>
      <Main open={drawerOpen}>
        <Toolbar />
        {useDemo && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using demo data. Changes will not be saved.
          </Alert>
        )}
        
        {tabValue === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Total Revenue</Typography>
                  <Typography variant="h4">$44,000</Typography>
                  <Typography color="textSecondary">
                    <TrendingUp color="primary" /> 3.5% from last month
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Products Sold</Typography>
                  <Typography variant="h4">1,245</Typography>
                  <Typography color="textSecondary">
                    <Inventory color="primary" /> 15% increase
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={4}>
              <Card elevation={3}>
                <CardContent>
                  <Typography color="textSecondary" gutterBottom>Average Rating</Typography>
                  <Typography variant="h4">4.8</Typography>
                  <Typography color="textSecondary">
                    <Star color="primary" /> Based on 200 reviews
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Recent Orders</Typography>
                <List>
                  {[1, 2, 3].map((order) => (
                    <ListItem key={order}>
                      <ListItemAvatar>
                        <Avatar>
                          <AttachMoney />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText 
                        primary={`Order #1000${order}`} 
                        secondary={`$${Math.floor(Math.random() * 1000)} - ${new Date().toLocaleDateString()}`} 
                      />
                      <Chip label="Completed" color="success" size="small" />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
            <Grid item xs={12} md={6}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Typography variant="h6" gutterBottom>Top Selling Products</Typography>
                <List>
                  {products.slice(0, 3).map((product) => (
                    <ListItem key={product._id}>
                      <ListItemAvatar>
                        <Avatar src={product.image} />
                      </ListItemAvatar>
                      <ListItemText 
                        primary={product.name} 
                        secondary={`$${product.price} - ${product.quantity} in stock`} 
                      />
                    </ListItem>
                  ))}
                </List>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 1 && (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Paper sx={{ p: 2 }} elevation={3}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">Product Management</Typography>
                  <Button 
                    variant="contained" 
                    startIcon={<AddIcon />}
                    onClick={() => {
                      setCurrentProduct({ name: '', description: '', price: '', quantity: '', category: '' });
                      setOpenProductDialog(true);
                    }}
                  >
                    Add Product
                  </Button>
                </Box>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Name</TableCell>
                        <TableCell>Description</TableCell>
                        <TableCell>Category</TableCell>
                        <TableCell>Price</TableCell>
                        <TableCell>Quantity</TableCell>
                        <TableCell>Actions</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {products.map((product) => (
                        <TableRow key={product._id}>
                          <TableCell>{product.name}</TableCell>
                          <TableCell>{product.description}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell>${product.price.toFixed(2)}</TableCell>
                          <TableCell>{product.quantity}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => {
                              setCurrentProduct(product);
                              setOpenProductDialog(true);
                            }}>
                              <EditIcon />
                            </IconButton>
                            <IconButton onClick={() => handleDeleteProduct(product._id)}>
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Paper>
            </Grid>
          </Grid>
        )}

        {tabValue === 2 && (
          <Typography variant="h6">Orders Management (To be implemented)</Typography>
        )}

        {tabValue === 3 && (
          <Typography variant="h6">Analytics Dashboard (To be implemented)</Typography>
        )}

        {tabValue === 4 && (
          <Typography variant="h6">Settings (To be implemented)</Typography>
        )}

        {/* Product Dialog */}
        <Dialog open={openProductDialog} onClose={() => setOpenProductDialog(false)}>
          <DialogTitle>{currentProduct._id ? 'Edit Product' : 'Add Product'}</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Product Name"
              fullWidth
              value={currentProduct.name}
              onChange={(e) => setCurrentProduct({...currentProduct, name: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Description"
              fullWidth
              multiline
              rows={4}
              value={currentProduct.description}
              onChange={(e) => setCurrentProduct({...currentProduct, description: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Category"
              fullWidth
              value={currentProduct.category}
              onChange={(e) => setCurrentProduct({...currentProduct, category: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Price"
              fullWidth
              type="number"
              value={currentProduct.price}
              onChange={(e) => setCurrentProduct({...currentProduct, price: e.target.value})}
            />
            <TextField
              margin="dense"
              label="Quantity"
              fullWidth
              type="number"
              value={currentProduct.quantity}
              onChange={(e) => setCurrentProduct({...currentProduct, quantity: e.target.value})}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenProductDialog(false)}>Cancel</Button>
            <Button onClick={handleProductSubmit}>Submit</Button>
          </DialogActions>
        </Dialog>

        {/* Snackbar for notifications */}
        <Snackbar 
          open={snackbar.open} 
          autoHideDuration={6000} 
          onClose={() => setSnackbar({...snackbar, open: false})}
        >
          <Alert onClose={() => setSnackbar({...snackbar, open: false})} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Main>
    </Box>
  );
}

export default SellerDashboard;