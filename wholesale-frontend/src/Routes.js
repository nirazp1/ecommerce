import React, { useContext } from 'react';
import { Route, Routes, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import SupplierList from './pages/SupplierList';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import SellerDashboard from './pages/SellerDashboard';
import Cart from './pages/Cart';
import { AuthContext } from './contexts/AuthContext';

function AppRoutes() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/suppliers" element={<SupplierList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? 
            (userRole === 'buyer' ? <UserDashboard /> : 
             userRole === 'seller' ? <SellerDashboard /> : 
             <Navigate to="/" />)
            : <Navigate to="/login" />
        } 
      />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default AppRoutes;
