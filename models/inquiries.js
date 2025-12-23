const mongoose = require('mongoose');

// Define the schema for the user
const inquiriesSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
  },
  number: {
    type: String,
    required: false,
    select: false
  },
  productId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'products',
  },
  quantity: {
    type: Number,
    required: false
  },
  size: {
    type: String,
    required: false
  },
  customerGroup: {
    type: String,
    required: false,
  },
  intrestedCategory: {
    type: String,
    required: false,
  },
  designRequirements: {
    type: String,
    required: false
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'inquiryStatus',
  },
  note: {
    type: String,
    required: false,
    default: ""
  }
}, { timestamps: true });

// Create the model
const Inquiries = mongoose.model('inquiries', inquiriesSchema);

module.exports = Inquiries;
