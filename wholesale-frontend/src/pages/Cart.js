import React, { useContext } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  Button, Box, IconButton, TextField
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { CartContext } from '../contexts/CartContext';

function Cart() {
  const { cart, removeFromCart, updateQuantity } = useContext(CartContext);

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Cart</Typography>
      {cart.length === 0 ? (
        <Typography>Your cart is empty.</Typography>
      ) : (
        <>
          <Grid container spacing={3}>
            {cart.map((item) => (
              <Grid item xs={12} key={item._id}>
                <Card>
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
                        <Typography variant="body2" color="text.secondary">
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
                          <TextField
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateQuantity(item._id, parseInt(e.target.value))}
                            InputProps={{ inputProps: { min: 1 } }}
                            sx={{ width: '5rem' }}
                          />
                          <IconButton onClick={() => removeFromCart(item._id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="h5">Total: ${total.toFixed(2)}</Typography>
            <Button variant="contained" color="primary" size="large">
              Proceed to Checkout
            </Button>
          </Box>
        </>
      )}
    </Container>
  );
}

export default Cart;
