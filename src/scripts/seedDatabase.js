const mongoose = require('mongoose');
require('dotenv').config();

// Import your models
const Product = require('../models/Product');
const Supplier = require('../models/Supplier');

// Function to generate random price
const randomPrice = () => (Math.random() * (1000 - 10) + 10).toFixed(2);

// Function to generate random quantity
const randomQuantity = () => Math.floor(Math.random() * (500 - 10) + 10);

// Function to get random image URL
const randomImage = (category) => `https://source.unsplash.com/featured/?${category}`;

// Function to get random city
const randomCity = () => {
  const cities = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'Philadelphia', 'San Antonio', 'San Diego', 'Dallas', 'San Jose'];
  return cities[Math.floor(Math.random() * cities.length)];
};

// Function to get random country
const randomCountry = () => {
  const countries = ['USA', 'Canada', 'UK', 'Germany', 'France', 'Japan', 'Australia', 'Brazil', 'India', 'China'];
  return countries[Math.floor(Math.random() * countries.length)];
};

// Add this function to generate random state
const randomState = () => {
  const states = ['CA', 'NY', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA', 'NC', 'MI'];
  return states[Math.floor(Math.random() * states.length)];
};

// Modify the sampleSuppliers array generation
const sampleSuppliers = Array.from({ length: 100 }, (_, index) => {
  const industries = ['Electronics', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Toys', 'Sports', 'Beauty', 'Food', 'Automotive'];
  const industry = industries[Math.floor(Math.random() * industries.length)];
  return {
    companyName: `Supplier ${index + 1}`,
    industry: industry,
    location: { 
      country: randomCountry(), 
      city: randomCity(),
      state: randomState() // Add state to the location object
    },
    description: `Leading supplier of ${industry.toLowerCase()} products`,
    verified: Math.random() < 0.7, // 70% chance of being verified
    logo: `https://via.placeholder.com/150?text=Supplier${index + 1}`,
    coverImage: randomImage('business'),
    userId: new mongoose.Types.ObjectId() // Generate a random ObjectId for userId
  };
});

async function seedDatabase() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Supplier.deleteMany({});

    // Insert sample suppliers
    const suppliers = await Supplier.insertMany(sampleSuppliers);
    console.log(`${suppliers.length} suppliers inserted`);

    // Generate 100 sample products
    const sampleProducts = Array.from({ length: 100 }, (_, index) => {
      const categories = ['Electronics', 'Furniture', 'Appliances', 'Clothing', 'Books', 'Toys', 'Sports', 'Beauty', 'Food', 'Automotive'];
      const category = categories[Math.floor(Math.random() * categories.length)];
      return {
        name: `Product ${index + 1}`,
        description: `This is a sample description for Product ${index + 1}`,
        category: category,
        price: randomPrice(),
        quantity: randomQuantity(),
        image: randomImage(category),
        supplierId: suppliers[Math.floor(Math.random() * suppliers.length)]._id // Assign a random supplier
      };
    });

    // Insert sample products
    const products = await Product.insertMany(sampleProducts);
    console.log(`${products.length} products inserted`);

    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedDatabase();
