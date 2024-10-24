import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Container, Typography, Grid, Paper, Box, Button, Chip, Rating,
  Table, TableBody, TableCell, TableContainer, TableRow,
  Tabs, Tab, Divider, List, ListItem, ListItemText, ListItemAvatar,
  Avatar, CircularProgress, Snackbar, Alert, ImageList, ImageListItem
} from '@mui/material';
import {
  ShoppingCart as ShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Star as StarIcon,
  Check as CheckIcon
} from '@mui/icons-material';
import { getProductDetails, getRelatedProducts, getProductReviews } from '../api';
import { CartContext } from '../contexts/CartContext';

function ProductDetail() {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    const fetchProductData = async () => {
      setLoading(true);
      try {
        const [productData, relatedData, reviewsData] = await Promise.all([
          getProductDetails(productId),
          getRelatedProducts(productId),
          getProductReviews(productId)
        ]);
        setProduct(productData);
        setRelatedProducts(relatedData);
        setReviews(reviewsData);
      } catch (error) {
        console.error('Error fetching product data:', error);
        setSnackbar({ open: true, message: 'Failed to load product data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    addToCart(product);
    setSnackbar({ open: true, message: 'Product added to cart', severity: 'success' });
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return <Typography variant="h6">Product not found</Typography>;
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <ImageList cols={3} rowHeight={164}>
            {[product.image, ...product.additionalImages || []].map((img, index) => (
              <ImageListItem key={index}>
                <img src={img} alt={`Product view ${index + 1}`} loading="lazy" />
              </ImageListItem>
            ))}
          </ImageList>
        </Grid>
        <Grid item xs={12} md={6}>
          <Typography variant="h4" gutterBottom>{product.name}</Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Rating value={product.rating} readOnly precision={0.5} />
            <Typography variant="body2" sx={{ ml: 1 }}>({product.numReviews} reviews)</Typography>
          </Box>
          <Typography variant="h5" color="primary" gutterBottom>${product.price.toFixed(2)}</Typography>
          <Typography variant="body1" paragraph>{product.description}</Typography>
          <Box mb={2}>
            <Chip icon={<CheckIcon />} label="In Stock" color="success" />
            <Chip icon={<LocalShippingIcon />} label="Free Shipping" sx={{ ml: 1 }} />
          </Box>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<ShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
          >
            Add to Cart
          </Button>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)}>
          <Tab label="Details" />
          <Tab label="Reviews" />
        </Tabs>
        <Box sx={{ mt: 2 }}>
          {activeTab === 0 && (
            <TableContainer component={Paper}>
              <Table>
                <TableBody>
                  {Object.entries(product.details || {}).map(([key, value]) => (
                    <TableRow key={key}>
                      <TableCell component="th" scope="row">{key}</TableCell>
                      <TableCell>{value}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
          {activeTab === 1 && (
            <List>
              {reviews.map((review, index) => (
                <React.Fragment key={index}>
                  <ListItem alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar alt={review.userName} src={review.userAvatar} />
                    </ListItemAvatar>
                    <ListItemText
                      primary={
                        <React.Fragment>
                          <Typography component="span" variant="body1" color="text.primary">
                            {review.userName}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly sx={{ ml: 1 }} />
                        </React.Fragment>
                      }
                      secondary={review.comment}
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider variant="inset" component="li" />}
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      </Box>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>Related Products</Typography>
        <Grid container spacing={2}>
          {relatedProducts.map((relatedProduct) => (
            <Grid item key={relatedProduct._id} xs={12} sm={6} md={3}>
              <Paper elevation={3} sx={{ p: 2 }}>
                <img src={relatedProduct.image} alt={relatedProduct.name} style={{ width: '100%', height: 'auto' }} />
                <Typography variant="subtitle1">{relatedProduct.name}</Typography>
                <Typography variant="body2" color="text.secondary">${relatedProduct.price.toFixed(2)}</Typography>
                <Button 
                  component={Link} 
                  to={`/product/${relatedProduct._id}`} 
                  variant="outlined" 
                  fullWidth 
                  sx={{ mt: 1 }}
                >
                  View Details
                </Button>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Box>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert onClose={() => setSnackbar({ ...snackbar, open: false })} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
}

export default ProductDetail;
