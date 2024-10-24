import React, { useContext, useState } from 'react';
import { 
  Container, Typography, Grid, Paper, TextField, Button, 
  Stepper, Step, StepLabel, Box, CircularProgress
} from '@mui/material';
import { CartContext } from '../contexts/CartContext';
import { useNavigate } from 'react-router-dom';

const steps = ['Shipping Address', 'Payment Details', 'Review Your Order'];

function Checkout() {
  const { cart } = useContext(CartContext);
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState({
    fullName: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  const [paymentDetails, setPaymentDetails] = useState({
    cardName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  });
  const [loading, setLoading] = useState(false);

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleShippingAddressChange = (event) => {
    setShippingAddress({ ...shippingAddress, [event.target.name]: event.target.value });
  };

  const handlePaymentDetailsChange = (event) => {
    setPaymentDetails({ ...paymentDetails, [event.target.name]: event.target.value });
  };

  const handlePlaceOrder = async () => {
    setLoading(true);
    // Here you would typically send the order to your backend
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    setLoading(false);
    // Navigate to a confirmation page or back to the home page
    navigate('/');
  };

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                name="fullName"
                label="Full Name"
                fullWidth
                value={shippingAddress.fullName}
                onChange={handleShippingAddressChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="address"
                label="Address"
                fullWidth
                value={shippingAddress.address}
                onChange={handleShippingAddressChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="city"
                label="City"
                fullWidth
                value={shippingAddress.city}
                onChange={handleShippingAddressChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="state"
                label="State/Province/Region"
                fullWidth
                value={shippingAddress.state}
                onChange={handleShippingAddressChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="zipCode"
                label="Zip / Postal code"
                fullWidth
                value={shippingAddress.zipCode}
                onChange={handleShippingAddressChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="country"
                label="Country"
                fullWidth
                value={shippingAddress.country}
                onChange={handleShippingAddressChange}
              />
            </Grid>
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                required
                name="cardName"
                label="Name on card"
                fullWidth
                value={paymentDetails.cardName}
                onChange={handlePaymentDetailsChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                name="cardNumber"
                label="Card number"
                fullWidth
                value={paymentDetails.cardNumber}
                onChange={handlePaymentDetailsChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="expiryDate"
                label="Expiry date"
                fullWidth
                value={paymentDetails.expiryDate}
                onChange={handlePaymentDetailsChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                name="cvv"
                label="CVV"
                fullWidth
                value={paymentDetails.cvv}
                onChange={handlePaymentDetailsChange}
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>Order summary</Typography>
              {cart.map((item) => (
                <Typography key={item._id}>
                  {item.name} x {item.quantity} - ${(item.price * item.quantity).toFixed(2)}
                </Typography>
              ))}
              <Typography variant="h6" style={{ marginTop: '1rem' }}>
                Total: ${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        );
      default:
        return 'Unknown step';
    }
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '2rem' }}>
      <Paper style={{ padding: '2rem' }}>
        <Typography component="h1" variant="h4" align="center" gutterBottom>
          Checkout
        </Typography>
        <Stepper activeStep={activeStep} style={{ marginBottom: '2rem' }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        {getStepContent(activeStep)}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} sx={{ mr: 1 }}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={activeStep === steps.length - 1 ? handlePlaceOrder : handleNext}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 
              activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}

export default Checkout;
