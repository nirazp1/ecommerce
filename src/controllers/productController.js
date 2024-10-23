const User = require('../models/User');
const Product = require('../models/Product');

exports.getFavoriteProducts = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).populate('favoriteProducts');
    res.json(user.favoriteProducts);
  } catch (error) {
    console.error('Error fetching favorite products:', error);
    res.status(500).json({ message: 'Error fetching favorite products' });
  }
};
