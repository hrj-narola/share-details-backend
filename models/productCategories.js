const mongoose = require('mongoose');

// Define the schema for the product categories
const productCategoriesSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
  },
  parentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'productCategories',
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  images: {
    type: [String],
    default: []
  }
}, { timestamps: true });

// To ensure that the combination of name and parentId is unique
productCategoriesSchema.index({ slug: 1, parentId: 1 }, { unique: true });

const ProductCategories = mongoose.model('productCategories', productCategoriesSchema);

module.exports = ProductCategories;
