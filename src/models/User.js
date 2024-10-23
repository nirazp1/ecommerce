const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['buyer', 'seller'], required: true },
  profile: {
    fullName: { type: String },
    companyName: { type: String },
    storeName: { type: String },
    address: { type: String },
    phoneNumber: { type: String },
    description: { type: String },
    storePhotos: [{ type: String }], // URLs of store photos
    productCategories: [{ type: String }], // List of product categories
  },
  kycVerified: { type: Boolean, default: false },
  favoriteProducts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
