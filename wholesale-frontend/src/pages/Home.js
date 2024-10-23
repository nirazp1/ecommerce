import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, 
  Paper, Divider, useTheme, useMediaQuery, Skeleton, IconButton,
  Carousel, Rating, Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getProducts, getSuppliers, getStoreName } from '../api';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

function Home() {
  const [storeName, setStoreName] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredSuppliers, setFeaturedSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeResponse, productsResponse, suppliersResponse] = await Promise.all([
          getStoreName(),
          getProducts(),
          getSuppliers()
        ]);
        setStoreName(storeResponse.data.name);
        setFeaturedProducts(productsResponse.data.slice(0, 8));
        setFeaturedSuppliers(suppliersResponse.data.slice(0, 4));
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const HeroSection = () => (
    <Paper
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: `url(https://source.unsplash.com/random?wholesale)`,
        height: '60vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.3)',
        }}
      />
      <Box
        sx={{
          position: 'relative',
          p: { xs: 3, md: 6 },
          pr: { md: 0 },
          textAlign: 'center',
        }}
      >
        <Typography component="h1" variant="h2" color="inherit" gutterBottom>
          Welcome to {storeName}
        </Typography>
        <Typography variant="h5" color="inherit" paragraph>
          Connect with top suppliers and manage your inventory effortlessly
        </Typography>
        <Button variant="contained" color="primary" component={Link} to="/products" size="large">
          Explore Products
        </Button>
      </Box>
    </Paper>
  );

  const FeaturedProducts = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Featured Products
      </Typography>
      <Grid container spacing={2}>
        {featuredProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={product.image || 'https://via.placeholder.com/140'}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {product.description.substring(0, 60)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Rating name="read-only" value={4.5} readOnly size="small" />
                </Box>
              </CardContent>
              <Button size="small" color="primary" component={Link} to={`/products/${product._id}`}>
                View Details
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const SupplierHighlights = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Top Suppliers
      </Typography>
      <Grid container spacing={4}>
        {featuredSuppliers.map((supplier) => (
          <Grid item key={supplier._id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={supplier.coverImage || 'https://via.placeholder.com/140'}
                alt={supplier.companyName}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {supplier.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {supplier.description.substring(0, 100)}...
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Chip label={supplier.industry} color="primary" size="small" />
                  <Rating name="read-only" value={supplier.rating} readOnly size="small" />
                </Box>
              </CardContent>
              <Button size="small" color="primary" component={Link} to={`/suppliers/${supplier._id}`}>
                View Profile
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const Features = () => (
    <Box sx={{ my: 8 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <StorefrontIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Wide Product Range
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Access thousands of products from verified suppliers
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Efficient Logistics
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Fast and reliable shipping options available
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <SecurityIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Secure Transactions
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Safe and protected payment processing
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const CallToAction = () => (
    <Paper sx={{ my: 8, p: 6, textAlign: 'center', backgroundColor: theme.palette.primary.main, color: 'white' }}>
      <Typography variant="h4" gutterBottom>
        Ready to grow your business?
      </Typography>
      <Typography variant="body1" paragraph>
        Join our platform today and connect with top suppliers from around the world.
      </Typography>
      <Button variant="contained" color="secondary" component={Link} to="/register" size="large">
        Get Started
      </Button>
    </Paper>
  );

  if (loading) {
    return (
      <Container>
        <Skeleton variant="rectangular" height={400} sx={{ mb: 4 }} />
        <Skeleton variant="text" height={60} sx={{ mb: 2 }} />
        <Grid container spacing={2}>
          {[...Array(4)].map((_, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Skeleton variant="rectangular" height={200} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <HeroSection />
      <FeaturedProducts />
      <Divider sx={{ my: 4 }} />
      <SupplierHighlights />
      <Divider sx={{ my: 4 }} />
      <Features />
      <CallToAction />
    </Container>
  );
}

export default Home;
