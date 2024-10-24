import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, 
  TextField, Select, MenuItem, Pagination, Chip, Rating, InputAdornment,
  IconButton, Drawer, List, ListItem, ListItemText, Checkbox, FormGroup, FormControlLabel,
  Slider, useTheme, useMediaQuery, CircularProgress, Paper
} from '@mui/material';
import { Search, FilterList, ShoppingCart, ArrowForward } from '@mui/icons-material';
import { getProducts } from '../api';
import { getProductRecommendations } from '../services/aiService';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../contexts/CartContext';

const UNSPLASH_ACCESS_KEY = 'YOUR_UNSPLASH_ACCESS_KEY'; // Replace with your Unsplash API key

// Demo products with web images
const demoProducts = [
  { _id: 'demo1', name: 'Premium Headphones', description: 'High-quality wireless headphones with noise cancellation', category: 'Electronics', price: 199.99, quantity: 50, image: 'https://source.unsplash.com/featured/?headphones' },
  { _id: 'demo2', name: 'Ergonomic Office Chair', description: 'Comfortable chair for long work hours', category: 'Furniture', price: 249.99, quantity: 30, image: 'https://source.unsplash.com/featured/?office-chair' },
  { _id: 'demo3', name: 'Smart Home Hub', description: 'Control your entire home with voice commands', category: 'Smart Home', price: 129.99, quantity: 75, image: 'https://source.unsplash.com/featured/?smart-home' },
  { _id: 'demo4', name: 'Portable Bluetooth Speaker', description: 'Waterproof speaker with 20-hour battery life', category: 'Electronics', price: 79.99, quantity: 100, image: 'https://source.unsplash.com/featured/?bluetooth-speaker' },
  { _id: 'demo5', name: 'Stainless Steel Cookware Set', description: '10-piece set for all your cooking needs', category: 'Kitchen', price: 199.99, quantity: 40, image: 'https://source.unsplash.com/featured/?cookware' },
  { _id: 'demo6', name: 'Yoga Mat', description: 'Non-slip, eco-friendly yoga mat', category: 'Fitness', price: 29.99, quantity: 200, image: 'https://source.unsplash.com/featured/?yoga-mat' },
  { _id: 'demo7', name: 'LED Desk Lamp', description: 'Adjustable lamp with multiple lighting modes', category: 'Home Office', price: 49.99, quantity: 150, image: 'https://source.unsplash.com/featured/?desk-lamp' },
  { _id: 'demo8', name: 'Electric Toothbrush', description: 'Rechargeable toothbrush with multiple cleaning modes', category: 'Personal Care', price: 89.99, quantity: 80, image: 'https://source.unsplash.com/featured/?electric-toothbrush' },
];

