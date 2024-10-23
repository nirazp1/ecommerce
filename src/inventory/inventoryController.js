const Product = require('../models/Product');
const socketManager = require('../socket');

exports.updateInventory = async (req, res) => {
  try {
    const { productId, newQuantity } = req.body;
    const product = await Product.findByIdAndUpdate(
      productId,
      { quantity: newQuantity },
      { new: true }
    );

    // Emit real-time update to all connected clients
    const io = socketManager.getIO();
    io.emit('inventoryUpdate', { productId, newQuantity });

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Add this function
exports.createProduct = async (req, res) => {
  try {
    const { name, description, category, price, quantity } = req.body;
    const product = new Product({ name, description, category, price, quantity });
    await product.save();
    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
