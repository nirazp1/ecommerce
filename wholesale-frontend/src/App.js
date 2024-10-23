import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';
import Header from './components/Header';
import Routes from './Routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CartProvider>
          <CssBaseline />
          <BrowserRouter>
            <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
              <Header />
              <Routes />
            </Box>
          </BrowserRouter>
        </CartProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
