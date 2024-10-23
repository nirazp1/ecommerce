const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

const sampleProducts = [
  { name: 'Premium Laptop', description: 'High-performance laptop with 16GB RAM and 512GB SSD', category: 'Electronics', price: 1299.99, quantity: 50, image: 'https://example.com/laptop.jpg' },
  { name: '5G Smartphone', description: 'Latest model smartphone with 5G capability', category: 'Electronics', price: 799.99, quantity: 100, image: 'https://example.com/smartphone.jpg' },
  { name: 'Ergonomic Office Chair', description: 'Comfortable office chair with lumbar support', category: 'Furniture', price: 249.99, quantity: 30, image: 'https://example.com/chair.jpg' },
  { name: 'Smart Coffee Maker', description: 'Wi-Fi enabled coffee maker with mobile app control', category: 'Appliances', price: 129.99, quantity: 75, image: 'https://example.com/coffeemaker.jpg' },
  { name: 'Wireless Earbuds', description: 'True wireless earbuds with noise cancellation', category: 'Electronics', price: 159.99, quantity: 80, image: 'https://example.com/earbuds.jpg' },
  { name: 'Ultra HD Smart TV', description: '65-inch 4K Smart TV with HDR', category: 'Electronics', price: 899.99, quantity: 40, image: 'https://example.com/tv.jpg' },
  { name: 'Robot Vacuum Cleaner', description: 'Smart robot vacuum with mapping technology', category: 'Appliances', price: 349.99, quantity: 60, image: 'https://example.com/vacuum.jpg' },
  { name: 'Electric Standing Desk', description: 'Adjustable height standing desk', category: 'Furniture', price: 499.99, quantity: 25, image: 'https://example.com/desk.jpg' },
  { name: 'Wireless Gaming Mouse', description: 'High-precision wireless gaming mouse', category: 'Electronics', price: 79.99, quantity: 120, image: 'https://example.com/mouse.jpg' },
  { name: 'Smart Home Security System', description: 'DIY home security system with cameras and sensors', category: 'Electronics', price: 299.99, quantity: 50, image: 'https://example.com/security.jpg' },
];

const sampleSuppliers = [
  { 
    companyName: 'TechGadgets Inc.', 
    industry: 'Electronics', 
    location: { country: 'USA', state: 'California', city: 'San Francisco' }, 
    description: 'Leading supplier of cutting-edge electronic devices', 
    verified: true,
    logo: 'https://example.com/techgadgets-logo.png',
    coverImage: 'https://example.com/techgadgets-cover.jpg'
  },
  { 
    companyName: 'FurniturePlus', 
    industry: 'Furniture', 
    location: { country: 'Canada', state: 'Ontario', city: 'Toronto' }, 
    description: 'Quality furniture for home and office spaces', 
    verified: true,
    logo: 'https://example.com/furnitureplus-logo.png',
    coverImage: 'https://example.com/furnitureplus-cover.jpg'
  },
  { 
    companyName: 'SmartHome Solutions', 
    industry: 'Electronics', 
    location: { country: 'Germany', state: 'Bavaria', city: 'Munich' }, 
    description: 'Innovative smart home devices and systems', 
    verified: false,
    logo: 'https://example.com/smarthome-logo.png',
    coverImage: 'https://example.com/smarthome-cover.jpg'
  },
  { 
    companyName: 'EcoAppliances', 
    industry: 'Appliances', 
    location: { country: 'Japan', state: 'Tokyo', city: 'Tokyo' }, 
    description: 'Energy-efficient home appliances for modern living', 
    verified: true,
    logo: 'https://example.com/ecoappliances-logo.png',
    coverImage: 'https://example.com/ecoappliances-cover.jpg'
  },
  { 
    companyName: 'GameTech Peripherals', 
    industry: 'Electronics', 
    location: { country: 'South Korea', state: 'Seoul', city: 'Seoul' }, 
    description: 'High-performance gaming accessories and peripherals', 
    verified: true,
    logo: 'https://example.com/gametech-logo.png',
    coverImage: 'https://example.com/gametech-cover.jpg'
  },
];

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Supplier.deleteMany({});

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`${products.length} products inserted`);

    // Insert sample suppliers
    const suppliers = await Supplier.insertMany(sampleSuppliers);
    console.log(`${suppliers.length} suppliers inserted`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
