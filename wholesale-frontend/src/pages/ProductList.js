import React, { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, Button, Box, 
  TextField, Select, MenuItem, Pagination, Chip, Rating, InputAdornment,
  IconButton, Drawer, List, ListItem, ListItemText, Checkbox, FormGroup, FormControlLabel,
  Slider, useTheme, useMediaQuery, CircularProgress
} from '@mui/material';
import { Search, FilterList, ShoppingCart } from '@mui/icons-material';
import { getProducts } from '../api';
import { getProductRecommendations } from '../services/aiService';
import { useNavigate } from 'react-router-dom';

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
  const productsPerPage = 12;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await getProducts();
        setProducts(response.data);
        setFilteredProducts(response.data);
        const uniqueCategories = [...new Set(response.data.map(product => product.category))];
        setCategories(uniqueCategories);

        // Get AI-powered recommendations
        const userPreferences = { favoriteCategories: ['Electronics', 'Home & Garden'] };
        const productHistory = response.data.slice(0, 5);
        const recommendedProducts = await getProductRecommendations(userPreferences, productHistory);
        setRecommendations(recommendedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
                    {product.name}
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
                  onClick={() => {
                    // Implement add to cart functionality
                    console.log('Add to cart:', product);
                  }}
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
                  <CardContent>
                    <Typography variant="h6">{product.name}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {product.category}
                    </Typography>
                    <Typography variant="h6" color="primary">
                      ${product.price.toFixed(2)}
                    </Typography>
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
