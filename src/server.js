require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const http = require('http');
const socketIo = require('socket.io');
const morgan = require('morgan');
const authRoutes = require('./auth/authRoutes');
const inventoryRoutes = require('./inventory/inventoryRoutes');
const paymentRoutes = require('./payments/paymentRoutes');
const searchRoutes = require('./search/searchRoutes');
const socketManager = require('./socket');
const cors = require('cors');
const profileRoutes = require('./routes/profileRoutes');
const orderRoutes = require('./routes/orderRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();

// Middleware
app.use(express.json());
app.use(morgan('dev'));
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Wholesale Platform API' });
});
app.use('/auth', authRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/payments', paymentRoutes);
app.use('/search', searchRoutes);
app.use('/profile', profileRoutes);
app.use('/orders', orderRoutes);
app.use('/products', productRoutes);

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

// Create HTTP server
const server = http.createServer(app);

// Set up Socket.io
const io = socketIo(server);
socketManager.init(io);

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
