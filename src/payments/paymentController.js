const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Order = require('../models/Order');

exports.processPayment = async (req, res) => {
  try {
    const { amount, token, orderId } = req.body;

    const charge = await stripe.charges.create({
      amount: amount * 100, // Stripe expects amount in cents
      currency: 'usd',
      source: token,
      description: `Order ${orderId}`
    });

    // Update order status
    await Order.findByIdAndUpdate(orderId, { status: 'paid' });

    res.json({ success: true, charge });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
