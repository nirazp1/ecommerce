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
import BusinessRegistration from './pages/BusinessRegistration';

function AppRoutes() {
  const { isAuthenticated, userRole } = useContext(AuthContext);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/products" element={<ProductList />} />
      <Route path="/suppliers" element={<SupplierList />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/business-registration" element={<BusinessRegistration />} />
      <Route 
        path="/dashboard" 
        element={
          isAuthenticated ? 
            (userRole === 'buyer' ? <UserDashboard /> : <SellerDashboard />) : 
            <Navigate to="/login" />
        } 
      />
      <Route path="/seller-dashboard" element={
        isAuthenticated && userRole === 'seller' ? <SellerDashboard /> : <Navigate to="/login" />
      } />
      <Route path="/cart" element={<Cart />} />
    </Routes>
  );
}

export default AppRoutes;
