const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  supplierId: { type: mongoose.Schema.Types.ObjectId, ref: 'Supplier', required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  images: [{ type: String }],
  discounts: [{
    minQuantity: { type: Number },
    discountPercentage: { type: Number }
  }]
});

module.exports = mongoose.model('Product', productSchema);
