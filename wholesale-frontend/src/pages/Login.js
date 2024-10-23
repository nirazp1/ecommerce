import React, { useState, useContext } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Box, 
  Paper, 
  Avatar,
  Link,
  Divider
} from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import StorefrontIcon from '@mui/icons-material/Storefront';
import { login } from '../api';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login: authLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e, role) => {
    e.preventDefault();
    setError('');
    try {
      console.log('Attempting login with:', { email, password, role });
      const response = await login({ email, password, role });
      console.log('Login response:', response.data);
      authLogin(response.data.token, response.data.role);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('userRole', response.data.role);
      console.log('Stored in localStorage:', { token: response.data.token, role: response.data.role });
      navigate(role === 'buyer' ? '/' : '/dashboard');
    } catch (error) {
      console.error('Login error:', error.response || error);
      setError('Invalid email or password');
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={3} sx={{ 
        marginTop: 8, 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center',
        padding: 3
      }}>
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in as Buyer
        </Typography>
        <Box component="form" onSubmit={(e) => handleSubmit(e, 'buyer')} noValidate sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Typography color="error" align="center" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In as Buyer
          </Button>
          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Link href="#" variant="body2">
              Forgot password?
            </Link>
            <Link href="/register" variant="body2">
              {"Don't have an account? Sign Up"}
            </Link>
          </Box>
        </Box>
        
        <Divider sx={{ my: 4, width: '100%' }}>OR</Divider>
        
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <StorefrontIcon />
          </Avatar>
          <Typography component="h2" variant="h5" sx={{ mb: 2 }}>
            Are you a Seller?
          </Typography>
          <Button
            fullWidth
            variant="outlined"
            color="primary"
            onClick={(e) => handleSubmit(e, 'seller')}
            startIcon={<StorefrontIcon />}
          >
            Sign In as Seller
          </Button>
          <Link href="/register?role=seller" variant="body2" sx={{ mt: 2 }}>
            {"Don't have a seller account? Register here"}
          </Link>
        </Box>
      </Paper>
    </Container>
  );
}

export default Login;
