import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
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
          <Header />
          <Routes />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
