const mongoose = require('mongoose');

// Define the schema for the user
const inquiryStatusSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true,
  },
  isActive: {
    type: Boolean,
    default: false
  }
}, { timestamps: true });

// Create the model
const InquiryStatus = mongoose.model('inquiryStatus', inquiryStatusSchema);

module.exports = InquiryStatus;
