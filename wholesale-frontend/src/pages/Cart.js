import React, { useContext, useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Box, IconButton, TextField, Stepper, Step, StepLabel,
  Paper, Divider, Chip, Tooltip, CircularProgress, Dialog,
  DialogTitle, DialogContent, DialogActions, Slide, Snackbar, Alert
} from '@mui/material';
import { 
  Delete as DeleteIcon, 
  AddShoppingCart as AddShoppingCartIcon,
  LocalShipping as LocalShippingIcon,
  Timer as TimerIcon,
  Loyalty as LoyaltyIcon,
  Compare as CompareIcon
} from '@mui/icons-material';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProductStock, getShippingEstimate, getSuggestedProducts } from '../api';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

function Cart() {
  const { cart, removeFromCart, updateQuantity, addToCart } = useContext(CartContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [stockLevels, setStockLevels] = useState({});
  const [shippingEstimate, setShippingEstimate] = useState(null);
  const [suggestedProducts, setSuggestedProducts] = useState([]);
  const [openSuggestionDialog, setOpenSuggestionDialog] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const stockPromises = cart.map(item => getProductStock(item._id));
        const stockResults = await Promise.all(stockPromises);
        const newStockLevels = {};
        stockResults.forEach((stock, index) => {
          newStockLevels[cart[index]._id] = stock;
        });
        setStockLevels(newStockLevels);

        if (cart.length > 0) {
          const shippingEst = await getShippingEstimate(cart);
          setShippingEstimate(shippingEst);

          const suggested = await getSuggestedProducts(cart.map(item => item._id));
          setSuggestedProducts(suggested);
        }
      } catch (error) {
        console.error('Error fetching cart data:', error);
        setSnackbar({ open: true, message: 'Failed to fetch some cart data', severity: 'error' });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [cart]);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  const handleQuantityChange = (itemId, newQuantity) => {
    if (newQuantity > stockLevels[itemId]) {
      setSnackbar({ open: true, message: 'Requested quantity exceeds available stock', severity: 'warning' });
      return;
    }
    updateQuantity(itemId, newQuantity);
  };

  const handleAddSuggestion = (product) => {
    addToCart(product);
    setOpenSuggestionDialog(false);
    setSnackbar({ open: true, message: 'Product added to cart', severity: 'success' });
  };

  const CartItem = ({ item }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card sx={{ mb: 2 }}>
        <Grid container>
          <Grid item xs={3}>
            <CardMedia
              component="img"
              height="140"
              image={item.image || 'https://via.placeholder.com/140'}
              alt={item.name}
            />
          </Grid>
          <Grid item xs={9}>
            <CardContent>
              <Typography variant="h6">{item.name}</Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                ${item.price.toFixed(2)}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                <TextField
                  type="number"
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item._id, parseInt(e.target.value))}
                  InputProps={{ inputProps: { min: 1, max: stockLevels[item._id] } }}
                  sx={{ width: '5rem', mr: 2 }}
                />
                <Tooltip title="Remove from cart">
                  <IconButton onClick={() => removeFromCart(item._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </Box>
              <Box sx={{ mt: 2 }}>
                <Chip 
                  icon={<TimerIcon />} 
                  label={stockLevels[item._id] > 5 ? 'In Stock' : 'Low Stock'} 
                  color={stockLevels[item._id] > 5 ? 'success' : 'warning'}
                  size="small"
                />
              </Box>
            </CardContent>
          </Grid>
        </Grid>
      </Card>
    </motion.div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : cart.length === 0 ? (
        <Paper sx={{ p: 3, textAlign: 'center' }}>
          <Typography variant="h6" gutterBottom>Your cart is empty</Typography>
          <Button 
            variant="contained" 
            color="primary" 
            startIcon={<AddShoppingCartIcon />}
            onClick={() => navigate('/products')}
          >
            Continue Shopping
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <AnimatePresence>
              {cart.map((item) => (
                <CartItem key={item._id} item={item} />
              ))}
            </AnimatePresence>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>Order Summary</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography>Subtotal: ${total.toFixed(2)}</Typography>
                <Typography>Shipping: {shippingEstimate ? `$${shippingEstimate.toFixed(2)}` : 'Calculating...'}</Typography>
                <Typography>Estimated Tax: ${(total * 0.1).toFixed(2)}</Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">
                Total: ${(total + (shippingEstimate || 0) + (total * 0.1)).toFixed(2)}
              </Typography>
              <Button 
                variant="contained" 
                color="primary" 
                fullWidth 
                sx={{ mt: 2 }} 
                onClick={handleProceedToCheckout}
                startIcon={<LocalShippingIcon />}
              >
                Proceed to Checkout
              </Button>
            </Paper>
            <Paper sx={{ p: 3, mt: 2 }}>
              <Typography variant="h6" gutterBottom>Delivery Estimate</Typography>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <LocalShippingIcon sx={{ mr: 1 }} />
                <Typography>
                  {shippingEstimate ? 'Estimated delivery in 3-5 business days' : 'Calculating...'}
                </Typography>
              </Box>
            </Paper>
            {suggestedProducts.length > 0 && (
              <Paper sx={{ p: 3, mt: 2 }}>
                <Typography variant="h6" gutterBottom>You might also like</Typography>
                <Button 
                  variant="outlined" 
                  color="primary" 
                  fullWidth
                  onClick={() => setOpenSuggestionDialog(true)}
                  startIcon={<CompareIcon />}
                >
                  View Suggestions
                </Button>
              </Paper>
            )}
          </Grid>
        </Grid>
      )}
      <Dialog
        open={openSuggestionDialog}
        TransitionComponent={Transition}
        keepMounted
        onClose={() => setOpenSuggestionDialog(false)}
      >
        <DialogTitle>Suggested Products</DialogTitle>
        <DialogContent>
          {suggestedProducts.map((product) => (
            <Card key={product._id} sx={{ mb: 2 }}>
              <CardContent>
                <Typography variant="h6">{product.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  ${product.price.toFixed(2)}
                </Typography>
                <Button 
                  variant="contained" 
                  color="primary" 
                  size="small" 
                  sx={{ mt: 1 }}
                  onClick={() => handleAddSuggestion(product)}
                >
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenSuggestionDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
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

export default Cart;
