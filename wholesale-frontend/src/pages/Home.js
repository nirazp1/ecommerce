import React, { useState, useEffect, useContext } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, 
  Paper, Divider, useTheme, useMediaQuery, Skeleton, IconButton,
  Rating, Chip, Snackbar, Alert, Avatar, List, ListItem, ListItemText, ListItemAvatar
} from '@mui/material';
import { Link } from 'react-router-dom';
import { getProducts, getSuppliers, getStoreName, getPopularItems } from '../api';
import StorefrontIcon from '@mui/icons-material/Storefront';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import MonetizationOnIcon from '@mui/icons-material/MonetizationOn';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { CartContext } from '../contexts/CartContext';

// Unsplash API access key (you should store this in an environment variable)
const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY';

// Function to get a random image URL based on category
const getRandomImageUrl = async (category) => {
  try {
    const response = await fetch(`https://api.unsplash.com/photos/random?query=${category}&client_id=${UNSPLASH_ACCESS_KEY}`);
    const data = await response.json();
    return data.urls.regular;
  } catch (error) {
    console.error('Error fetching image from Unsplash:', error);
    return `https://source.unsplash.com/featured/?${category.toLowerCase().replace(/\s+/g, '-')}`;
  }
};

// Demo products with random images
const demoProducts = [
  { _id: 'demo1', name: 'Premium Headphones', description: 'High-quality wireless headphones with noise cancellation', category: 'Electronics', price: 199.99, quantity: 50, image: getRandomImageUrl('headphones') },
  { _id: 'demo2', name: 'Ergonomic Office Chair', description: 'Comfortable chair for long work hours', category: 'Furniture', price: 249.99, quantity: 30, image: getRandomImageUrl('office-chair') },
  { _id: 'demo3', name: 'Smart Home Hub', description: 'Control your entire home with voice commands', category: 'Smart Home', price: 129.99, quantity: 75, image: getRandomImageUrl('smart-home') },
  { _id: 'demo4', name: 'Portable Bluetooth Speaker', description: 'Waterproof speaker with 20-hour battery life', category: 'Electronics', price: 79.99, quantity: 100, image: getRandomImageUrl('bluetooth-speaker') },
  { _id: 'demo5', name: 'Stainless Steel Cookware Set', description: '10-piece set for all your cooking needs', category: 'Kitchen', price: 199.99, quantity: 40, image: getRandomImageUrl('cookware') },
  { _id: 'demo6', name: 'Yoga Mat', description: 'Non-slip, eco-friendly yoga mat', category: 'Fitness', price: 29.99, quantity: 200, image: getRandomImageUrl('yoga-mat') },
  { _id: 'demo7', name: 'LED Desk Lamp', description: 'Adjustable lamp with multiple lighting modes', category: 'Home Office', price: 49.99, quantity: 150, image: getRandomImageUrl('desk-lamp') },
  { _id: 'demo8', name: 'Electric Toothbrush', description: 'Rechargeable toothbrush with multiple cleaning modes', category: 'Personal Care', price: 89.99, quantity: 80, image: getRandomImageUrl('electric-toothbrush') },
];

