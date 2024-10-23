const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');
const User = require('../models/User');

async function viewDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // View Products
    const products = await Product.find();
    console.log('Products:', products);

    // View Suppliers
    const suppliers = await Supplier.find();
    console.log('Suppliers:', suppliers);

    // View Users
    const users = await User.find();
    console.log('Users:', users);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

viewDatabase();
