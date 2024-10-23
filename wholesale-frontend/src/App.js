import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { CssBaseline, Box } from '@mui/material';
import { ThemeProvider } from './contexts/ThemeContext';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Routes from './Routes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CssBaseline />
        <BrowserRouter>
          <Box sx={{ bgcolor: 'background.default', minHeight: '100vh' }}>
            <Header />
            <Routes />
          </Box>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