function Home() {
  const [storeName, setStoreName] = useState('');
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [featuredSuppliers, setFeaturedSuppliers] = useState([]);
  const [popularItems, setPopularItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const { addToCart } = useContext(CartContext);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storeResponse, productsResponse, suppliersResponse, popularItemsResponse] = await Promise.all([
          getStoreName(),
          getProducts(),
          getSuppliers(),
          getPopularItems()
        ]);
        setStoreName(storeResponse.data.name);
        
        // Fetch images for products
        const productsWithImages = await Promise.all(productsResponse.data.map(async (product) => ({
          ...product,
          image: await getRandomImageUrl(product.category)
        })));
        setFeaturedProducts(productsWithImages.slice(0, 8));
        
        setFeaturedSuppliers(suppliersResponse.data.slice(0, 4));
        
        // Fetch images for popular items
        const popularItemsWithImages = await Promise.all(popularItemsResponse.data.map(async (product) => ({
          ...product,
          image: await getRandomImageUrl(product.category)
        })));
        setPopularItems(popularItemsWithImages);
      } catch (error) {
        console.error('Error fetching data:', error);
        // You might want to set some default data here
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product);
    setSnackbar({ open: true, message: 'Product added to cart', severity: 'success' });
  };

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
          Welcome to {storeName || 'Our Wholesale Platform'}
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

  const TrendingCategories = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Trending Categories
      </Typography>
      <Grid container spacing={2}>
        {['Electronics', 'Fashion', 'Home & Garden', 'Beauty', 'Sports'].map((category) => (
          <Grid item key={category} xs={6} sm={4} md={2}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', p: 2 }}>
              <CardMedia
                component="img"
                sx={{ width: 80, height: 80, mb: 1 }}
                image={`https://source.unsplash.com/featured/?${category.toLowerCase()}`}
                alt={category}
              />
              <Typography variant="subtitle1" align="center">{category}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const FeaturedSuppliers = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Featured Suppliers
      </Typography>
      <Grid container spacing={2}>
        {featuredSuppliers.map((supplier) => (
          <Grid item key={supplier._id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="140"
                image={supplier.coverImage || `https://source.unsplash.com/featured/?business`}
                alt={supplier.companyName}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {supplier.companyName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {supplier.description.substring(0, 100)}...
                </Typography>
                <Chip 
                  icon={<VerifiedUserIcon />} 
                  label="Verified Supplier" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                />
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

  const BulkOrderingBenefits = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Benefits of Bulk Ordering
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <MonetizationOnIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Volume Discounts
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Save more when you buy in larger quantities
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <LocalShippingIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Consolidated Shipping
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Reduce shipping costs with bulk orders
            </Typography>
          </Box>
        </Grid>
        <Grid item xs={12} md={4}>
          <Box sx={{ textAlign: 'center' }}>
            <SupportAgentIcon sx={{ fontSize: 60, color: 'primary.main' }} />
            <Typography variant="h6" gutterBottom>
              Dedicated Support
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Get personalized assistance for large orders
            </Typography>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );

  const Testimonials = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        What Our Customers Say
      </Typography>
      <Grid container spacing={4}>
        {[
          { name: 'John Doe', role: 'Retail Store Owner', comment: 'This platform has revolutionized our inventory management. The bulk ordering feature saves us both time and money.' },
          { name: 'Jane Smith', role: 'E-commerce Entrepreneur', comment: 'The variety of verified suppliers on this platform is impressive. It\'s been a game-changer for our online business.' },
          { name: 'Mike Johnson', role: 'Procurement Manager', comment: 'The streamlined ordering process and reliable shipping have significantly improved our supply chain efficiency.' }
        ].map((testimonial, index) => (
          <Grid item key={index} xs={12} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography variant="body1" paragraph>
                  "{testimonial.comment}"
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>{testimonial.name[0]}</Avatar>
                  <Box>
                    <Typography variant="subtitle1">{testimonial.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{testimonial.role}</Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const PopularItems = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Popular Items
      </Typography>
      <Grid container spacing={2}>
        {popularItems.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
                  <Typography variant="h6" color="primary">
                    ${product.price.toFixed(2)}
                  </Typography>
                  <Chip icon={<TrendingUpIcon />} label="Trending" color="secondary" size="small" />
                </Box>
              </CardContent>
              <Button 
                size="small" 
                color="primary" 
                startIcon={<ShoppingCartIcon />}
                sx={{ m: 1 }}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );

  const ProductList = () => (
    <Box sx={{ my: 8 }}>
      <Typography variant="h4" gutterBottom align="center">
        Our Products
      </Typography>
      <Grid container spacing={2}>
        {featuredProducts.map((product) => (
          <Grid item key={product._id} xs={12} sm={6} md={3}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
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
                  <Chip label={product.category} size="small" />
                </Box>
                <Rating name="read-only" value={4.5} readOnly size="small" sx={{ mt: 1 }} />
              </CardContent>
              <Button 
                size="small" 
                color="primary" 
                startIcon={<ShoppingCartIcon />}
                sx={{ m: 1 }}
                onClick={() => handleAddToCart(product)}
              >
                Add to Cart
              </Button>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Button variant="contained" color="primary" component={Link} to="/products">
          View All Products
        </Button>
      </Box>
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
      <TrendingCategories />
      <PopularItems />
      <Divider sx={{ my: 4 }} />
      <FeaturedSuppliers />
      <Divider sx={{ my: 4 }} />
      <ProductList />
      <Divider sx={{ my: 4 }} />
      <BulkOrderingBenefits />
      <Divider sx={{ my: 4 }} />
      <Testimonials />
      <Divider sx={{ my: 4 }} />
      <Features />
      <CallToAction />
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={3000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default Home;
