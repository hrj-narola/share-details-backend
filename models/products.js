const mongoose = require('mongoose');

// Define the schema for the user
const productsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String
  },
  price: {
    type: Number,
    required: true
  },
  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productCategories',
    required: true
  },
  images: {
    type: [String],
    default: []
  },
  stock: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  color: {
    type: String,
    enum: ['red', 'blue', 'green', 'black', 'white'],
    default: null,
  }
}, { timestamps: true });  // This will automatically add createdAt and updatedAt fields

// Create the model
const Products = mongoose.model('products', productsSchema);

module.exports = Products;