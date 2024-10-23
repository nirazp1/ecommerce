import React, { useState, useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, Box, IconButton, InputBase, Menu, MenuItem, Switch, Badge } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { ThemeContext } from '../contexts/ThemeContext';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';

function Header() {
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);
  const { isAuthenticated, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const { cart } = useContext(CartContext);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Wholesale Platform
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <InputBase
            placeholder="Search products..."
            sx={{ mr: 2, bgcolor: 'background.paper', borderRadius: 1, p: '2px 4px', display: 'flex', alignItems: 'center', width: '300px' }}
            endAdornment={<SearchIcon />}
          />
          <Button color="inherit" component={Link} to="/products">Products</Button>
          <Button color="inherit" component={Link} to="/suppliers">Suppliers</Button>
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={cartItemCount} color="secondary">
              <ShoppingCartIcon />
            </Badge>
          </IconButton>
          {isAuthenticated ? (
            <>
              <Button color="inherit" component={Link} to="/dashboard">Dashboard</Button>
              <IconButton color="inherit" onClick={handleMenu}>
                <AccountCircleIcon />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/dashboard" onClick={handleClose}>Dashboard</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <Button color="inherit" component={Link} to="/login">Login</Button>
          )}
          <IconButton sx={{ ml: 1 }} onClick={toggleDarkMode} color="inherit">
            {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
