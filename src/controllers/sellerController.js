const User = require('../models/User');
const Product = require('../models/Product');

exports.getSellerProfile = async (req, res) => {
  try {
    console.log('getSellerProfile called, user:', req.user);
    const user = await User.findById(req.user.userId).select('-password');
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ message: 'Seller profile not found' });
    }
    if (user.role !== 'seller') {
      console.log('User is not a seller. User role:', user.role);
      return res.status(403).json({ message: 'Access denied. User is not a seller.' });
    }
    console.log('Seller profile found:', user);
    res.json(user);
  } catch (error) {
    console.error('Error in getSellerProfile:', error);
    res.status(500).json({ message: 'Error fetching seller profile', error: error.message });
  }
};

exports.getSellerProducts = async (req, res) => {
  try {
    console.log('Fetching products for seller:', req.user.userId);
    const products = await Product.find({ seller: req.user.userId });
    console.log('Products found:', products.length);
    res.json(products);
  } catch (error) {
    console.error('Error in getSellerProducts:', error);
    res.status(500).json({ message: 'Error fetching seller products', error: error.message });
  }
};