function ProductList() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('');
  const [page, setPage] = useState(1);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const navigate = useNavigate();
  const { addToCart } = React.useContext(CartContext);
  const productsPerPage = 12;

  // New state for advisors/ads
  const [advisors, setAdvisors] = useState([
    { id: 1, name: "John Doe", expertise: "Electronics", image: "https://source.unsplash.com/random/?portrait" },
    { id: 2, name: "Jane Smith", expertise: "Home & Garden", image: "https://source.unsplash.com/random/?woman" },
    { id: 3, name: "Mike Johnson", expertise: "Sports Equipment", image: "https://source.unsplash.com/random/?man" },
  ]);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        const productsData = response.data.length > 0 ? response.data : demoProducts;
        const productsWithImages = await Promise.all(productsData.map(async (product) => {
          const imageUrl = await fetchUnsplashImage(product.category);
          return { ...product, image: imageUrl };
        }));
        setProducts(productsWithImages);
        setFilteredProducts(productsWithImages);
        const uniqueCategories = [...new Set(productsWithImages.map(product => product.category))];
        setCategories(uniqueCategories);

        // Get AI-powered recommendations
        const userPreferences = { favoriteCategories: ['Electronics', 'Home & Garden'] };
        const productHistory = productsWithImages.slice(0, 5);
        const recommendedProducts = await getProductRecommendations(userPreferences, productHistory);
        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts(demoProducts);
        setFilteredProducts(demoProducts);
        const uniqueCategories = [...new Set(demoProducts.map(product => product.category))];
        setCategories(uniqueCategories);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const fetchUnsplashImage = async (category) => {
    try {
      const response = await fetch(`https://api.unsplash.com/photos/random?query=${category}&client_id=${UNSPLASH_ACCESS_KEY}`);
      const data = await response.json();
      return data.urls.regular;
    } catch (error) {
      console.error('Error fetching image from Unsplash:', error);
      return `https://source.unsplash.com/featured/?${category.toLowerCase().replace(' ', '-')}`;
    }
  };

  useEffect(() => {
    let result = products;
    if (searchTerm) {
      result = result.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    if (selectedCategories.length > 0) {
      result = result.filter(product => selectedCategories.includes(product.category));
    }
    result = result.filter(product => product.price >= priceRange[0] && product.price <= priceRange[1]);
    if (sortBy === 'priceLowToHigh') {
      result.sort((a, b) => a.price - b.price);
    } else if (sortBy === 'priceHighToLow') {
      result.sort((a, b) => b.price - a.price);
    }
    setFilteredProducts(result);
    setPage(1);
  }, [searchTerm, selectedCategories, sortBy, products, priceRange]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => 
      prev.includes(category) ? prev.filter(c => c !== category) : [...prev, category]
    );
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleAddToCart = (product) => {
    addToCart(product);
    // You can add a snackbar or some other notification here
  };

  const pageCount = Math.ceil(filteredProducts.length / productsPerPage);
  const displayedProducts = filteredProducts.slice(
    (page - 1) * productsPerPage,
    page * productsPerPage
  );

  const FilterDrawer = () => (
    <Drawer
      anchor="left"
      open={filterDrawerOpen}
      onClose={() => setFilterDrawerOpen(false)}
    >
      <Box sx={{ width: 250, p: 2 }}>
        <Typography variant="h6" gutterBottom>Filters</Typography>
        <Typography gutterBottom>Categories</Typography>
        <FormGroup>
          {categories.map(cat => (
            <FormControlLabel
              key={cat}
              control={<Checkbox checked={selectedCategories.includes(cat)} onChange={() => handleCategoryChange(cat)} />}
              label={cat}
            />
          ))}
        </FormGroup>
        <Typography gutterBottom sx={{ mt: 2 }}>Price Range</Typography>
        <Slider
          value={priceRange}
          onChange={handlePriceChange}
          valueLabelDisplay="auto"
          min={0}
          max={1000}
        />
        <Typography>
          ${priceRange[0]} - ${priceRange[1]}
        </Typography>
      </Box>
    </Drawer>
  );

  const AdSection = () => (
    <Paper elevation={3} sx={{ mb: 4, p: 2, backgroundColor: theme.palette.background.default }}>
      <Typography variant="h5" gutterBottom>Our Expert Advisors</Typography>
      <Grid container spacing={2}>
        {advisors.map((advisor) => (
          <Grid item xs={12} sm={4} key={advisor.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={advisor.image}
                alt={advisor.name}
              />
              <CardContent>
                <Typography variant="h6">{advisor.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Expert in {advisor.expertise}
                </Typography>
                <Button 
                  variant="outlined" 
                  size="small" 
                  endIcon={<ArrowForward />}
                  sx={{ mt: 1 }}
                >
                  Get Advice
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Paper>
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>Products</Typography>
        
        {/* Add the AdSection component here */}
        <AdSection />

        <Grid container spacing={2} sx={{ mb: 4 }}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="Search products"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Grid>
          <Grid item xs={12} md={3}>
            <Select
              fullWidth
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              displayEmpty
            >
              <MenuItem value="">Sort By</MenuItem>
              <MenuItem value="priceLowToHigh">Price: Low to High</MenuItem>
              <MenuItem value="priceHighToLow">Price: High to Low</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} md={3}>
            <Button 
              fullWidth 
              variant="outlined" 
              startIcon={<FilterList />}
              onClick={() => setFilterDrawerOpen(true)}
            >
              Filters
            </Button>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          {displayedProducts.map(product => (
            <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    <Link to={`/product/${product._id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                      {product.name}
                    </Link>
                  </Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {product.description.substring(0, 100)}...
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
                  variant="contained" 
                  color="primary" 
                  fullWidth
                  startIcon={<ShoppingCart />}
                  onClick={() => handleAddToCart(product)}
                >
                  Add to Cart
                </Button>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={pageCount}
            page={page}
            onChange={(event, value) => setPage(value)}
            color="primary"
          />
        </Box>
      </Box>
      <FilterDrawer />
      {recommendations.length > 0 && (
        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>Recommended for You</Typography>
          <Grid container spacing={3}>
            {recommendations.map((product, index) => (
              <Grid item key={index} xs={12} sm={6} md={4} lg={3}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={`https://source.unsplash.com/featured/?${product.category.toLowerCase().replace(' ', '-')}`}
                    alt={product.name}
                  />
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price.toFixed(2)}
                    </Typography>
                    <Button 
                      variant="contained" 
                      color="primary" 
                      fullWidth
                      startIcon={<ShoppingCart />}
                      onClick={() => handleAddToCart(product)}
                      sx={{ mt: 2 }}
                    >
                      Add to Cart
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      )}
    </Container>
  );
}

export default ProductList;
