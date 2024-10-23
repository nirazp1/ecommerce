const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'supplier'], required: true },
  profile: {
    fullName: { type: String },
    companyName: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    description: { type: String },
    // For suppliers
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    // For buyers
    purchaseHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Order' }]
  },
  kycVerified: { type: Boolean, default: false },
  favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
