const Order = require('../models/Order');

exports.getRecentOrders = async (req, res) => {
  try {
    const recentOrders = await Order.find({ user: req.user.userId })
      .sort({ createdAt: -1 })
      .limit(5);
    res.json(recentOrders);
  } catch (error) {
    console.error('Error fetching recent orders:', error);
    res.status(500).json({ message: 'Error fetching recent orders' });
  }
};
