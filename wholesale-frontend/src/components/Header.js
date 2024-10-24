import React, { useContext } from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Switch } from '@mui/material';
import { Link } from 'react-router-dom';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { ThemeContext } from '../contexts/ThemeContext';

function Header() {
  const { isAuthenticated, userRole, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const { darkMode, toggleDarkMode } = useContext(ThemeContext);

  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" style={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          Wholesale Platform
        </Typography>
        <Button color="inherit" component={Link} to="/products">Products</Button>
        {isAuthenticated ? (
          <>
            {userRole === 'seller' && (
              <Button color="inherit" component={Link} to="/seller-dashboard">Seller Dashboard</Button>
            )}
            <Button color="inherit" onClick={logout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={Link} to="/login">Login</Button>
            <Button color="inherit" component={Link} to="/register">Register</Button>
          </>
        )}
        <IconButton color="inherit" component={Link} to="/cart">
          <Badge badgeContent={cartItemCount} color="secondary">
            <ShoppingCartIcon />
          </Badge>
        </IconButton>
        <IconButton color="inherit" onClick={toggleDarkMode}>
          {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default Header;
